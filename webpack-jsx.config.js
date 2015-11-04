var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.jsx'
  ],
  output: {
    path: './',
    filename: 'bundle-jsx.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loaders: [
          'jsx-loader?insertPragma=React.DOM&harmony',
        ]
      }
    ]
  }
};
