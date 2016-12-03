const webpack = require('webpack');
const path = require('path');

console.log(path.join(__dirname, '..'));
module.exports = {
  devtool: 'eval-source-map',
  target: 'web',
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
  resolve: {
    extensions: ['.ts', 'tsx', '.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              require('postcss-import'),
              require('precss'),
              require('autoprefixer'),
              require('cssnext')
            ]
          }
        }
      ],
      include: path.join(__dirname, '..', 'src')
    }, {
      test: /\.js$/,
      use: ['babel-loader'],
      include: path.join(__dirname, '..', 'src')
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? JSON.stringify('production') : JSON.stringify('development')
    })
  ]
};
