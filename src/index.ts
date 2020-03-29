import {render as litHtmlRender} from 'lit-html'
import {Suite, TestResult, Test, Summary, R} from './types'
import {combineSummaries, evaluateSuite, isTestResult} from './core'
import * as view from './views'

export {run, evaluateSuite, Suite, Test, TestResult}

const run = async (
	elem: HTMLElement,
	{client, server}: Partial<{client: Suite<Test>, server: Suite<TestResult>}>
) => {
	const suite = {
		server: server || {},
		client: await evaluateSuite(client || {})
	}

	const {views, summary} = await render(name, suite, 0)

	const {fails} = summary
	document.title = `tests ${fails == 0 ? '✓': `✖${fails}`}`
	litHtmlRender(view.root(views),	elem)
}

const render = async (
	name: string,
	suite: Suite<TestResult> | TestResult,
	depth: number
): Promise<{views: R[], summary: Summary}> => {
	if (isTestResult(suite)) {
		const success = suite.kind === 'success'
		const summary = success ? {passes: 1, fails: 0} : {passes: 0, fails: 1}
		return {summary, views: view.testResult(name, suite)}
	}
	
	const asyncChildren = Object
		.entries(suite)
		.map(async ([subName, subSuite]) => ({
			name: subName,
			depth: depth+1,
			...await render(subName, subSuite, depth+1)
		}))

	const children = await Promise.all(asyncChildren)

	const views = children.flatMap(view.node)
	const summary = combineSummaries(children.map(c => c.summary))

	return {views, summary}
}