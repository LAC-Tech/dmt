import {TemplateResult} from 'lit-html'

/*
	TODO these names are shit. Get them right, and things might start making more
	sense
*/

// Just in case I change view library
export type HtmlTemplate = TemplateResult

export interface Count {passes: number, fails: number}

export type Assertion = 
	| {check: any, deepEquals: any}
	| {check: any, equals: any}
	| {check: () => any, throws: any}

export type Test = (() => Assertion) | (() => Promise<Assertion>)

export type TestResult =
	| {kind: 'success'}
	| {kind: 'fail', actual: any,	expected: any}
	| {kind: 'exn', error: unknown}

export type Suite<T> = {readonly [key:string]: Suite<T> | T}
