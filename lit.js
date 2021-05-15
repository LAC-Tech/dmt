//@ts-check
///<reference path="./dmt.d.ts"/>
import {deepEql} from './rollup.output.js'

/** @type {(test: DMT.Test) => Promise<DMT.TestResult>} */
const evaluateTest = async test => {
	try {
		const assertion = await Promise.resolve(test())
		if ('equals' in assertion) {
			if (assertion.check == assertion.equals)
				return {kind: 'pass'}
			else
				return notEqual(assertion.check, assertion.equals)
		} else if ('deepEquals' in assertion) {
			return evalDeepEquals(assertion)
		} else if ('throws' in assertion) {
			try {
				assertion.check()
			} catch (err) {
				return evalDeepEquals({check: err, deepEquals: assertion.throws})
			}

			return notEqual(undefined, assertion.throws)
		}

		throw 'Not implemented'
	} catch (error) {
		return {kind: 'fail', reason: {kind: 'threw-exn', error}}
	}
}

/** @type {(assertion: DMT.AssertDeepEquals) => DMT.TestResult} */
const evalDeepEquals = ({check, deepEquals}) => {
	if (deepEql(check, deepEquals))
		return {kind: 'pass'}
	else
		return notEqual(check, deepEquals)
}

/** @type {(actual: unknown, expected: unknown) => DMT.TestFail} */
const notEqual = (actual, expected) => ({
	kind: 'fail',
	reason: {
		kind: 'not-equal',
		actual,
		expected
	}
})

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
