const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const config = merge(common, {
   mode: "production",
   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
               loader: "babel-loader",
               options: {
                  presets: [
                     ["@babel/env", {
                        debug: true,
                        useBuiltIns: "usage",
                        corejs: 3
                     }]
                  ]
               }
            }
         },
      ]
   }
});

module.exports = config
