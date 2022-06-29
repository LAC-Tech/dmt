// @ts-check

/**
 * @template T 
 * @param {DMT.ViewModelStrategy<T>} vm
 */
export default vm => {
		/** @param {string} text */
	const successfulTest = text => 
		vm.successfulTest(vm.description(text, vm.success('✓')))

	/** @type {(text: string, tf: DMT.TestFail) => T} */
	const failedTest = (text, {reason}) => {
		const child = (() => {
			switch (reason.kind) {
				case 'threw-exn': return vm.exn(vm.fail(reason.error))
				case 'not-equal': {
					const diffLines = reason.changes.map(({kind, value}) => {
						switch (kind) {
							case 'expected': return vm.fail(value)
							case 'actual': return vm.success(value)
							case 'same': return vm.same(value)
						}
					})

					return vm.diff(diffLines)
				}
			}
		})()

		return vm.failedTest(vm.description(text, vm.fail('✖')), child)
	}


	/**
	 * @param {{passes: number, fails: number, children: T[]}} trs
	 * @return {(text: string) => T}
	 */
	const testResultsLeaf = ({fails, passes, children}) => text => {
		const tallies = [
			...(passes ? [vm.success('✓', vm.sub(passes))] : []),
			...(fails ? [vm.fail('✖', vm.sub(fails))] : [])
		]

		return vm.details(fails != 0, vm.summary(text, tallies), children)
	}

	/** @type {(tr: DMT.TestResult) => (descr: string) => T} */
	const testResult = tr => descr => {
		switch (tr.kind) {
			case 'pass': return successfulTest(descr)
			case 'fail': return failedTest(descr, tr)
		}
	}

	/** @type {(trs: DMT.TestResults) => (descr: string) => T} */
	const testResults = trs => 
		testResultsLeaf({...trs, children: testChildren(trs.children)})

	/** @param {DMT.TestResults['children']} cs */
	const testChildren = cs => Object
    .entries(cs)
    .map(([descr, v]) => ('kind' in v ? testResult(v) : testResults(v))(descr))

	return testChildren
}
