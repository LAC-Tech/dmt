//@ts-check
///<reference path="./lit.d.ts"/>
import {deepEql} from './rollup.output.js'

/** @type {(test: DMT.Test) => Promise<DMT.TestResult>} */
export const evaluateTest = async test => {
	try {
		const assertion = await Promise.resolve(test())
		if ('equals' in assertion) {
			if (assertion.check == assertion.equals)
				return {kind: 'success'}
			else
				return {kind: 'fail', actual: assertion.check, expected: assertion.equals}
		} else if ('deepEquals' in assertion) {
			return evalDeepEquals(assertion)
		} else if ('throws' in assertion) {
			try {
				assertion.check()
			} catch (err) {
				return evalDeepEquals({check: err, deepEquals: assertion.throws})
			}

			return {kind: 'fail', actual: undefined, expected: assertion.throws}
		}

		throw 'Not implemented'
	} catch (error) {
		return {kind: 'exn', error}
	}
}

/** @type {(assertion: DMT.AssertDeepEquals) => DMT.TestResult} */
const evalDeepEquals = ({check, deepEquals}) => {
	if (deepEql(check, deepEquals))
		return {kind: 'success'}
	else
		return {kind: 'fail', actual: check, expected: deepEquals}
}

/**
	@todo - pretty sure this will blow up for big test suites
	recursion is not in tailcall position (assuming browsers to TCO)
	if they do, look at SICP exercise where they show fast recursive factorial
	else look at how to emulate recursion in Java with an explicit stack

	@type {(tests: DMT.Tests) => Promise<DMT.TestResults>} 
*/
export const evaluateTestSuite = async testSuite => {
	/** @type DMT.TestResults */
	const testResults = {}
	
	for (const [k, v] of Object.entries(testSuite)) {
		testResults[k] = await (isTest(v) ? evaluateTest(v) : evaluateTestSuite(v))
	}
	
	return testResults
}

/** @type {(t: DMT.Tests | DMT.Test) => t is DMT.Test} */
const isTest = t => typeof t === "function"

/** @type {(trs: DMT.TestResults) => string} */
const testResultsToString = trs => {
	/** @type {string[]} */
	const lines = []

	return lines.join('\n')
}
