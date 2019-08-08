// webpack/webpack.productiom.js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => {
   return merge(common, {
      mode: "production",
      module: {
         rules: [
            {
               test: /\.js$/,
               exclude: /node_modules/,
               use: {
                  loader: "babel-loader",
                  options: {
                     presets: [["@babel/env", {
                        debug: env.debug,
                        corejs: 3,
                        useBuiltIns: "usage"
                     }]]
                  }
               }
            },
         ]
      }
   });
}
