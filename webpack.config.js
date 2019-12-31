const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: { main: './client/src/index.jsx' },
  resolve: { extensions: ['.js', '.jsx'] },
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.html$/, use: { loader: "html-loader" } },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./client/src/index.html",
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: "styles.css"
    })
  ]
};