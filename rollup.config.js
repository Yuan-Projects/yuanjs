import typescript from 'rollup-plugin-typescript2';
import uglify from "@lopatnov/rollup-plugin-uglify";

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'build/umd/yuan.js',
        format: 'umd',
        name: 'yuanjs'
      },
      {
        file: 'build/mjs/yuan.js',
        format: 'es',
      },
      {
        file: 'build/cjs/yuan.js',
        format: 'cjs',
      },
    ],
    plugins: [typescript()]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'build/umd/yuan.min.js',
        format: 'umd',
        name: 'yuanjs'
      },
    ],
    plugins: [typescript(), uglify()]
  },
];