import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';

/**
* @param {boolean} minify Whether to minify output
* @param {'umd'|'es'} format Rollup output format
* @returns {object} Individual Rollup config object
*/
function rollupConfig ({minify, format}) {
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
        config.plugins.push(babel());
    }
    if (minify) {
        config.plugins.push(terser());
        config.output.sourcemap = true;
    }
    return config;
}

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
        plugins: [babel()]
    } */
];
