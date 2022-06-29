//@ts-check
import * as os from 'os'

import chalk from 'chalk'

import viewmodel from "./viewmodel.js"


/** 
 * @param {DMT.TestResults} trs
 * @return {string}
 */
const testResults = ({fails, passes, children}) => {
	return Object.entries(children)
		.map(([descr, t]) => {
			if ('kind' in t) return `${descr} ${testResult(t)}`
			else return `${descr} --> ${testResults(t)}`
		})
		.join('\n')
}

/** @param {DMT.TestResult} tr */
const testResult = tr => {
	switch (tr.kind) {
		case 'pass': return chalk.green('✓')
		case 'fail': return chalk.red('✖') + JSON.stringify(tr.reason)
	}
}

/** @param {DMT.TestResults} trs */
export default testResults

/** @type {DMT.ViewModelStrategy<string>} */
const strategy = {
	fail: chalk.red,
	success: chalk.green,
	same: innerText => innerText,
	diff: lines => lines.map(line => `D! ${line}`).join(''),
	exn: error => `E! ${error}`,
	successfulTest: child => `(ST! ${child})`,
	failedTest: (descr, child) => {
		// This could be multiline diff string - so need to indent all of it.
		const indentedChild = child
			.split(os.EOL)
			.map(c => `F! ${c}`)
			.join(os.EOL)

		return [`F! ${descr}`, indentedChild].join('\n')
	},
	description: (str, suffix) => `${str} ${suffix}`,
	sub: n => n.toString(),
	summary: (text, tallies) => '\n\t(' + ['S! ', text, ...tallies].join('') + ')\n\t',
	details: (expanded, summary, children) => {
		return '\n(D!' + [summary, ...children].join(' ') + ')'
	}
}

const testChildren = viewmodel(strategy)
