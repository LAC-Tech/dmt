/*
	TODO these names are shit. Get them right, and things might start making more
	sense
*/
declare module DMT {
	interface Count {passes: number, fails: number}

	type Assertion = 
		| {check: any, deepEquals: any}
		| {check: any, equals: any}
		| {check: () => any, throws: any}

	type Test = (() => Assertion) | (() => Promise<Assertion>)

	type TestResult =
		| {kind: 'success'}
		| {kind: 'fail', actual: any,	expected: any}
		| {kind: 'exn', stacktrace: string}

	type Suite<T> = {readonly [key:string]: Suite<T> | T}
}
