const deepEql = require('deep-eql')

import {
	Suite,
	TestResult,
	Summary,
	Test
} from './types'

export {combineSummaries, evaluateSuite, deepMap, isTestResult}

const combineSummaries = (ss: Summary[]) => ss.reduce((x, y) => ({
	passes: x.passes + y.passes,
	fails: x.fails + y.fails
}), {passes: 0, fails: 0})

const isTest = (t: Test | Suite<Test>): t is Test => typeof t === "function"

const isTestResult = (
	t: TestResult | Suite<TestResult>
): t is TestResult => {
	if (t.kind === 'exn') return 'error' in t
	if (t.kind === 'fail') return 'actual' in t && 'expected' in t
	if (t.kind === 'success') return true

	return false
}

const equalFromBinaryPredicate = (
	equal: (a: any, b: any) => boolean
) => (actual: any, expected: any): TestResult => {
	if (!equal(actual, expected)) return {kind: 'fail',	actual,	expected}
	return {kind: 'success'}
}

const deepEqual = equalFromBinaryPredicate(deepEql)
const equal = equalFromBinaryPredicate((a, b) => a === b)

const throws = (checkThunk: () => any, expectedExn: any) => {
	const check = (() => {
		try {
			return checkThunk()
		} catch (actualExn) {
			return actualExn
		}
	})()

	return deepEqual(check, expectedExn)
}

const evaluateTest = async (test: Test): Promise<TestResult> => {
	try {
		const calledTest = await Promise.resolve(test())
		const {check} = calledTest

		const result = 
			'deepEquals' in calledTest ? deepEqual(check, calledTest.deepEquals) :
			'equals' in calledTest ? equal(check, calledTest.equals) :
			throws(check, calledTest.throws)

		return result
	} catch (error) {
		return {kind: 'exn', error}
	}
}

const evaluateSuite = async (suite: Suite<Test>): Promise<Suite<TestResult>> => 	deepMap(suite, evaluateTest)

const deepMap = async (
	suite: Suite<Test>,
	e: (typeof evaluateTest)
): Promise<Suite<TestResult>> => {
  const result: {[key: string]: any} = {}

  for(const description of Object.keys(suite)) {
  	const v = suite[description]
    const newVal = isTest(v) ? e(v) : deepMap(v, e)
    result[description] = await newVal;
  }

	return result
}