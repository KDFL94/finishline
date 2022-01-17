// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const glob = require('glob');

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: [
    "regenerator-runtime/runtime.js",
    "./src/js/app.js",
    "./src/scss/app.scss"
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'js/app.min.js',
  },
  devServer: {
    open: true,
    host: "localhost"
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "index.html"
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8080/'
    }),
    new ImageminPlugin({
      externalImages: {
        context: '.',
        sources: glob.sync('./src/img/**/*.{jpg,png,svg,jpeg}'),
        destination: './dist/img',
        fileName: '../[path][name].[ext]'
      }
      // ...
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'file-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'file-loader',
            options: { outputPath: 'css', name: '[name].min.css'}
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "production";
  }
  return config;
};
