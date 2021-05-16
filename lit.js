//@ts-check
///<reference path="./dmt.d.ts"/>
import {deepEql} from './rollup.output.js'

/** @type {(test: DMT.Test) => Promise<DMT.TestResult>} */
const evalTest = async test => {
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
	Tree-recursion is fine for trees that are never going to be that big.

	If it really gets too much, consider evluating using a stack
	
	@type {(tests: DMT.TestSuite) => Promise<DMT.TestResults>} 
*/
export const evalTestSuite = async testSuite => {
	/** @type DMT.TestResults */
	const testResults = {}
	
	for (const [description, t] of Object.entries(testSuite)) {
		if (isTest(t)) {
			testResults[description] = await evalTest(t)
		} else {
			/** @type DMT.TestResults */
			const trs = await evalTestSuite(t)
			const [passes, fails] = sumTestResults(trs)
			testResults[description] = {passes, fails, children: trs}
		}
	}
	
	return testResults
}

/** @param {DMT.TestResults} trs */
const sumTestResults = trs => Object.values(trs).reduce(([passes, fails], t) => {
	const [p, f] = 
		'kind' in t ? (t.kind == 'pass' ? [1, 0] : [0, 1]) : [t.passes, t.fails]
	return [passes + p, fails + f]
}, [0, 0])

/** @type {(t: DMT.TestSuite | DMT.Test) => t is DMT.Test} */
const isTest = t => typeof t === "function"
