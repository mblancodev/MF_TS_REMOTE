const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const deps = require("./package.json").dependencies;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/bootstrap.tsx",
  mode: "development",
  cache: false,
  target: "web",
  output: { publicPath: "/" },
  resolve: {
    alias: {
      src: "/src",
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    // Uncomment this, if you're using react@17
    // fallback: {
    // "react/jsx-runtime": "react/jsx-runtime.js",
    // "react/jsx-dev-runtime": "react/jsx-dev-runtime.js",
    // },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          "postcss-loader",
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /\.(png|jpe?g|ttf|woff2?|mp3|ogg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "assets/main.css",
    }),
    new ModuleFederationPlugin({
      name: "ModuleName",
      filename: "remoteEntry.js",
      exposes: {
        "./Module": "./src/ExposedApp.tsx",
        "./ModuleStyles": "./src/assets/main.css",
      },
      shared: [
        deps,
        {
          react: {
            eager: true,
            singleton: true,
            requiredVersion: deps.react,
          },
        },
        {
          "react-dom": {
            eager: true,
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      ],
    }),
  ],
  devtool: "source-map",
  devServer: {
    hot: true,
    port: process.env.PORT || 3001,
    historyApiFallback: true,
    static: path.join(__dirname, "dist"),
  },
};
