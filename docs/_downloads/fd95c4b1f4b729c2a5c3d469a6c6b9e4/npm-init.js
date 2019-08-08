const cp = require("child_process"),
      gitapi = "https://api.github.com/user/repos",
      mainFile = "index.js",
      gitignore = [
         "node_modules",
         "**.bak",
         "**.swp",
         "package-lock.json"
      ],
      browserslist = {
         production: ["cover 95% in ES"],
         oneplus: ["> 1% in ES"],
         ie10: [
            "> .25% in ES",
            "ie >= 10"
         ],
         relax: ["cover 80% in ES"]
      };


// Obtiene el autor del repositorio.
function getAuthor() {
   const name = config.get("init.author.name"),
         email = config.get("init.author.email");

   if(name) return email?`${name} <${email}>`:name;
   else return email?email:undefined;
}


// Define cuál es el fichero principal
function getMainFile() {

   function mkdir(name) {
      const fs = require("fs"),
            path = require("path"),
            // Obtiene la ruta relativa del directorio
            // donde se almacena el fichero principal
            mainDir = path.join(path.relative(process.cwd(), name), "..");

      if(!fs.existsSync(mainDir)) {
         fs.mkdirSync(mainDir, {recursive: true});
      }
   }


   if (process.env.NPM_MAIN) {
      mkdir(process.env.NPM_MAIN);
      return process.env.NPM_MAIN;
   }
   else return prompt("Fichero principal", mainFile, function(res) {
      mkdir(res);
      return res;
   });
}


// Obtiene toda la información relativa al repositorio de Git.
function gitInfo() {
   const gituser = config.get("init.git.user"),
         git = gituser && `https://github.com/${gituser}/${basename}`;

   if(!git) return {};

   return {
      repository: (function() {
         const content = gitignore.join("\n") + "\n";

         console.log("... Inicializando el repositorio local ...");
         cp.execSync(`git init; printf '${content}' > .gitignore`, {stdio: 'inherit'});

         return {
            type: "git",
            url: `${git}.git`
         }
      })(),
      homepage: `${git}#readme`,
      bugs: {url: `${git}/issues`},
      create: (function() { // Crea el repositorio remoto de Github
         const token = config.get("init.git.token"),
               data = {
                  name: basename,
                  description: `Proyecto ${basename}`
               }

         if(!token) return;
         else return prompt(`¿Desea crear el repositorio remoto ${basename} en Github (y/n)?`, "y", function(res) {
            res = res.charAt(0).toLowerCase();
            if(res !== "y") return;

            const header = `Authorization: token ${token}`,
                  createCmd = `wget -qO - -S --header '${header}' --post-data '${JSON.stringify(data)}' ${gitapi}`
                  //createCmd = `curl -i H "${header}"  -d '${JSON.stringify(data)}' ${gitapo}`;
            
            console.log("... Creando el repositorio remoto ...");
            cp.execSync(createCmd, {stdio: 'inherit'});
         });
      })()
   }
}

module.exports = Object.assign({
   name: basename,
   author: getAuthor(),
   version: config.get("init.version") || "0.1.0",
   main: getMainFile(),
   scripts: {
      build: "webpack --env.production",
      watch: "webpack --env --watch",
      debug: "webpack-dev-server --env"
   },
   license: config.get("init.license") || "MIT",
   keywords: prompt("Palabras clave (separadas por espacio)", "", res => res.replace(/\s+/g, " ").split(" ")),
   browserslist: browserslist,
}, gitInfo());
