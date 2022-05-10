// @ts-check

import browserRender from './browser.js'
import cliRender from './cli.js'
import { evalTestSuite} from './core.js'

export { evalTestSuite }

/**
 * @todo These two methods will be different libraries
 */
 
/**
 * @param {HTMLElement} elem
 * @param {DMT.TestSuite} testSuite
 * @return {Promise<DocumentFragment>}
 */
export const browser = async (elem, testSuite) => {
  const results = await evalTestSuite(testSuite)
  return elem.appendChild(browserRender(results))
}

/** 
 * @param {DMT.TestSuite} testSuite
 * @return {Promise<string>}
 */
export const cli = async testSuite => {
  const results = await evalTestSuite(testSuite)
  return cliRender(results)
}
