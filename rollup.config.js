import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: './rollup.input.js',
  output: {
    file: './rollup.output.js',
    format: 'esm'
  },
  plugins: [resolve(), commonjs()]
}
