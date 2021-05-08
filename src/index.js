import {render as litHtmlRender} from 'lit-html'
import {Suite, TestResult, Test, Count, HtmlTemplate} from './types'
import {sumCounts, evaluateSuite, isTestResult} from './core'
import * as view from './views'

/**
	@param {HTMLElement} elem
	@param {Suite<Test>} testSuite
*/
export default async (elem, testSuite) => {
	const suite = await evaluateSuite(testSuite)
	const {templates, count} = await render(name, suite, 0)

	const {fails} = count
	document.title = `tests ${fails == 0 ? '✓': `✖${fails}`}`
	litHtmlRender(view.root(templates),	elem)
}

/**
	@param {string} name
	@param {Suite<TestResult> | TestResult} suite
	@param {number} indent
	@return {Promise<{templates: HtmlTemplate[], count: Count}>}
*/
const render = async (name, suite, indent) => {
	if (isTestResult(suite)) {
		const success = suite.kind === 'success'
		const count = success ? {passes: 1, fails: 0} : {passes: 0, fails: 1}
		return {count, templates: view.testResult(name, suite)}
	}

	// TODO: what in the fuck are 'asyncChildren' ?
	const asyncChildren = Object.entries(suite).map(async ([
		subName, subSuite
	]) => ({
		name: subName,
		suite: subSuite,
		indent: indent + 1,
		...await render(subName, subSuite, indent + 1)
	}))

	const children = await Promise.all(asyncChildren)

	const templates = children.flatMap(n => 
		isTestResult(n.suite) ? view.testResult(n.name, n.suite) : view.node(n)
	)

	const count = sumCounts(children.map(c => c.count))

	return {templates, count}
}
