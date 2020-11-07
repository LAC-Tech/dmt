import {render as litHtmlRender} from 'lit-html'
import {Suite, TestResult, Test, Count, R} from './types'
import {sumCounts, evaluateSuite, isTestResult} from './core'
import * as view from './views'

export default async (elem: HTMLElement, testSuite: Suite<Test>) => {
	const suite = await evaluateSuite(testSuite)
	const {views, count} = await render(name, suite, 0)

	const {fails} = count
	document.title = `tests ${fails == 0 ? '✓': `✖${fails}`}`
	litHtmlRender(view.root(views),	elem)
}

const render = async (
	name: string, suite: Suite<TestResult> | TestResult, depth: number
): Promise<{views: R[], count: Count}> => {
	
	if (isTestResult(suite)) {
		const success = suite.kind === 'success'
		const count = success ? {passes: 1, fails: 0} : {passes: 0, fails: 1}
		return {count, views: view.testResult(name, suite)}
	}
	
	const asyncChildren = Object.entries(suite).map(async ([
		subName, subSuite
	]) => ({
		name: subName,
		depth: depth+1,
		suite: subSuite,
		...await render(subName, subSuite, depth+1)
	}))

	const children = await Promise.all(asyncChildren)

	const views = children.flatMap(n => 
		isTestResult(n.suite) ? view.testResult(n.name, n.suite) : view.node(n)
	)

	const count = sumCounts(children.map(c => c.count))

	return {views, count}
}
