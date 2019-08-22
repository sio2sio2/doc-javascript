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
   else return prompt("Fichero principal", mainFile, (res) => {
      //mkdir(res);
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
         else return prompt(`¿Desea crear el repositorio remoto ${basename} en Github (y/n)?`, "n", function(res) {
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


function createLicense() {
   const license = config.get("init.license") || "MIT",
         name = config.get("init.author.name");

   if(license === "MIT" && name) {
      const fs = require("fs");
            
      fs.writeFile("LICENSE", `Copyright 2019, ${name}.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`)

   }

   return license
}

module.exports = Object.assign({
   name: basename,
   description: prompt("Describa brevemente el fichero: ", `Paquete ${basename}`),
   author: getAuthor(),
   version: config.get("init.version") || "0.1.0",
   main: getMainFile(),
   scripts: {
      build: "webpack --env.output=bundle --progress",
      debug: "webpack-dev-server --env.output=debug --progress"
   },
   license: createLicense(),
   keywords: prompt("Palabras clave (separadas por espacio)", "", res => res.replace(/\s+/g, " ").split(" ")),
   browserslist: browserslist,
}, gitInfo());
