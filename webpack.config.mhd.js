const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const fs = require('fs');

const browsers = [
    'Android >= 4',
    'iOS >= 7',
];

const getCommonConfig = function( argv ){
    let commonConfig = {
        entry: {
            vendors: ['vue', 'axios', 'fastclick']
        },
        output: {

        },
        resolve: {
            alias: {
              'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
            }
        },
        mode: 'production',
        module: {
            rules: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use:{
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                ['@babel/preset-env',{
                                    useBuiltIns: "usage",
                                    modules: false,
                                    targets: {browsers},
                                }],
                            ],
                            plugins: [
                                ["@babel/plugin-transform-runtime", {
                                    corejs: 2,
                                    helpers: true,
                                    regenerator: true,
                                    useESModules: false
                                }]
                            ]
                        },
                    },
                }, {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"]
                }, {
                    test: /\.scss$/,
                    use: [{
                            loader: MiniCssExtractPlugin.loader
                        },{
                            loader: "css-loader"
                        },{
                            loader: "sass-loader"
                        },{
                            loader: "postcss-loader",
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require("autoprefixer")({
                                        'browsers': browsers
                                    })
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    use: 'file-loader'
                },
                {
                    test: /\.(jpe?g|png|gif|ttf)\??.*$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 4096,
                            name: 'image/[name].[hash:8].[ext]',
                            // publicPath: '../',
                            publicPath: argv.mode === 'development' ? './' : `/activity/${argv.dir.split('/')[argv.dir.split('/').length - 1]}/`,
                            // publicPath: './',
                            // outputPath: "../dist/"
                            outputPath: "./"
                        }
                    }]
                },{
                    test: /\.html$/,
                    use: [{
                        loader: 'html-loader',
                        options: {
                            // interpolate:true,
                            ignoreCustomFragments: [/\{\{.*?}}/],
                            attrs: ['img:src']
                        }
                    }],
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin()
        ],
        optimization: {
            runtimeChunk: false,
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\\/]node_modules[\\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        }
    }
    return commonConfig;
}

module.exports = (env, argv) => {
    const   dir = `/public/${argv.dir}/`,
            isDev = argv.mode === 'development',
            list = fs.readdirSync(__dirname + dir + 'src/template/'),
            common = getCommonConfig(argv);

    let config;

    //目录多页面
    list.forEach((htmlFile) => {
        if( htmlFile.match(/.*\.html$/) ){
            const filename = htmlFile.replace('.html', '');
            common.entry[filename] = `.${dir}src/js/${filename}.js`;
            common.plugins.push(
                new HtmlWebpackPlugin({
                    template: './' + dir + 'src/template/' + htmlFile,
                    filename: (isDev ? '../' : './') + htmlFile,
                    inject: true,
                    cache: isDev ? false : true,
                    chunks: ['vendors', filename]
                })
            );
        }
    })

    //合并config
    config = merge(common, {
        output: {
            filename: `js/[name]${isDev?'':'.[contenthash]'}.js`,
            path: path.resolve(__dirname + dir, 'dist'),
            publicPath: `${isDev?'./dist/':'./'}`
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `css/[name]${isDev?'':'.[hash:8]'}.css`,
                disable: false,
                allChunks: true
            })
        ]
    })

    return config;
}