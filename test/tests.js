//@ts-check

import {evalTestSuite} from "../src"

/** @type {DMT.TestSuite} */
export default {
	'core': {
		'eval a single test': {
			'transforms correct assertion to successful test result': async () => {
				const actual = await evalTestSuite({
					'': () => ({actual: 2, expected: 2})
				})

				const expected = {
					passes: 1,
					fails: 0,
					children: {
						'': {kind: 'pass'}
					}
				}

				return {actual, expected}
			},
			'incorrect assertions': {
				"two primitives don't equal each other": async () => {
					const actual = await evalTestSuite({
						'': () => ({actual: 2 + 2, expected: 5})
					})

					const expected = {
						passes: 0,
						fails: 1,
						children: {
							'': {
								kind: 'fail',
								reason: {
									kind: 'not-equal',
									changes: [
										{kind: 'actual', value: "4"},
										{kind: 'expected', value: "5"}
									]
								}
							}
						}
					}
					
					return {actual, expected}
				},

				"handle undefined edge case": async () => {
					const actual = await evalTestSuite({
						'': () => ({actual: 3, expected: undefined})
					})

					const expected = {
						passes: 0,
						fails: 1, 
						children: {
							'': {
								kind: 'fail',
								reason: {
									kind: 'not-equal',
									changes: [
										{kind: 'actual', value: 3},
										{kind: 'expected', value: undefined}
									]
								}
							}
						}
					}

					return {actual, expected}
				}
			}
		}
	},

	'handles non-primitive equality with deep equals': async () => {
		const actual = await evalTestSuite({
			'': () => ({
				actual: {x: 2, y: {z: 4}},
				expected: {x: 2, y: {z: 4}}
			})
		})

		const expected = {
			passes: 1,
			fails: 0,
			children: {
				'': {kind: 'pass'}
			}
		}

		return {actual, expected}
	},

	'can ensure a test throws the right exception': async () => {
		const actual = await evalTestSuite({
			'': () => ({
				assert: () => { throw {failure: 'to communicate' } },
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
		
		return {actual, expected}
	},


	"responds intelligently when the expected exception doesn't happen": async () => {
		const actual = await evalTestSuite({
			'': () => ({
				assert: () => {},
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
						changes: [
							{kind: 'actual', value: undefined},
							{kind: 'expected', value: {iAmComputer: 'feed me data'}}
						]
					}
				}
			}
		}

		return {actual, expected}
	},

	'fails when the wrong error is thrown': async () => { 
		const actual = await evalTestSuite({
			'': () => ({
				assert: () => { throw 'actual' },
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
						changes: [
							{kind: 'actual', value: 'actual'},
							{kind: 'expected', value: 'expected'}
						]
					}
				}
			}
		}

		return {actual, expected}
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

		return {actual, expected}
	},

	"handles empty suite": async () => ({
		actual: await evalTestSuite({}),
		expected: {passes: 0, fails: 0, children: {}}
	}),

	"Preserves the structure of unbalanced trees": async () => {
		const actual = await evalTestSuite({
			'two plus two': () => ({
				actual: 2 + 2,
				expected: 5
			}),
			'functions gone wild': {
				'naughty': () => ({
					assert: () => { throw 'error' },
					throws: 'error'
				}),
				'nice': () => ({
					assert: () => {},
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
						changes: [
							{kind: 'actual', value: "4"},
							{kind: 'expected', value: "5"}
						]
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
								changes: [
									{kind: 'actual', value: undefined},
									{kind: 'expected', value: 'error'}
								]
							}
						}
					}
				}
			}
		}
					
		return {actual, expected}
	},

	'Resolves asynchronous tests': async () => {
		const actual = await evalTestSuite({
			'myAsyncFunction': () => Promise.resolve({actual: 1, expected: 1})
		})
					
		const expected = {
			passes: 1,
			fails: 0,
			children: {
				'myAsyncFunction': {kind: 'pass'}
			}
		}

		return {actual, expected}
	},

	"description of error throwing": () => {
		throw new Error('lol')

		return {actual: 0, expected: 0}
	} 
}
