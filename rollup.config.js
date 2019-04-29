// import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import { uglify } from 'rollup-plugin-uglify'

export default {
    //input: 'src/index.js',
    input: 'lib/es/index.js',
    output: {
        file: 'lib/umd/nom.js',
        format: 'umd',
        name: 'NomJS'
    },
    plugins: [
        json(),
/*
        babel({
            exclude: '{node_modules|__tests__}/**'
        }),
*/
        uglify()
    ]
}
