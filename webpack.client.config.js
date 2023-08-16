const HtmlWebPackPlugin     = require("html-webpack-plugin");
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');

module.exports = {
  entry: "./src/client/index.js",
  output: {
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/client/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin()
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true
  }
};