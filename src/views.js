import {html, TemplateResult} from 'lit-html'
import {Count, HtmlTemplate, TestResult} from './types'
const {diffJson} = require('diff')

export {node, testResult, root}

/** @param {string} description */
const successResult = description => testOutput([success('✓'), description])

/**
	@param {string} description
	@param {string} stacktrace
*/
const failResult = (description, stacktrace) => ([
	[fail('✖'), description],
	[`stacktrace: ${stacktrace}`]
].map(testOutput))

/** @param {string} text */
const success = text => html`<span class="success">${text}</span>`
/** @param {string} text */
const fail = text => html`<span class="fail">${text}</span>`

/** @param {string | TemplateResult} templates */
const	testOutput = templates => 
	html`<div class="result"><pre>${templates}</pre></div>`

/** @type {(type: 'success' | 'fail', str: string, n: number) => HtmlTemplate */
const text = (type, str, n) => {
	if (n == 0) return html``

	return html`
		<span class=${type}>
			${str}<small><sub>${n}</sub></small>
		</span>`
}

/**
	@param {string} description
	@param {TestResult} result
*/
const testResult = (description, result) => {	
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

/** @param {{name: string, count: Count, indent: number, templates: HtmlTemplate}} _ */
const node = ({name, count, indent, templates}) => {
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

/**
	@param {string} description
	@param {{added: any, removed: any, value: any}[]} lines
*/
const diff = (description, lines) => {
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

/** @param {TemplateResult[]} views */
const root = views => html`
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
