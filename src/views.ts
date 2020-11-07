import {html, TemplateResult} from 'lit-html'
import {Count, HtmlTemplate, TestResult} from './types'
const {diffJson} = require('diff')

export {node, testResult, root}

const successResult = (description: string) =>
	testOutput([success('✓'), description])

const failResult = (description: string, stacktrace: string) => ([
	[fail('✖'), description],
	[`stacktrace: ${stacktrace}`]
].map(testOutput))

const success = (text: string) => html`<span class="success">${text}</span>`
const fail = (text: string) => html`<span class="fail">${text}</span>`

const	testOutput = (templates: (string | TemplateResult)[]) => html`
	<div class="result"><pre>${templates}</pre></div>`

const text = (type: 'success' | 'fail', str: string, n: number) => {
	if (n == 0) return html``

	return html`
		<span class=${type}>
			${str}<small><sub>${n}</sub></small>
		</span>`
}

const testResult = (description: string, result: TestResult) => {	
	switch(result.kind) {
		case 'success': return [successResult(description)]
		case 'fail': return ([
			diff(description, diffJson(result.actual, result.expected))
		])
		case 'exn': {
			return failResult(description, result.stacktrace)
		}
	}
}

const node = ({name, count, indent, templates}: {
	name: string,
	count: Count,
	indent: number,
	templates: HtmlTemplate[] // TODO: 'views' of what?
}) => {
	const {passes, fails} = count

	return html`
		<details ?open=${fails != 0}>
			<summary class=${`h${indent}`}>
				<b>${name}</b>
				${text('success', '✓', passes)}
				${text('fail', '✖', fails)}
			</summary>
			${templates}
		</details>`
}

const diff = (
	description: string,
	lines: {added: any, removed: any, value: any}[]
) => {
	const diffLines = lines.map(({added, removed, value}) => {
		if (added) return success(value)
		if (removed) return fail(value)
		else return value
	})

	return html`
		<div class="result">
			<pre>${fail('✖')}${description}</pre>			
			<pre class='diff'>${diffLines}</pre>
		</div>`
}

const root = (views: TemplateResult[]) => html`
	<style>
	.h1 {
		margin-left: 0em;	
	}

	.h2 {
		margin-left: 0.5em;
	}

	.h3 {
		margin-left: 1em;
	}

	.h4 {
		margin-left: 1.5em;
	}

	.h5 {
		margin-left: 2em
	}

	.h6 {
		margin-left: 2.5em;
	}

	.h7 {
		margin-left: 3em;
	}

	html {
		color: whitesmoke;
		background: #000007;
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	}

	details summary {
		font-size: smaller;
		letter-spacing: 0.075em;
	}

	@media (min-width:960px) {
		html {
			font-size: x-large;
		}
	}

	.success {	
		color: #5fff5f;
	}

	.fail {
		color: #ff5f5f;
	}

	.success, .fail {
		padding-right: 0.125rem;
	}

	.diff {
		font-size: smaller;
	}

	.result {
		font-family: monospace;
		margin-left: 2em;
	}

	pre {
		margin: 0;
	}
	</style>
	<div>${views}</div>`
