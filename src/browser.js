//@ts-check

/** 
  @type {(tagName: string) => (attributes: Partial<HTMLElement>) => HTMLElement}
 */
const e = tagName => attributes => {
	const result = document.createElement(tagName)
	Object.assign(result, attributes)
	return result
}

const [span, div] = ['span', 'div'].map(e)

/** @param {string} innerText */
const success = innerText => span({innerText, className: 'success'})

/** @param {string} innerText */
const fail = innerText => span({innerText, className: 'fail'})

/** @type {(tr: DMT.TestResults) => HTMLElement} */
export const testResultsToElem = ({passes, fails, children}) => {
	const s = JSON.stringify(children)
	return (fails > 0 ? fail : success)(s)
}
