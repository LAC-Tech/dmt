//@ts-check
import * as os from 'os'

import chalk from 'chalk'

import viewmodel from "./viewmodel.js"

/** @param {DMT.TestResults} trs */
export default ({fails, passes, children}) => 
	testChildren(children).join(os.EOL)

/** @type {DMT.ViewModelStrategy<string>} */
const strategy = {
	fail: chalk.red,
	success: chalk.green,
	same: innerText => innerText,
	diff: lines => lines.join(''),
	exn: error => error,
	successfulTest: child => child,
	failedTest: (descr, child) => [descr, child].join('\n'),
	description: (str, suffix) => `${str} ${suffix}`,
	sub: n => n.toString(),
	testResultsLeaf: (expanded, tallies, children) => text => {
		const summary = [text, ...tallies].join(' ')

		if (!expanded) {
			return summary
		} else {
			return [summary, ...children.map(c => `\t${c}`)].join('\n')
		}
	}
}

const testChildren = viewmodel(strategy)
