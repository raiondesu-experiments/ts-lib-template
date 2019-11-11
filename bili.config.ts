import { name } from 'package.json';
import { Config } from 'bili';

export default {
  input: 'src/index.ts',
  output: {
    moduleName: name,
    fileName: 'umd.js',
    format: 'umd-min',
    target: 'browser',
  },
  plugins: {
    typescript2: true,
  },
} as Config;
