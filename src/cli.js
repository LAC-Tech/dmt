//@ts-check
import * as os from 'os'

import chalk from 'chalk'

import viewmodel from "./viewmodel.js"

/** @param {DMT.TestResults} trs */
export default ({fails, passes, children}) => 
	testChildren(children).join(os.EOL)

/** @type {DMT.ViewModelStrategy<string>} */
const strategy = {
	successfulTest: descr => `└──${descr} ${chalk.green('✓')}`,
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

					return diffLines.map(line => `\t${line}`).join('')
				}
				case 'threw-exn': {
					return `\t${chalk.red(reason.error)}`
				}
			}	
		})()

		return [`└──${descr} ${chalk.red('✖')}`, child].join(os.EOL)
	},
	testResultsLeaf: ({passes, fails, children}) => descr => {
		const summary = [
			descr,
			`${chalk.green('✓')} ${passes}`,
			`${chalk.red('✖')} ${fails}`
		].join('')

		return [summary, children.join('\n')].join('\n')
	}
}

const testChildren = viewmodel(strategy)
