const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './src/entry-client.js',
  output: {
    path: path.resolve(__dirname, './build'),
    publicPath: '/',
    filename: 'client.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          },
        },
      },
      {
        test: /\.jade/,
        use: 'pug-loader',
      },
      {
        test: /\.css$/,
        // use: [
        //   'style-loader',
        //   'css-loader',
        // ]
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        }),
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
    ]
  },
  resolve: {
    // alias: {
    //   'vue$': 'vue/dist/vue.esm.js'
    // },
    alias: {
      vue: 'vue/dist/vue.js'
    },
  },
  resolveLoader: {
    alias: {
      'pug-loader': path.join(__dirname, 'misc', 'pug-loader'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    }),
    new ExtractTextPlugin('styles.css'),
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#inline-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
