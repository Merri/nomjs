import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import { uglify } from 'rollup-plugin-uglify'

export default [
    // create the main ES5 version with Terser
    {
        input: 'lib/es/index.js',
        output: {
            file: 'lib/umd/nom.js',
            format: 'umd',
            name: 'NomJS'
        },
        plugins: [
            json(),
            terser()
        ]
    },
    // alternate ES5 version with Uglify
    {
        input: 'lib/es/index.js',
        output: {
            file: 'lib/umd/nom.es5.js',
            format: 'umd',
            name: 'NomJS'
        },
        plugins: [
            json(),
            uglify()
        ]
    },
    // ES6 version with Terser
    {
        input: 'src/index.js',
        output: {
            file: 'lib/umd/nom.es6.js',
            format: 'umd',
            name: 'NomJS'
        },
        plugins: [
            json(),
            terser()
        ]
    },
]
