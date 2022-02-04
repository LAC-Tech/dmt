//@ts-check

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

/** @type {(type: 'success' | 'fail', str: string, n: number) => Node | String */
const text = (type, str, n) => {
	if (n == 0) return ""

	return h('span', {className: type}, [
		str,
		h('small', {}, h('sub', {}, n.toString()))
	])
}

/** @param {DMT.TestFail} tf */
const testFail = ({reason}) => {
	switch (reason.kind) {
		case 'not-equal': {
			const diffLines = reason.changes.map(({added, removed, value}) => {
				if (added) return success(value)
				if (removed) return fail(value)
				else return value
			})

			return h('div', {className: 'result'}, [
				h('pre', {}, fail('✖')),
				h('pre', {className: 'diff'}, fail('✖'))
			])
		}
		case 'threw-exn': {
			return fail(reason.error)
		}
	}
}

/** @type {(descr: string, tr: DMT.TestResult) => string | Node} */
const testResultToElem = (descr, tr) => {
	switch (tr.kind) {
		case 'pass': return success(descr)
		case 'fail': return testFail(tr)
	}
}

/** @type {(name: string, trs: DMT.TestResults) => HTMLElement} */
export const testResultsToElem = (name, {fails, passes, children}) => {
	const elem = h('details', {open: fails != 0}, [
		h('summary', {}, [
			h('b', {}, name)

		])
	])


	let d = document.createElement


	/*
		<details ?open=${fails != 0}>
			<summary class=${`h${indent}`}>
				<b>${name}</b>
				${text('success', '✓', passes)}
				${text('fail', '✖', fails)}
			</summary>
			${templates}
		</details>`
	*/

	const s = JSON.stringify(children)
	return (fails > 0 ? fail : success)(s)
}