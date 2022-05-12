//@ts-check
///<reference types="./types"/>
import { diffJson } from "diff"
import {equals} from "rambda"

export {evalTestSuite}

/** @type {(test: DMT.Test) => Promise<DMT.TestResult>} */
const evalTest = async test => {
	try {
		const assertion = await Promise.resolve(test())
		if ('expected' in assertion) {
			return evalDeepEquals(assertion)
		} else if ('throws' in assertion) {
			try {
				assertion.assert()
			} catch (err) {
				return evalDeepEquals({actual: err, expected: assertion.throws})
			}

			return notEqual(undefined, assertion.throws)
		}

		const keys = Object.keys(assertion)
		throw `Unable to evaluate assertion with fielsd ${keys}`
	} catch (exn) {
		return {kind: 'fail', reason: {kind: 'threw-exn', error: `${exn}`}}
	}
}

/** @type {(assertion: DMT.AssertEquals) => DMT.TestResult} */
const evalDeepEquals = ({actual, expected}) => 
	equals(actual, expected) ? {kind: 'pass'} : notEqual(actual, expected)

/** @type {(actual: any, expected: any) => DMT.TestFail} */
const notEqual = (actual, expected) => {
	/** @type {DMT.Change[]} */
	const changes = (() => {
		if (actual === undefined && expected === undefined) {
			return []
		} else if (actual === undefined || expected === undefined) {
			return [
				{kind: 'actual', value: actual}, 
				{kind: 'expected', value: expected}
			]
		} else { 
			return diffJson(actual, expected).map(({added, removed, value}) => {
				if (removed) return {kind: 'actual', value}
				if (added) return {kind: 'expected', value}
				else return {kind: 'same', value}
			})
		}
	})()

	return {kind: 'fail', reason: {kind: 'not-equal', changes}}
}

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
