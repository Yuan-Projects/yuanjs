import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

const getConfig = (isProduction = true) => {
  return {
    input: 'src/index.js',
    output: {
      file: isProduction ? 'build/yuan.min.js' : 'build/yuan.js',
      format: 'umd',
      name: 'yuanjs'
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**' // only transpile our source code
      }),
      isProduction && uglify()
    ]
  };
};

export default [getConfig(false), getConfig()];