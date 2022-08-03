const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  entry: {
    app: "./src/index.ts",
  },
  output: {
    filename: "build.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
  },
  mode: "development",
  optimization: {},
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(tsx|ts|js|jsx)$/,
        loader: "babel-loader",
      },
      {
        test: /\.(css)$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    historyApiFallback: true,
    port: 3000,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
