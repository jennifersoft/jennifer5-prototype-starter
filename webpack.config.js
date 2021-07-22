const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

const outputPath = path.resolve(__dirname, "out");
const libraryPath = path.resolve(__dirname, "packages/library");
const layoutPath = path.resolve(__dirname, "packages/layout");
const commonPath = path.resolve(__dirname, "packages/common");
const stylePath = path.resolve(__dirname, "packages/style");
const vuejsPath = path.resolve(__dirname, "packages/vuejs");

module.exports = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  entry: path.resolve(__dirname, "src/index"),
  output: {
    path: outputPath,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg|ico|ttf|eot|woff|woff2)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024 * 1024
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(css)$/,
        use: [{ loader: MiniCssExtractPlugin.loader }, { loader: "css-loader" }]
      },
      {
        test: /\.s[a|c]ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.vue$/,
        use: [
          { loader: "vue-loader" },
          {
            loader: "vue-svg-inline-loader",
            options: {
              removeAttributes: ["alt", "src", "tabindex"],
              svgo: {
                plugins: [
                  { prefixIds: true },
                  { removeViewBox: false },
                  {
                    removeAttrs: {
                      attrs: "(fill|stroke)"
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@library": libraryPath,
      "@layout": layoutPath,
      "@common": commonPath,
      "@vuejs": vuejsPath,
      "@style": stylePath
    },
    extensions: [".js", ".sass", ".scss", ".css", ".vue"]
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    host: "127.0.0.1",
    port: 3000,
    progress: true,
    inline: true,
    hot: false
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      path: outputPath,
      filename: "[name].css"
    }),
    new CaseSensitivePathsPlugin()
  ]
};
