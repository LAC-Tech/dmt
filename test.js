import dmt from './src/index.ts'

const tests = {
	'Should throw a stacktrace': () => {
		throw 'lol'
	}
}

dmt(document.body, tests)
