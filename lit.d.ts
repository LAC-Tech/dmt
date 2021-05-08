/*
	DMT - Declarative Minimalist Testing
*/
declare module DMT {	

/* 
	The core of this program is transforming a test...
*/
type Test = AssertEquals | AssertDeepEquals | AssertThrows

/* 
	...to a test result: 
*/
type TestResult = TestSuccess | TestFail | TestExn

/*
	I find that one only needs to assert two things in practice: whether two objects are equal, and whether a given expression throws an exception.
*/
type AssertDeepEquals = {check: any, deepEquals: any}
type AssertThrows = {check: () => any, throws: any}
/*
	In the interests of performance, I have also added an assertion for primitive equality, though arguably this could omitted.
*/
type AssertEquals =	{check: any, equals: any}

/*
	Other than succeeding, a test itself can tell me two useful things: that a comparison failed, or that the test case threw an un-expected exception. 
*/
type TestSuccess = {kind: 'success'}
type TestFail = {kind: 'fail', actual: any, expected: any}
type TestExn = {kind: 'exn', stacktrace: string}

/*
	Of course it is useful to both group and label tests. I use a recursive tree-like structure that can be nested arbitrarily, and written using plain javascript
*/
type Tests = Suite<() => Test>
type Suite<T> = {[description: string]: T | Suite<T>}

/*
	TestResults should naturally follow the same structure. But instead of the leaf nodes being thunks, they are evaluated tests.

 (I've also included an 'indent' property, which spares someone rendering TestResults having to keep track of how deep they are in the tree structure)
*/
type TestResults = Suite<TestResult & {indent: number}>

}
/*
	And so - finally - we come to root type for this whole module: a function that takes 'Tests' and transfroms them to 'TestResults' 
*/

type DMT = (t: DMT.Tests) => DMT.TestResults
