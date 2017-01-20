var path = require("path");
var webpack = require('webpack');

module.exports = {
  context: __dirname + "/src",
  entry: {
    app: "./",
    vendor: ["jquery.min.js"]
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "scripts.min.js"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(
        /* chunkName= */"vendor",
        /* filename= */"vendor.bundle.js"
    )
  ]
};
