//@ts-check
/// <reference path="./types.d.ts"/>
const deepEql = require('deep-eql')

export {sumCounts, evaluateSuite, evaluateTest, isTestResult}

/** @param {DMT.Count[]} cs */
const sumCounts = cs => cs.reduce((x, y) => ({
	passes: x.passes + y.passes,
	fails: x.fails + y.fails
}), {passes: 0, fails: 0})

/** @type {(t: DMT.Test | DMT.Suite<DMT.Test>) => t is Test} */
const isTest = t => typeof t === "function"

/** @type {(t: TestResult | Suite<TestResult>) => t is TestResult} */
const isTestResult = t => {
	if (t.kind === 'exn') return 'error' in t
	if (t.kind === 'fail') return 'actual' in t && 'expected' in t
	if (t.kind === 'success') return true

	return false
}

/**
	@param {(a: any, b: any) => boolean} predicate
	@return {(actual: any, expected: any) => TestResult}
*/
const equalFromPredicate = predicate => (actual, expected) => {
	if (!predicate(actual, expected)) return {kind: 'fail',	actual,	expected}
	return {kind: 'success'}
}

const deepEqual = equalFromPredicate(deepEql)
const equal = equalFromPredicate((a, b) => a === b
/**
	@param {() => any} checkThunk
	@param {any} expectedExn
*/
const throws = (checkThunk, expectedExn) => {
	const check = (() => {
		try {
			return checkThunk()
		} catch (actualExn) {
			return actualExn
		}
	})()

	return deepEqual(check, expectedExn)
}

/** @type {(test: Test) => Promise<TestResult>} */
const evaluateTest = async test => {
	try {
		const calledTest = await Promise.resolve(test())
		const {check} = calledTest

		const result = 
			'deepEquals' in calledTest ? deepEqual(check, calledTest.deepEquals) :
			'equals' in calledTest ? equal(check, calledTest.equals) :
			throws(check, calledTest.throws)

		return result
	} catch (error) {
		return {kind: 'exn', stacktrace: error.stack}
	}
}

/** @type {(suite: Suite<Test>) => Promise<Suite<TestResult>>} */
const evaluateSuite = async suite => mapTestSuite(suite, evaluateTest)

/** 
	@param {Suite<Test>} suite
	@param {typeof evaluateTest} e
	@return {Promise<Suite<TestResult>>}
*/
const mapTestSuite = async (suite, e) => {
	const result = {}
	/** @type {{[key: string]: any}} */

  for(const description of Object.keys(suite)) {
  	const v = suite[description]
    const newVal = isTest(v) ? e(v) : mapTestSuite(v, e)
    result[description] = await newVal;
  }

	return result
}
