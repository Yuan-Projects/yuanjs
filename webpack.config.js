const path = require('path');

module.exports = {
  mode: "production",
  entry: "./src/index",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    library: "yuanjs",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        include: [
          path.resolve(__dirname, "src")
        ],
        exclude: [
          path.resolve(__dirname, "node_modules")
        ],
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".css"]
  }
};