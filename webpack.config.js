const path = require('path');

module.exports = {
  entry: `${__dirname}/src/index.js`,
  output: {
    path: path.resolve(__dirname),
    filename: 'lib/index.js',
    library: 'ReduxSimpleRequest',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
        },
      },
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
