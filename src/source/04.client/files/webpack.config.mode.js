const merge = require('webpack-merge');

module.exports = (env, argv) => {

   // Configuración común a ambos modos.
   const config = {
      entry: "./src/js/index.js",
      output: {
         filename: "js/[name].bundle.js"
      }
   }

   return merge.smart(
      config,
      argv.mode === "production"?null:{devtool: "inline-source-map"}
   );
}
