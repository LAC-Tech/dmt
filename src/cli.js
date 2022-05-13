//@ts-check
import * as os from 'os'

import chalk from 'chalk'

import * as viewmodel from "./viewmodel.js"

/** @type {DMT.ViewModelStrategy<string>} */
const strategy = {
	successfulTest: descr => `${descr} ${chalk.green('✓')}`,
	failedTest: (descr, {reason}) => {
		const child = (() => {
			switch (reason.kind) {
				case 'not-equal': {
					const diffLines = reason.changes.map(({kind, value}) => {
						switch (kind) {
							case 'expected': return chalk.red(value)
							case 'actual': return chalk.green(value)
							case 'same': return value
						}
					})

					return diffLines.map(line => `\t${line}`).join('\n')
				}
				case 'threw-exn': {
					return `\t${chalk.red(reason.error)}`
				}
			}	
		})()

		return [`${descr} ${chalk.red('✖')}`, child].join('\n')
	},
	testResultsLeaf: ({passes, fails, children}) => descr => {

	}
}

/** @param {DMT.TestResults} trs */
export default ({fails, passes, children}) => {
	const lines = [
		...Object.keys(children)
	]

	return lines.join(os.EOL)
}
