//@ts-check

/** 
  @type {(tagName: string) => (attributes: Partial<HTMLElement>) => HTMLElement}
 */
const e = tagName => attributes => {
	const result = document.createElement(tagName)
	Object.assign(result, attributes)
	return result
}

const [span, div] = [e('span'), e('div')]

/** @param {string} innerText */
const success = innerText => span({innerText, className: 'success'})

/** @param {string} innerText */
const fail = innerText => span({innerText, className: 'fail'})

/** @type {(tr: DMT.TestResults) => HTMLElement} */
export const renderTestResults = ({passes, fails, children}) => {
	if (fails > 0)
		return fail(JSON.stringify(children))
	else
		return success(JSON.stringify(children))

}
