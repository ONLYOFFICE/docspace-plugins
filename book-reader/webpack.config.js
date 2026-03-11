const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".mjs"],
    conditionNames: ["browser", "import", "module", "default"],
    fallback: {
      path: false,
      fs: false,
      stream: false,
      buffer: false,
    },
  },
  output: {
    filename: "plugin.js",
    path: path.resolve(__dirname, "dist"),
  },
};
