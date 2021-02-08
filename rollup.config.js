import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';

/**
 * @external RollupConfig
 * @type {PlainObject}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {PlainObject} [config={}]
 * @param {boolean} [config.minify=false] Whether to minify output
 * @param {string} [config.format="umd"] Rollup output format
 * @returns {external:RollupConfig} Individual Rollup config object
 */
function rollupConfig ({minify = false, format = 'umd'}) {
  const config = {
    input: 'src/c2d2.js',
    output: {
      file: `dist/c2d2${
        format === 'es' ? '-es' : ''
      }${minify ? '.min' : ''}.js`,
      format,
      name: 'C2D2'
    },
    plugins: []
  };
  if (format === 'umd') {
    config.plugins.push(babel({
      babelHelpers: 'bundled'
    }));
  }
  if (minify) {
    config.plugins.push(terser());
    config.output.sourcemap = true;
  }
  return config;
}

// eslint-disable-next-line import/no-anonymous-default-export -- Rollup config
export default [
  rollupConfig({minify: false, format: 'umd'}),
  rollupConfig({minify: true, format: 'umd'}),
  rollupConfig({minify: false, format: 'es'}),
  rollupConfig({minify: true, format: 'es'}) /* ,
    {
        input: 'test/tests.js',
        output: {
            file: `test/tests-compiled.js`,
            format: 'umd',
            name: 'C2D2'
        },
        plugins: [babel({
          babelHelpers: 'bundled'
        })]
    } */
];
