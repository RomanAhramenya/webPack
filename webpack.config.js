const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpack = require("copy-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";
const isProd= !isDev
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const babelOptions = (preset) => {
  const option = {
    presets: ["@babel/preset-env"],
  };
  if (preset) {
    option.presets.push(preset);
  }
  return option;
};
const plugins = () => {
    const base = [
        //для загрузки html
        new HTMLWebpackPlugin({
          template: "./index.html",
          inject: "body",
        }),
        //для удаления hash in dist
        new CleanWebpackPlugin(),
    
        // css add file dist
        new MiniCssExtractPlugin({
          filename: "[name].[contenthash].css",
        }),
    
        // copy file in dist
        new CopyWebpack({
          patterns:[
            {from: path.resolve(__dirname, "src/assets"), 
            to: path.resolve(__dirname, "dist/assets")}
        ],
    }),
      ]
      if (isProd){
          base.push(new BundleAnalyzerPlugin())
      }
      return base
}
module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: ["@babel/polyfill", "./index.jsx"],
    analitics: "./analitics.ts",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".json", ".png"],
    // указывает пути до файла
    // '@models':path.resolve(__dirname,'src/models')
    // '@: path.resolve(__dirname,'src')
    alias: {},
  },
  // добовляет исходники в разработке
  
  plugins: plugins(),
  module: {
    rules: [
      // загружает картинки из html
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },
      //для загрузки css
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      // для картинок и шрифтов
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset/resource",
      },
      //для  xml
      {
        test: /\.xml/,
        use: ["xml-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions(),
        },
      },
      {
        test: /\.m?ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-typescript"),
        },
      },
      {
        test: /\.m?jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions("@babel/preset-react"),
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
  },
};
