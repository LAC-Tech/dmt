//@ts-check

import {evalTestSuite} from "./src/lit"

export default {
	'core': {
		'eval a single test': {
			'transforms correct assertion to successful test result': async () => {
				const actual = await evalTestSuite({
					'': () => ({check: 2, equals: 2})
				})

				const expected = {
					passes: 1,
					fails:  0,
					children: {
						'': {kind: 'pass'}
					}
				}

				return {check: actual, deepEquals: expected}
			}
		}
	},

	'transforms incorrect assertion to failure test result': async () => {
		const actual = await evalTestSuite({
			'': () => ({check: 2 + 2, equals: 5})
		})

		const expected = {
			passes: 0,
			fails: 1,
			children: {
				'': {
					kind: 'fail', 
					reason: {
						kind: 'not-equal',
						actual: 4,
						expected: 5
					}
				}
			}
		}
		
		return {check: actual, deepEquals: expected}
	},

	'handles non-primitive equality with deep equals': async () => {
		const actual = await evalTestSuite({
			'': () => ({
				check: {x: 2, y: {z: 4}},
				deepEquals: {x: 2, y: {z: 4}}
			})
		})

		const expected = {
			passes: 1,
			fails: 0,
			children: {
				'': {kind: 'pass'}
			}
		}

		return {check: actual, deepEquals: expected}
	},

	'can ensure a test throws the right exception': async () => {
		const actual = await evalTestSuite({
			'': () => ({
				check: () => { throw {failure: 'to communicate' } },
				throws: {failure: 'to communicate'}
			})
		})

		const expected =  {
			passes: 1,
			fails: 0,
			children: {
				'': {kind: 'pass'}
			}
		}
		
		return {check: actual, deepEquals: expected}
	},

	"responds intelligently when the expected exception doesn't happen": async () => {
		const actual = await evalTestSuite({
			'': () => ({
				check: () => {},
				throws: {iAmComputer: 'feed me data'}
			})
		})

		const expected = {
			passes: 0,
			fails: 1,
			children: {
				'': {
					kind: 'fail',
					reason: {
						kind: 'not-equal',
						actual: undefined,
						expected: {iAmComputer: 'feed me data'}
					}
				}
			}
		}

		return {check: actual, deepEquals: expected}
	},

	'fails when the wrong error is thrown': async () => { 
		const actual = await evalTestSuite({
			'': () => ({
				check: () => { throw 'actual' },
				throws: 'expected'
			})
		})

		const expected = {
			passes: 0,
			fails: 1,
			children: {
				'': {
					kind: 'fail',
					reason: {
						kind: 'not-equal',
						actual: 'actual', 
						expected: 'expected'
					}
				}
			}
		}

		return {check: actual, deepEquals: expected}
	},
	
	'gracefully deals with an unexpected error': async () => {
		const actual = await evalTestSuite({
			'': () => {
				throw 'whoops'
			}
		})

		const expected = {
			passes: 0,
			fails: 1,
			children: {
				'': {
					kind: 'fail',
					reason: {
						kind: 'threw-exn',
						error: 'whoops'
					}
				}
			}
		}

		return {check: actual, deepEquals: expected}
	},

	"handles empty suite": async () => {
		const actual = await evalTestSuite({})
		const expected = {passes: 0, fails: 0, children: {}}
		return {check: actual, deepEquals: expected}
	},

	"Preserves the structure of unbalanced trees": async () => {
		const actual = await evalTestSuite({
			'two plus two': () => ({
				check: 2 + 2,
				equals: 5
			}),
			'functions gone wild': {
				'naughty': () => ({
					check: () => { throw 'error' },
					throws: 'error'
				}),
				'nice': () => ({
					check: () => {},
					throws: 'error'
				})
			}
		})

		const expected = {
			passes: 1,
			fails: 2,
			children: {
				'two plus two': {
					kind: 'fail',
					reason: {
						kind: 'not-equal',
						actual: 4,
						expected: 5
					}
				},
				'functions gone wild': {
					passes: 1,
					fails: 1,
					children: {
						'naughty': {kind: 'pass'},
						'nice': {
							kind: 'fail', 
							reason: {
								kind: 'not-equal',
								actual: undefined, 
								expected: 'error'
							}
						}
					}
				}
			}
		}
					
		return {check: actual, deepEquals: expected}
	},

	'Resolves asynchronous tests': async () => {
		const actual = await evalTestSuite({
			'myAsyncFunction': () => Promise.resolve({check: 1, equals: 1})
		})
					
		const expected = {
			passes: 1,
			fails: 0,
			children: {
				'myAsyncFunction': {kind: 'pass'}
			}
		}

		return {check: actual, deepEquals: expected}
	}
}