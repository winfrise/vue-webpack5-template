const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")

const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

function resolve(p) {
  return path.resolve(__dirname, '..', p)
}

const NODE_ENV = process.env.NODE_ENV

module.exports = {
  performance: {
    maxAssetSize: 100000000,
    maxEntrypointSize: 400000000
  },
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
    // vendor: ['vue', 'vue-router', 'vuex', 'element-ui', 'lodash']
  },
  output: {
    filename: NODE_ENV === 'production' ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js' ,
    path: resolve('dist'),
    publicPath: '/',
    chunkFilename: 'static/js/[name].[contenthash:8].js',
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  devtool: NODE_ENV === 'production' ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.vue'],  
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
    modules: [
      resolve( './node_modules'),
      'node_modules'
    ]
  },
  module: {
    // noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: resolve('.cache/vue-loader'),
              cacheIdentifier: '154cb8fb'
            }
          },
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: true
              },
              cacheDirectory: resolve('node_modules/.cache/vue-loader'),
              cacheIdentifier: '154cb8fb'
            }
          }
        ]
      },
      { // js 文件
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 2
            }
          },
          {
            loader: "babel-loader?cacheDirectory=true"
          }
        ]
      },
      { // 加载图片
        test: /\.(png|svg|jpg|jpeg|gif)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
					filename: 'static/images/[name].[hash][ext][query]'
				}
      }, 
      { // 加载 css
        test: /\.css$/,
        oneOf: [
          {
            use: [
              // 'vue-style-loader',
              {
                loader: MiniCssExtractPlugin.loader
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              // {
              //   loader: 'postcss-loader',
              //   options: {
              //     sourceMap: false
              //   }
              // }
            ]
          }
        ]
      },
      { // 加载 css
        test: /\.s(a|c)ss$/,
        oneOf: [
          /* config.module.rule('s(c|a)ss').oneOf('normal') */
          {
            use: [
              // {
              //   loader: MiniCssExtractPlugin.loader
              // },
              {
                loader: 'vue-style-loader'
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              // {
              //   loader: 'postcss-loader',
              //   options: {
              //     sourceMap: false
              //   }
              // },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },

      { // 加载字体
        test: /\.(woff|woff2|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
					filename: 'static/fonts/[name].[hash][ext][query]'
				}
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new NodePolyfillPlugin(),  // Polyfill Node.js core modules in Webpack. This module is only needed for webpack 5+.
    new VueLoaderPlugin(),
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsWebpackPlugin({}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin(
      {
        'process.env': {
          // VUE_APP_BASE_API: '"/prod-api"',
          // NODE_ENV: '"production"',
          // BASE_URL: '"/"'
        }
      }
    ),
    new HtmlWebpackPlugin({ // 在生成环境会启用压缩
      template: resolve('public/index.html'),
      inject: 'body'
    }),
    new MiniCssExtractPlugin(
      {
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].css'
        // ignoreOrder: true
      }
    ),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('public'),
          to: resolve('dist'),
          toType: 'dir',
          globOptions: {
            ignore: [
              '.DS_Store',
              '**/index.html'
            ]
          }
        }
      ]
    })
  ]
}
