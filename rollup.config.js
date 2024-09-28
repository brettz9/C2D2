import {babel} from '@rollup/plugin-babel';

// eslint-disable-next-line @stylistic/max-len -- Long
// // eslint-disable-next-line import/no-deprecated, import/namespace, import/default, import/no-named-as-default-member, import/no-named-as-default -- Ok
import terser from '@rollup/plugin-terser';

/**
 * @external RollupConfig
 * @type {object}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {object} [config]
 * @param {boolean} [config.minify] Whether to minify output
 * @param {string} [config.format] Rollup output format
 * @param {"browser"|"node"} [config.env]
 * @returns {RollupConfig} Individual Rollup config object
 */
function rollupConfig ({env, minify = false, format = 'umd'}) {
  const config = {
    external: ['fs', 'canvas', 'jsdom'],
    input: `src/c2d2-${env}.js`,
    output: {
      file: `dist/c2d2-${env}${
        format === 'es' ? '-es' : ''
      }${minify ? '.min' : ''}.js`,
      format,
      name: 'c2d2'
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

export default [
  rollupConfig({minify: false, format: 'cjs', env: 'node'}),
  rollupConfig({minify: true, format: 'umd', env: 'browser'}),
  rollupConfig({minify: false, format: 'es', env: 'node'}),
  rollupConfig({minify: true, format: 'es', env: 'browser'}) /* ,
    {
        input: 'test/tests.js',
        output: {
            file: `test/tests-compiled.js`,
            format: 'umd',
            name: 'c2d2'
        },
        plugins: [babel({
          babelHelpers: 'bundled'
        })]
    } */
];
