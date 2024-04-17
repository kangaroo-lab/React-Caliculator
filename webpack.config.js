const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
        {
          test: /\.(js|jsx|ts|tsx)?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@emotion/babel-preset-css-prop',
              ],
            },
          },
        }]
    },
    devServer: {
      port: 3003,
      static: {
        directory: path.resolve(__dirname, 'dist'),
        // watch: true,
      },
    //   historyApiFallback: true,
    }

}
