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
