import typescript from 'rollup-plugin-typescript2';
import uglify from "@lopatnov/rollup-plugin-uglify";

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'build/yuan.js',
        format: 'umd',
        name: 'yuanjs'
      },
      {
        file: 'build/yuan.esm.js',
        format: 'es',
      },
    ],
    plugins: [typescript()]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'build/yuan.min.js',
        format: 'umd',
        name: 'yuanjs'
      },
    ],
    plugins: [typescript(), uglify()]
  },
];