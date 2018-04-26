const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',

  entry: [
    'babel-polyfill',
    './src/index.js'
  ],

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],

  devServer: {
    stats: {
      children: false
    },
    overlay: {
      warnings: false,
      errors: true
    },
    historyApiFallback: {
      rewrites: [
        {
          from: /./,
          to: '/index.html'
        }
      ]
    }
  }
}
