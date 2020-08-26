const path = require('path');

module.exports = {
  mode: 'development',
  entry: './main.js',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
            plugins: [
              [
                '@babel/plugin-transform-react-jsx',
                {
                  pragma: 'create',
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: {
          // loader: 'css-loader',
          loader: path.resolve('./css-loader'),
        },
      },
    ],
  },
  optimization: {
    minimize: false,
  },
};
