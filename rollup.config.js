import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
	external: ['events'],
  input: './dist/index.js',
  output: {
    file: './dist/dist.js',
    format: 'esm'
  },
  plugins: [
  	resolve(),
    commonjs()
  ]
}