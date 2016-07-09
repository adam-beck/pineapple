const webpack = require('webpack');
const path = require('path');

const precss = require('precss');
const autoprefixer = require('autoprefixer');
const cssnext = require('cssnext');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:4040',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, '..', 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, '..', 'src'),
        loaders: ['babel']
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, '..', 'src'),
        loaders: ['style', 'css?modules&importLoaders=1', 'postcss']
      }
    ]
  },
  postcss: () => {
    return [precss, autoprefixer, cssnext];
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? JSON.stringify('production') : JSON.stringify('development')
    })
  ]
};
