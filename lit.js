//@ts-check
///<reference path="./lit.d.ts"/>
import {deepEql} from './rollup.output.js'

/** @type {(test: DMT.Test) => DMT.TestResult} */
export const evaluateTest = test => {
	if ('equals' in test) {
		if (test.check == test.equals)
			return {kind: 'success'}
		else
			return {kind: 'fail', actual: test.check, expected: test.equals}
	} else if ('deepEquals' in test) {
		if (deepEql(test.check, test.deepEquals))
			return {kind: 'success'}
		else
			return {kind: 'fail', actual: test.check, expected: test.deepEquals}
	} else if ('throws' in test) {
		try {
			test.check()
		} catch (err) {
			return evaluateTest({check: err, deepEquals: test.throws})
		}

		return {kind: 'fail', actual: undefined, expected: test.throws}
	}

	throw 'Not implemented'
}


/** @type {(tests: DMT.Tests) => DMT.TestResults} */
export const evaluateTestSuite = testSuite => {
	return {}
}
