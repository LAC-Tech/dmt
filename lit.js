//@ts-check
///<reference path="./lit.d.ts"/>
import {deepEql} from './rollup.output.js'

/** @type {(test: DMT.Test) => DMT.TestResult} */
export const evaluateTest = test => {
	const assertion = test()
	if ('equals' in assertion) {
		if (assertion.check == assertion.equals)
			return {kind: 'success'}
		else
			return {kind: 'fail', actual: assertion.check, expected: assertion.equals}
	} else if ('deepEquals' in assertion) {
		if (deepEql(assertion.check, assertion.deepEquals))
			return {kind: 'success'}
		else
			return {kind: 'fail', actual: assertion.check, expected: assertion.deepEquals}
	} else if ('throws' in assertion) {
		try {
			assertion.check()
		} catch (err) {
			return evaluateTest(() => ({check: err, deepEquals: assertion.throws}))
		}

		return {kind: 'fail', actual: undefined, expected: assertion.throws}
	}

	throw 'Not implemented'
}


/** @type {(tests: DMT.Tests) => DMT.TestResults} */
export const evaluateTestSuite = testSuite => {
	return {}
}
