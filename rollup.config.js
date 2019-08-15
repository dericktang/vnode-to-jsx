import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import flow from 'rollup-plugin-flow-no-whitespace';
import {terser} from "rollup-plugin-terser";
import buble from 'rollup-plugin-buble';
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'umd', //cjs ,es ,umd must have name
    name: 'VNodeToJsx'
  },
  plugins: [flow(), resolve(), terser(), commonjs(), buble(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ]
};