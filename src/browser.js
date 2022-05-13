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

/** @type {DMT.ViewModelStrategy<Node>} */
const vm = {
	success: (...children) => h('span', {className: 'success'}, children),
	fail: (...children) => h('span', {className: 'fail'}, children),
	same: innerText => h('span', {innerText}),
	diff: lines => h('pre', {className: 'diff'}, lines),
	exn: error => h('pre', {}, error),
	successfulTest: child => h('div', {className: 'successful-test'}, 
		child),
	failedTest: (descr, child) => h('div', {className: 'failed-test'}, [
		descr,
		child
	]),
	description: (str, suffix) => 
		h('div', {className: 'description'}, [str, suffix]),
	sub: n => h('small', {}, h('sub', {}, n.toString())),
	testResultsLeaf: (expanded, tallies, children) => text => {
		const summary = h('summary', {}, [
			h('b', {}, text),
			...tallies
		])

		return h('details', {open: expanded}, [summary, ...children])
	}
}

const testChildren = viewmodel(vm)
