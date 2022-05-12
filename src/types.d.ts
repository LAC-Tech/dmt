/*
	DMT - Declarative Minimalist Testing
*/
export as namespace DMT;

export {
	TestResult,
	Change,
	AssertEquals,
	TestSuite,
	TestResults,
	TestFail,
	Test,
	ViewModelKernel,
	ViewModel
}

/* 
	The core of this program is transforming a test...
*/
type Test = () => Assertion | Promise<Assertion>
type Assertion = AssertEquals | AssertThrows

/* 
	...to a test result: 
*/
type TestResult = TestPass | TestFail

/*
	I find that one only needs to assert two things in practice: whether two objects are equal, and whether a given expression throws an exception.
*/
type AssertThrows = {assert: () => any, throws: any}
type AssertEquals =	{actual: any, expected: any}

/*
	Other than succeeding, a test itself can tell me two useful things: that a comparison failed, or that the test case threw an un-expected exception. 
*/
type TestPass = {kind: 'pass'}
type TestFail = {kind: 'fail', reason: TestFailReason}
type TestFailReason = 
	| {kind: 'not-equal', changes: ReadonlyArray<Change>}
	| {kind: 'threw-exn', error: string}

/* Used for rendering diffs of changed objects. Based on the output of diff library but customised for my own use + to prevent coupling*/
type Change = {kind: 'actual' | 'expected' | 'same', value: string}

/*
	Of course it is useful to both group and label tests. I use a recursive tree-like structure that can be nested arbitrarily, and written using plain javascript
*/
type TestSuite = {[description: string]: Test | TestSuite}

/*
	TestResults should naturally follow the same structure. But instead of the leaf nodes being thunks, they are evaluated tests.
*/
type TestResults = {
	passes: number
	fails: number
	children: {
		[description: string]: TestResult | TestResults
	}
}

/** @todo temporary interface */
interface ViewModelKernel<T> {
	fail: (innerText: string) => T
	success: (innerText: string) => T
	tally: (type: 'success' | 'fail', s: string, n: number) => T
	description: (str: string, suffix: T) => T
}

interface ViewModel<T> {
	title: (fails: number) => string
	successfulTest: (descr: string) => Node
	failedTest: (descr: string, tf: TestFail) => Node
}
