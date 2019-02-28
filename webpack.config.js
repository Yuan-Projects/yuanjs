const path = require('path');
const bodyParser = require('body-parser');

module.exports = {
  mode: "development",
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
  },
  devServer: {
    before: function(app, server) {
      // parse application/x-www-form-urlencoded
      app.use(bodyParser.urlencoded({ extended: false }))

      app.use(bodyParser.json());

      app.post('/post.json', (request, response) => {
        response.json(request.body);
      });
    },
    contentBase: [path.join(__dirname, 'test'), path.join(__dirname, 'build')]
  }
};