//@ts-check
import * as os from 'os'

import chalk from 'chalk'

import viewmodel from "./viewmodel.js"

/** @param {DMT.TestResults} trs */
export default ({fails, passes, children}) => 
	testChildren(children).join(os.EOL)

const indent = ' * '

const t = ' ! '

/** @param {string[]} ss */
const indentStrings = ss => ss.map(s => indent + s)

/** @type {DMT.ViewModelStrategy<string>} */
const strategy = {
	fail: chalk.red,
	success: chalk.green,
	same: innerText => innerText,
	diff: lines => indentStrings(lines).join(''),
	exn: error => indent + error,
	successfulTest: child => indent + child,
	failedTest: (descr, child) => {
		// This could be multiline diff string - so need to indent all of it.
		const indentedChild = 
			indentStrings(child.split(os.EOL)).join(os.EOL)

		return [indent + descr, indentedChild].join('\n')
	},
	description: (str, suffix) => `${t}${str} ${suffix}`,
	sub: n => n.toString(),
	testResultsLeaf: (expanded, tallies, children) => text => {
	

		const summary = [text, ...tallies].join(' ')
		const indentedChildren = indentStrings(children)

		return [t + summary, ...indentedChildren].join('\n')
	}
}

const testChildren = viewmodel(strategy)
