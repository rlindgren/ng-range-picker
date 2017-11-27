var path = require('path');
var MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  entry: {
    'ng-range-picker': './lib/range-picker.app.js',
    'ng-range-picker.min': './lib/range-picker.app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
            removeComments: false,
            collapseWhitespace: false
          }
        }
      }
    ]
  },
  plugins: [
    new MinifyPlugin({}, { test: /\.min\.js$/ })
  ],
  devServer: {
    compress: true,
    port: 8080
  }
};
