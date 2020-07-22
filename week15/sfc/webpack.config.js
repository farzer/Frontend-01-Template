const path = require('path')

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'create'
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.view$/,
        use: {
          loader: require.resolve('./myloader.js'),
          options: {}
        }
      }
    ]
  },
  optimization: {
    minimize: false
  },
}