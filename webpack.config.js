var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: "./src/js/scripts.js",
  output: {
    path: __dirname + "/dist/js",
    filename: "scripts.min.js"
  },
};
