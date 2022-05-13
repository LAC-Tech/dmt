// @ts-check

/**
 * @template T 
 * @param {DMT.ViewModelStrategy<T>} vm
 */
export default vm => {
	/** @type {(tr: DMT.TestResult) => (descr: string) => T} */
	const testResult = tr => descr => {
		switch (tr.kind) {
			case 'pass': return vm.successfulTest(descr)
			case 'fail': return vm.failedTest(descr, tr)
		}
	}



	/** @type {(trs: DMT.TestResults) => (descr: string) => T} */
	const testResults = ({fails, passes, children}) => 
		vm.testResultsLeaf({passes, fails, children: testChildren(children)})

		/** @param {DMT.TestResults['children']} cs */
	const testChildren = cs => Object
		.entries(cs)
		.map(([descr, v]) => ('kind' in v ? testResult(v) : testResults(v))(descr))

	return testChildren
}
