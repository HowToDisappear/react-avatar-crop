const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = env => {
    const environment = env.environment ?? 'production';
    const isProduction = environment === 'production';
    return {
        mode: environment,
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].bundle.js',
            library: {
                name: "AvatarCropper",
                type: "umd"
            },
            clean: true,
        },
        devtool: 'inline-source-map',
        devServer: {
            static: './dist',
        },
        module: {
            rules: [
                {
                    test: /\.(?:js|jsx|mjs|cjs)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { targets: "defaults" }],
                                ['@babel/preset-react', { runtime: "automatic" }]
                            ]
                        }
                    },
                    resolve: {
                        extensions: ['', '.js', '.jsx'],
                        fullySpecified: false
                    },
                },
                {
                    test: /\.css$/i,
                    use: [
                        (isProduction
                            ? MiniCssExtractPlugin.loader
                            : 'style-loader'
                        ),
                        'css-loader'
                    ],
                }
            ]
        },
        plugins: [
            ...(isProduction
                ? [new MiniCssExtractPlugin()]
                : [new HtmlWebpackPlugin()]
            ),
        ],
        externals: (isProduction
            ? {
                'react': 'react',
                'react-dom': 'react-dom',
            }
            : {}
        ),
    };
};
