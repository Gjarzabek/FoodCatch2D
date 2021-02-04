const path = require( 'path' );

module.exports = {

    mode: 'production',

    entry: './src/index.ts',

    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'main.js',
    },

    resolve: {
        extensions: [ '.ts', '.js' ],
        fallback: { "path": require.resolve("path-browserify") },
    },

    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    }
};