import * as webpack from 'webpack';

const config = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/,
            },
        ],
    },

    output: {
        library: 'ReduxSagaRest',
        libraryTarget: 'umd',
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
    ],

    resolve: {
        extensions: ['.webpack.js', '.web.js', '.js', '.babel.js', '.ts'],
    },

    externals: {
        "redux": {
            root: 'Redux',
            commonjs2: 'redux',
            commonjs: 'redux',
            amd: 'redux'
        },
        "redux-saga": {
            root: 'ReduxSaga',
            commonjs2: 'redux-saga',
            commonjs: 'redux-saga',
            amd: 'redux-saga'
        },
    },
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
        new webpack.LoaderOptionsPlugin({minimize: true}),
    );
}

export default config;
