import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: 'index.js',
  output: {
    file: 'dist/mainapp.js',
    format: 'iife',
    name: 'mainapp',
    exports: 'named'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
