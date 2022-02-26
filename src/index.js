// @ts-check

import render from './browser' 
import { evalTestSuite} from './core'

export { evalTestSuite }

/** @type {import('./types').default} */
export default async (elem, testSuite) => {
  const results = await evalTestSuite(testSuite)
  return elem.appendChild(render(results))
}
