// webpack/webpack.common.js
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
   entry: "./src/js/index.js",
   output: {
      filename: "js/[name].bundle.js"
   },
   module: {
      rules: [
         {
            test: /\.html$/,
            use: {
               loader: "html-loader",
               options: { minimize: true }
            }
         },
         {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader,
                  "css-loader"]
         },
         {
            test: /\.sass$/,
            use: [MiniCssExtractPlugin.loader,
                  "css-loader",
                  { 
                     loader: "postcss-loader",
                     options: {
                        plugins: () => [require("autoprefixer")]
                     }
                  },
                  "sass-loader"]
         },
         {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
               'url-loader?limit=4096&name=images/[name].[ext]',
               'img-loader'
            ]
         }
      ]
   },
   plugins: [
      new HtmlWebPackPlugin({
         template: "src/index.html",
         //filename: "index.html"   // Es el valor predeterminado
      }),
      new MiniCssExtractPlugin({
         filename: "css/[name].css",
         chunkFilename: "[id].css"
      })
   ]
}

module.exports = config
