const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./scr/js/index.js",
  mode: "development",
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "docs"),
  },
  devtool: "inline-source-map",

  devServer: {
    static: "./docs",
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "scr/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
    ],
  },
};
