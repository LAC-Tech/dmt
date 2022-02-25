// @ts-check

import render from './browser' 
import { evalTestSuite} from './core'

/** 
 * @param {HTMLElement} elem
 * @param {DMT.TestSuite} testSuite
 */
export default async (elem, testSuite) => {
	const results = await evalTestSuite(testSuite)
	elem.appendChild(render(results))
}
