//@ts-check
import viewmodel from "./viewmodel.js"

/** @param {DMT.TestResults} trs */
export default ({fails, passes, children}) => {
	const testSummary = fails == 0 ? '✓': `✖${fails}`
	document.title = `dmt ${testSummary}`

	const result = document.createDocumentFragment()
	const style = document.createElement('style');
	style.textContent = `
			html {
				color: whitesmoke;
				background: #000007;
				font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
			}

			/* ensures nested test results are indented */
			details, .failed-test {
				padding-left: 1em;
			}

			.description {
				font-style: italic;
			}

			details summary {
				letter-spacing: 0.075em;
			}

			@media (min-width:960px) {
				html {
					font-size: x-large;
				}
			}

			.success {	
				color: #3fff3f;
			}

			.fail {
				color: #ff3f3f;
			}

			.diff {
				font-size: small;
			}

			.failed-test, .successful-test {
				padding-left: 1em;
			}


			pre {
				font-family: monospace;
				margin: 0;
				padding-left: 1em;
			}
	`

	result.append(style)

	const topLevelNodes = testChildren(children)

	for (const node of topLevelNodes)
		result.appendChild(node)

	return result
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tagName
 * @param {Partial<HTMLElementTagNameMap[K]>} attributes
 * @param {string | Node | Array<string | Node>} children}
 * @return {HTMLElementTagNameMap[K]}
 */
const h = (tagName, attributes, children = []) => {
	const result = document.createElement(tagName)
	Object.assign(result, attributes)
	if (Array.isArray(children)) {
		result.append(...children)
	} else {
		result.append(children)
	}
	return result
}

/** @type {DMT.ViewModelKernel<Node>} */
const kernel = {
	success: innerText => h('span', {innerText, className: 'success'}),
	fail: innerText => h('span', {innerText, className: 'fail'}),
	tally: (type, s, n) => h('span', {className: type}, [
		s,
		h('small', {}, h('sub', {}, n.toString()))
	]),
	description: (str, suffix) => 
		h('div', {className: 'description'}, [str, suffix])
}

/** @type {DMT.ViewModelStrategy<Node>} */
const strategy = {
	/** @param {string} descr */
	successfulTest: descr => h('div', {className: 'successful-test'}, 
		kernel.description(descr, kernel.success('✓'))),

	/** @type {(descr: string, tf: DMT.TestFail) => Node} */
	failedTest: (descr, {reason}) => {
		const child = (() => {
			switch (reason.kind) {
				case 'not-equal': {
					const diffLines = reason.changes.map(({kind, value}) => {
						switch (kind) {
							case 'expected': return kernel.fail(value)
							case 'actual': return kernel.success(value)
							case 'same': return h('span', {innerText: value})
						}
					})

					return h('pre', {className: 'diff'}, diffLines)
				}
				case 'threw-exn': {
					return h('pre', {}, kernel.fail(reason.error))
				}
			}	
		})()

		return h('div', {className: 'failed-test'}, [
			kernel.description(descr, kernel.fail('✖')),
			child
		])
	},

	testResultsLeaf: ({fails, passes, children}) => descr => {
		const summary = h('summary', {}, [
			h('b', {}, descr),
			...(passes > 0 ? [kernel.tally('success', '✓', passes)] : []),
			...(fails > 0 ? [kernel.tally('fail', '✖', fails)] : [])
		])

		return h('details', {open: fails != 0}, [summary, ...children])
	}
}

const {testResult, testChildren, testResults} = viewmodel(strategy)
