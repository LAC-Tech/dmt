// @ts-check

import browserRender from './browser.js'
import { evalTestSuite} from './core.js'

/**
 * @param {HTMLElement} elem
 * @param {DMT.TestSuite} testSuite
 * @return {Promise<DocumentFragment>}
 */
export default async (elem, testSuite) => {
  const results = await evalTestSuite(testSuite)
  return elem.appendChild(browserRender(results))
}
