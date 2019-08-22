const webpack = require("webpack"),
      merge = require("webpack-merge"),
      path = require("path"),
      MiniCssExtractPlugin = require("mini-css-extract-plugin"),
      name = require("./package.json").name;


// Configuración para Babel
function confBabel(env) {
   return {
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
   }
}

// Configuración adicional para el sabor bundle,
// o sea, el que contiene todas las dependencias.
function confBundle() {
   return {
      entry: {
         [name]: ["leaflet/dist/leaflet.css",
                  "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"]
      }
   }
}


// Configuración sin dependencias
function confNoDeps() {
   return {
      externals: {
         leaflet: {
            root: "L",
            commonjs: "leaflet",
            commonjs2: "leaflet",
            amd: "leaflet"
         },
         "leaflet-defaulticon-compatibility": {
            root: "compatibility",
            commonjs: "leaflet-defaulticon-compatibility",
            commonjs2: "leaflet-defaulticon-compatibility",
            amd: "leaflet-defaulticon-compatibility",
         }
      }
   }
} 

// Configuración para desarrollo
// (los mapeos de código fuente en fichero aparte)
function confDev(filename) {
   return {
      devtool: false,
      plugins: [
         new webpack.SourceMapDevToolPlugin({
            filename: `${filename}.map`
         })
      ],
      devServer: {
         contentBase: path.resolve(__dirname, "examples"),
         publicPath: "/dist/",
         watchContentBase: true,
         open: "chromium"
      }
   }
}


module.exports = env => {
   // Modo
   switch(env.output) {
      case "debug":
      case "srcdebug":
         env.mode = "development";
         break;
      default:
         env.mode = "production";
   }

   // Nombre del resultado.
   let filename;
   switch(env.output) {
      case "min":
      case "debug":
         filename = "[name].js";
         break;
      case "src":
         filename = "[name]-src.js";
         break
      case "srcdebug":
         filename = "[name]-debug.js";
         break;
      default:
         filename = `[name].${env.output}.js`;
   }


   const common = {
      mode: env.mode,
      entry: {
         [name]: ["./src/plugin.js"]
      },
      output: {
         filename: filename,
         libraryTarget: "umd",
         umdNamedDefine: false,
         libraryExport: "default"
      },
      module: {
         rules: [
            {
               test: /\.css$/i,
               use: [MiniCssExtractPlugin.loader,
                     "css-loader",
                     {
                        loader: "postcss-loader",
                        options: {
                           plugins: [
                              require("cssnano")({preset: "default"})
                           ]
                        }
                     }]
            },
            {
               test: /\.(png|jpe?g|gif|svg)$/i,
               use: [
                  'url-loader?limit=4096&name=images/[name].[ext]'
               ]
            }
         ]
      },
      plugins: [
         new webpack.ProvidePlugin({
            L: "leaflet",
            "compatibility": "leaflet-defaulticon-compatibility"
         }),
         new MiniCssExtractPlugin({
            filename: "[name].bundle.css",
            chunkFilename: "[id].css"
         })
      ]
   }

   return merge.smart(
      common,
      env.mode === "production"?confBabel(env):confDev(filename),
      env.output === "src"?{optimization: {minimize: false}}:null,
      env.output === "bundle"?confBundle():confNoDeps(),
   )
}