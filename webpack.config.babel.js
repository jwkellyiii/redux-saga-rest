import * as path from 'path';
import * as webpack from 'webpack';

export const webpackStats = {
    chunks: false,
    colors: true,
};

export default {
    entry: path.join(__dirname, 'src/index.ts'),

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js'
    },

    devtool: 'source-map',

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            _: 'lodash',
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
        new webpack.LoaderOptionsPlugin({minimize: true, debug: false}),
    ],

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: [
                    {
                        loader: 'babel',
                        query: {
                            presets: [['es2015', {modules: false}], 'stage-0'],
                        },
                    },
                    'ts',
                ],
            },
        ],
    },

    resolve: {
        modules: [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'node_modules'),
        ],
        extensions: ['.webpack.js', '.web.js', '.js', '.ts'],
    },
}
