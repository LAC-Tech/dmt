//@ts-check

///<reference path="./index.d.ts"/>

/** @param {DMT.TestResults} trs */
export default ({fails, passes, children}) => {
	const testSummary = fails == 0 ? '✓': `✖${fails}`
	document.title = `dmt ${testSummary}`

	const result = document.createDocumentFragment()

	for (const [k, v] of Object.entries(children))
		result.appendChild(testResultsChild(k, v))

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

/** @param {string} innerText */
const success = innerText => h('span', {innerText, className: 'success'})

/** @param {string} innerText */
const fail = innerText => h('span', {innerText, className: 'fail'})

/** @type {(type: 'success' | 'fail', s: string, n: number) => Node | String }*/
const text = (type, s, n) => {
	if (n == 0) return ""

	return h('span', {className: type}, [
		s,
		h('small', {}, h('sub', {}, n.toString()))
	])
}

/** @type {(descr: string, tf: DMT.TestFail) => HTMLSpanElement} */
const testFail = (descr, {reason}) => {
	switch (reason.kind) {
		case 'not-equal': {
			const diffLines = reason.changes.map(({kind, value}) => {
				switch (kind) {
					case 'added': return success(value)
					case 'removed': return fail(value)
					default: return value
				}
			})

			return h('div', {className: 'result'}, [
				fail(descr),
				h('pre', {className: 'diff'}, diffLines)
			])
		}
		case 'threw-exn': {
			return fail(reason.error)
		}
	}
}

/** @param {string} descr */
const testPass = descr => h('div', {className: 'result'}, success(descr))

/** @type {(tr: DMT.TestResult) => (descr: string) => Node} */
const testResult = tr => descr => {
	switch (tr.kind) {
		case 'pass': return testPass(descr)
		case 'fail': return testFail(descr, tr)
	}
}

/** @type {(descr: string, v: DMT.TestResult | DMT.TestResults) => Node} */
const testResultsChild = (descr, v) => 
	('kind' in v ? testResult(v) : testResults(v))(descr)

/** @type {(trs: DMT.TestResults) => (descr: string) => HTMLElement} */
const testResults = ({fails, passes, children}) => descr => {
	const childElements = Object
		.entries(children)
		.map(child => testResultsChild(...child))

	return h('details', {open: fails != 0}, [
		h('summary', {}, [
			h('b', {}, descr),
			text('success', '✓', passes),
			text('fail', '✖', fails)
		]),
		...childElements
	])
}