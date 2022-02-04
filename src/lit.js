//@ts-check
///<reference path="./dmt.d.ts"/>
import { diffJson } from "diff"
import {equals} from "rambda"

export {evalTestSuite}

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

		const keys = Object.keys(assertion)
		throw `Unable to evaluate assertion with fields ${keys}`
	} catch (exn) {
		const error = typeof exn === 'string' ? exn : JSON.stringify(exn)
		return {kind: 'fail', reason: {kind: 'threw-exn', error}}
	}
}

/** @type {(assertion: DMT.AssertDeepEquals) => DMT.TestResult} */
const evalDeepEquals = ({check, deepEquals}) => {
	if (equals(check, deepEquals))
		return {kind: 'pass'}
	else
		return notEqual(check, deepEquals)
}

/** @type {(actual: any, expected: any) => DMT.TestFail} */
const notEqual = (actual, expected) => ({
	kind: 'fail',
	reason: {
		kind: 'not-equal',
		changes: diffJson(actual, expected)
	}
})

/**
	Tree-recursion is fine for trees that are never going to be that big.

	If it really gets too much, consider evluating using a stack
	
	@type {(tests: DMT.TestSuite) => Promise<DMT.TestResults>} 
*/
const evalTestSuite = async testSuite => {
	/** @type DMT.TestResults */
	const testResults = {passes: 0, fails: 0, children: {}}
	
	for (const [description, t] of Object.entries(testSuite)) {
		if (isTest(t)) {
			const tr = await evalTest(t)
			const [passes, fails] = sumTestResult(tr)
			testResults.passes += passes
			testResults.fails += fails
			testResults.children[description] = tr
		} else {
			const trs = await evalTestSuite(t)
			const [passes, fails] = sumTestResults(trs.children)
			testResults.passes += passes
			testResults.fails += fails
			testResults.children[description] = trs
		}
	}
	
	return testResults
}

/** @param {DMT.TestResults['children']} trs */
const sumTestResults = trs => Object.values(trs).reduce(([passes, fails], t) => {
	const [p, f] = 'kind' in t ? sumTestResult(t) : [t.passes, t.fails]
	return [passes + p, fails + f]
}, [0, 0])

/** @param {DMT.TestResult} tr */
const sumTestResult = tr => tr.kind == 'pass' ? [1, 0] : [0, 1]

/** @type {(t: DMT.TestSuite | DMT.Test) => t is DMT.Test} */
const isTest = t => typeof t === "function"

//const isTestResult = t 