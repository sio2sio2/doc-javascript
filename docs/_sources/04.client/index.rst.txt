.. _webpack:

************************************
Programación en el cliente (Webpack)
************************************
La programacion en el cliente tiene la particularidad de que necesitamos generar
un aplicación resultante que los navegadores sean capaces de ejecutar. Eso
implica:

- Por lo general, componer un fichero ``.js`` único a partir de nuestro
  desarrollo modulas que contenga todos los módulos de la aplicación y,
  opcionalmente, las librerías de terceros que hayamos usado en ella.
- Transpilar el código *Javascript* para obtener un código compatible con
  un mayor número de navegadores.
- Poder preprocesar código |SASS| o Less_ para obtener código |CSS|.

Además de lo anterior, es recomendable:

- Añadir automáticamente las marcas script_ y link_ al |HTML|.
- Facilitar y agilizar las tareas de comprobación del código:

  + automatizando todas las tareas anteriores cada vez que modificamos
    el código fuente. 
  + Levantando un servidor web que recargue la aplicación recompuesta cada vez
    que obramos un cambio.

Existe varias alternativas para lograr este objetivo (Gulp_\ + Browserify_
podría ser una de ellas), aunque aquí nos centraremos en analizar
:program:`webpack`\ [#]_.


Instalación
***********
Lo primero es :ref:`preparar el directorio de trabajo <prep_workdir>` para
después:

Paquetes
=========
Para todo lo que pretendemos necesitamos al menos los siguientes paquetes:

.. code-block:: console

   $ npm install --save-dev webpack webpack-dev-server webpack-cli webpack-merge

Bases la de configuración
=========================
Como nuestro objetivo es utilizar :program:`webpack` como aglutinante de nuestro
código, debemos añadir a :file:`package.json` los siguientes scripts:

.. code-block:: js

   "script": {
      "build": "webpack --mode production"
   }

Por otra parte, necesitamos un fichero para la configuración de
:program:`webpack` llamado :file:`webpack.config.js` con una primera
configuración como ésta:

.. code-block:: js

   const config = {
      entry: "./src/js/index.js",
      output: {
         filename: "js/[name].bundle.js"
      }
   }

   module.exports = config

Esta configuración simplicísima supone que el punto de entrada de nuestra
aplicación es :file:`src/js/index.js` y que el resultado de la acción de
:program:`webpack` se guardará en :file:`dist/js/main.bundle.js`.

.. note:: La configuración hace más de lo que aparenta. No sólo copia el
   fichero, sino que lo minimiza; y, si hemos descompuesto nuestro código en
   varios ficheros (:ref:`módulos <js-modules>`) que se llaman entre sí o
   importa librerías de terceros, reunirá todo dentro del mismo fichero.
   Para excluir módulos del fichero resultante único, consulte más adelante
   :ref:`externals <webpack-externals>`.

El por qué el indicado es el fichero resultante se debe a dos razones:

- Sin configuración adicional, se toma como directorio de resultados
  :file:`/dist`. Veremos más adelante cómo alterar esto.

- El nombre es "*main*", porque la línea que define la entrada es:

  .. code-block:: js

     entry: "./src.js/index.js"

  .. seealso:: Consulte el apartado sobre :ref:`la definición del punto de
     entrada <webpack-entry-point>` para una explicación del hecho.

Por último, debemos crear un código de ejemplo en :file:`src/js/index.js`:

.. code-block:: js

   const foobar = (text) => {
      console.log(`${text}`);
   }

   let mensaje = "Esto es una prueba";
   foobar(mensaje);

en que usamos algunas características nuevas de *Javascript* para ilustrar más
adelante la transpilación con :ref:`babel <babel>`. Escrito el fichero podemos
obtener el resultado con::

   $ npm run build

que creará el fichero :file:`dist/js/main.bundle.js`. Si le echamos un vistazo
veremos que el código se encuentra ofuscado y minimizado.

Desarrollo
==========
La configuración anterior es un ejemplo tan simple que carece por completo de
utilidad, ya que hace inviable la corrección y depuración del código. Es
necesario, crear al menos dos configuraciones: una apropiada para generar el
resultado para producción y otra para generar un resultado apto para depurar
durante el desarrollo. Para ello vamos a crear así los *scripts* en
:file:`packages.json`:

.. code-block:: js

  "scripts": {
    "build": "webpack --config webpack/webpack.production.js",
    "watch": "webpack --config webpack/webpack.development.js --watch",
  }

cuyo sentido es el siguiente:

* :code:`build` compone el resultado para usarlo en producción.
* :code:`watch` compone el resultado para usarlo mientras desarrollamos,
  de modo que se queda expectante a cualquier cambio posterior que hagamos
  para recomponer sobre la marcha el resultado.

Dentro del directorio de trabajo, debemos también crear un directorio de
configuración para :program:`webpack` con el siguiente contenido:

.. code-block:: none

   + webpack
        +-- webpack.common.js
        +-- webpack.production.js
        +-- webpack.development.js

:file:`webpack.common.js` contendrá lo siguiente:

.. code-block:: js

   const config = {
      entry: "./src/js/index.js",
      output: {
         filename: "js/[name].bundle.js"
      }
   }

   module.exports = config

:file:`webpack.production.js` esto:

.. code-block:: js

   const merge = require('webpack-merge');
   const common = require('./webpack.common.js');

   const config = merge(common, {
      mode: "production",
   });

   module.exports = config

y, por su parte, :file:`webpack.development.js` esto otro:

.. code-block:: js

   const merge = require('webpack-merge'),
         common = require('./webpack.common.js');

   const config = merge(common, {
      mode: "development",
      devtool: 'inline-source-map'
   });

   module.exports = config

Con ello, además del script ``build`` podemos hacer::

   $ npm run watch

que creará el fichero pero se quedará vigilando cualquier cambio en el fichero
fuente para regenerarlo inmediatamente.

Aplicación simple
=================
Trataremos ahora de montar una aplicación (bastante inútil, todo sea dicho) que
incluya |HTML| y |CSS| y montarla con :program:`webpack`. En este caso, como se
obtiene como resultado una página web, tiene sentido poder depurar la página de
modo interactivo, esto es, que se levante un servidor web y que la página cambie
automáticamente al realizarse algún cambio en alguno de los ficheros fuente.
Para ello, añadimos un tercer *script*:

.. code-block:: js

    "debug": "webpack-dev-server --config webpack/webpack.development.js"

El código fuente se compone de los siguientes ficheros:

.. code-block:: none

   src
    +-- index.html
    |
    +-- js
    |    +-- index.js
    |
    +-- css
         +-- main.css

En este caso, deberemos instalar paquetes adicionales:

.. code-block:: console

   $ npm install --save-dev html-loader html-webpack-plugin
   $ npm install --save-dev css-loader mini-css-extract-plugin
   $ npm install --save-dev url-loader file-loader

Para el *script* podemos usar el ya escrito, con la adición de una línea que
posibilita el procesamiento del |CSS|:

.. code-block:: js
   :emphasize-lines: 3

   "use strict";

   import "../css/main.css";


   const foobar = (text) => {
      console.log(`${text}`);
   }

   let mensaje = "Esto es una prueba";
   foobar(mensaje);
   no_existe();  // Esto debe provocar un error en la consola.

.. note:: Hay otra forma de provocar que se procese el fichero |CSS| (o
   cualquier otro tipo de fichero): añadirlo al punto de entrada de
   :program:`webpack`:

   .. code-block:: js

      entry: [ "./src/js/index.js", "./css/main.css" ]

   Esta alternativa puede ser interesante, si el |CSS| procede de código ajeno y
   pretendemos crear una configuración condicional que incluya o no en los
   ficheros resultantes el código de terceros. Más adelante, puede echarle un
   vistazo al :ref:`ejemplo de construcción de un plugin <webpack-ej-plugin>` en
   que se usa esta técnica. La contraprestación es que la dependencia no está
   contenida en el código fuente y, en consecuencia, sólo es patente si se
   procesa el desarrollo con :program:`webpack`.
      
Hay, ademas, que modificar imperiosamente :file:`webpack/webpack.development.js` para
alterar el comportamiento de :program:`webpack-dev-server`:

.. code-block:: js
   :emphasize-lines: 6-9

   const merge = require('webpack-merge'),
         common = require('./webpack.common.js');

   const config = merge(common, {
      mode: "development",
      devServer: {
         contentBase: false,
         open: "chromium"
      },
      devtool: 'inline-source-map'
   });

   module.exports = config

Para entender esta configuración, es indispensable conocer cómo funciona, en
realidad, :program:`webpack-dev-server`: en principio, sirve desde un directorio
virtual creado en la memoria los ficheros resultantes del procesamiento. En
consecuencia, ni tales ficheros resultantes se escriben en disco ni los ficheros
de disco están disponibles en el servidor web levantado. Ahora bien, la opción
*contentBase*, permite indicar un directorio del sistema real de ficheros  que
se fusionará con este directorio virtual a fin de que sus contenidos sí sean
accesibles. Si el valor es ``false``, como es el caso, sólo se sirven los
ficheros del directorio virtual (o sea, sólo los ficheros resultantes del
procesamiento). Su valor predeterminado es :file:`dist/`, así que si no se
incluye la opción, estará accesible el contenido de este directorio en caso de
existir. Por supuesto, podemos establecer el valor que queramos, por ejemplo:

.. code-block:: js

   contentBase: require("path").resolve(__dirname, "..")

En este caso, fusionaremos todo el contenido del directorio de trabajo\ [#]_ con
los ficheros resultantes. La otra opción, *open*, rige qué se hace al levantar el
servidor:

- Si es ``false``, que es su valor predeterminado al no haber incluido el
  argumento :code:`--open`\ [#]_ en el *script* añadido a :file:`package.json`, no
  se abre una ventana con la aplicación en el navegador, así que tendremos que
  abri manualmente nosotros la aplicación en::

   http://localhost:8080

- Si toma valor, debe ser una cadena que indique el navegador con el que se
  quiere ver la aplicación.

- Si es ``true``, se usa el navegador predefinido por el sistema\ [#]_.

.. note:: Aunque tenga un interés muy relativo, también es posible hacer
   que los ficheros resultantes se escriban en disco.

   .. code-block:: js

      devServer: {
         writeToDisk: true,
         contentBase: false
         open: "chromium"
      }

   En este caso, se escribirán los ficheros resultantes en :file:`dist` (a menos
   que lo modifiquemos) y el servidor publicará el contenido de este directorio.

Por su parte, :file:`index.html` puede ser el siguiente:

.. code-block:: html

   <!DOCTYPE html>
   <html lang="es">
   <head>
      <meta charset="UTF-8">
      <title>Aplicación simple</title>
   </head>
   <body>
      <h1>Aplicación simple</h1>
   </body>
   </html>

Obsérvese que es necesario incluir las etiquetas `<head>
<https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head>`_ y `<body>
<https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body>`_ para el
plugin :program:`HtmlWebpackPlugin` inserte correctamente el *script* dentro del
|HTML|. Por otro lado. el |CSS| es éste:

.. code-block:: css

   body {
      blackground-color: yellow;
   }

Como puede verse, no hay referencia en el |HTML| ni al *script* ni a la hoja de
estilos, ya que se pretende que :program:`webpack` se encargue de incorpar las
referencias pertinentes. La configuración, en este caso, debe añadirse a
:file:`webpack/webpack.common.js`, ya que tanto en producción como en
desarrollo se tendrá que llevar a cabo la tarea:

.. literalinclude:: files/webpack.common.simple.js
   :language: js

Podemos ahora generar el resultado con::

   $ npm run build

pero como en esta ocasión sí tenemos un |HTML|, podría interesarnos levantar un
servidor web y recargar la aplicación cada vez que hagamos un cambio en el
código fuente::

   $ npm run debug

Además, gracias a que hemos incluido la línea::

   devtool: 'inline-source-map'

los errores que genere la ejecución del código (en nuestro ejemplo hemos
incluido una línea que hace referencia a una función inexistente) referirán los
ficheros originales (:file:`src/js/index.js`) e incluso podremos fijar sobre
ellos puntos de ruptura para llevar a cabo la depuración del código.

Por defecto, los mapeos se escriben como comentarios dentro de los propios
ficheros ``.js``. Podemos hacer que se escriban en fichero aparte modificando
la configuración:

.. code-block:: js

   const merge = require('webpack-merge'),
         common = require('./webpack.common.js'),
         webpack = require("webpack");

   const config = merge(common, {
      mode: "development",
      devtool: false,
      plugins: [
         new webpack.SourceMapDevToolPlugin({
            filename: 'js/[name].js.map'
         })
      ]
   });

   module.exports = config

Particularidades
****************

.. _webpack-paths:

Cambiando rutas
===============
Si no se definen rutas, :program:`webpack` entiende que la fuente del código es
el directorio de trabajo y que los ficheros resultantes los debe guardar dentro
del directorio :file:`dist`. Para cambiar esto último, no obstante, se puede
hacer:

.. code-block:: js
   :emphasize-lines: 1, 2, 7

   const path = require("path");
   const distDir = "dist";

   const config = {
      entry: "./src/js/index.js",
      output: {
         path: path.resolve(__dirname, distDir),
         filename: "js/[name].bundle.js"
      }
   }

   module.exports = config
   
.. _webpack-entry-point:

Punto de entrada
================
Hasta ahora hemos definido el punto de entrada de la manera más simple posible:

.. code-block:: js

   entry: "./src/js/index.js"

que equivale a:

.. code-block:: js

   entry: {
      main: "./src/js/index.js"
   }

Esta equivalencia es la que provoca que para :program:`webpack` ``[name]`` se
sustituya por *main*, por lo que:

.. code-block:: js

   output: {
      filename: "js/[name].bundle.js"
   }

provoca que el fichero de salida sea :file:`js/main.bundle.js` (dentro de
:file:`dist/`, por supuesto). Como ya se ha explicado, este fichero no contiene
únicamente el punto de entrada :file:`src/js/index.js`, sino que cualquier
script en javascript que se importe dentro de él y, a se vez, los importados por
los importados, pasarán a formar parte de este fichero resultante. Los ficheros
de otra naturaleza importados en el propio código *Javascript* o a través del
código |HTML| o |CSS| de la aplicación también se procesarán pero para ello será
necesario el uso de plugins y cargadores (como ya se ha practicado) y,
obviamente, el resultado acabará en otros ficheros distintos.

Por tanto, una primera variante es alternar ese nombre predeterminado para
que ``[name]`` cambie a otro valor más apropiado:

.. code-block:: js

   entry: {
      "leaflet.mipluginmolon": "./src/js/index.js"
   }

AHora bien, esto no acaba aquí. Si estamos desarrollando una aplicación que se
compone de dos páginas web distintas, las cuales usan sendos scripts, podemos
hacer:

.. code-block:: js

   entry: {
      "site": ["./src/js/page1.js", "./src/js/page2.js"]
   }

lo cual tendrá el efecto de embutir ambos *scripts*\ [#]_ en un único fichero
resultante. Esto es necesario porque al ser dos *scripts* independientes
utilizar el primero u el segundo como punto de entrada no incluiría al otro en
la salida. Otra variante es:

.. code-block:: js

   entry: {
      "page1": "./src/js.page1.js",
      "page2": "./src/js.page2.js",
   }

que mantendrá ambos *scripts* separados creando dos ficheros de salida.

.. _babel:

Babel
=====
:program:`Babel` es un componente fundamental de nuestro propósito puesto que
permite sustituir sintaxis demasiado nueva por otra compatible con versiones más
antiguas de *Javascript*. Para usarlo y que transpile\ [#]_ de forma que quede una
sintaxis ampliamente soportada, podemos añadir algunas líneas a
:file:`webpack/webpack.production.js`:

.. literalinclude:: files/webpack.production.babel.js
   :language: js

e instalar los paquetes pertinentes:

.. code-block:: console

   $ npm install --save-dev babel-loader @babel/core @babel/cli @babel/preset-env

Este es el uso más simple, pero podemos ser bastante precisos y afinar mucho más
cuáles son los navegadores que pretendemos soportar. Para ello, debemos tener
presente que :program:`babel` es capaz de usar `la librería browserslist
<https://github.com/browserslist/browserslist>`_, en cuya documentación puede
leerse cómo expresar el grado de compatibilidad que se pretende conferir al
código. Hay varios modos de incluir este grado de compatibilidad, pero la
documentación recomienda el de incluirlo en :file:`package.json` a través de
la propiedad *browserslist*:

.. code-block:: js

   "browserslist": {
     "production": [
        "cover 95% in ES"
     ],
     "oneplus": [
        "> 1% in ES"
     ],
     "ie10": [
        "> .25% in ES",
        "ie >= 10"
     ],
     "relaxed": [
        "cover 80% in ES"
     ]
   }

Para probar la lista de navegadores que soportará el código podemos usar la
orden::

   $ npx browserslist

que usa la definición dada por *production*, pero podemos aplicar cualquier otra,
dando un valor a la variable de ambiente *NODE_ENV*::

   $ NODE_ENV=relaxed npx browserslist

Por tanto, podemos componer nuestra aplicación con::

   $ npm run build
   $ NODE_ENV=relaxed npm run build

.. rubric:: Polyfill

Si se requiere dar soporte en navegadores antiguos a funciones como Promise_,
Object.assign_ o `Array.from`_ es precisa una configuración más que depende de
si disponemos de una versión de :program:`babel` anterior a la **7.4**.

Para versiones anteriores se debe:

#. Instalar el paquete *@babel/polyfill*::

      # npm install --save @babel/pollyfill

   .. note:: No hay errata. Se debe instalar como dependencia y no como
      dependencia de desarrollo.

#. Modificar la configuración de :program:`webpack` para añadir una opción a
   :program:`babel`:

   .. literalinclude:: files/webpack.production.babel.polyfill.js
      :language: js
      :emphasize-lines: 17

   Con esa opción, sólo se añadirán al código *Javascript* resultante, el
   codigo necesario para implementar las funciones pertienen que hayamos
   incorporado al código.

A partir de la versión *7.4.0*, `la documentación recomienda usar core-js
<https://babeljs.io/docs/en/babel-polyfill>`_ para lo cual:

#. Instalamos el paquete correspondiente::

      # npm install --save core-js@3

#. Modificamos la configuración de :program:`webpack` para añadir un par de
   opciones a :program:`babel`:

   .. literalinclude:: files/webpack.production.babel.polyfill2.js
      :language: js
      :emphasize-lines: 17, 18

.. note:: Para probar la configuración, podemos añadir alguna sentencia sencilla
   al nuestro código *Javscript* que requiera *polyfill* como, por ejemplo:

   .. code-block:: js

      Object.assign({}, {a:1});

   Si probamos a generar le código con y sin la sentencia anterior y comparamos
   cuánto pesan ambos ficheros veremos una ostensible diferencia, ya que con la
   sentencia propuesta se tendrá que añadir el código necesario para implementar
   la función. Como sólo se añade el código indispensable para implementar las
   funciones necesarias, es buena idea configurar siempre *polyfill*.

|SASS|
======
Es posible también escribir el estilo con |SASS| y pedirle a :program:`webpack`
que automatice la transformación a |CSS|. Para ello, sin embargo, requerimos
instalar algunos paquetes más::

   $ npm install --save-dev sass-loader node-sass

sustituir :file:`css/main.css` por este fichero equivalente
:file:`_sass/main.sass`:

.. code-block:: sass

   $fondo: yellow

   body
      background-color: $fondo

y, en sustitución del borrado, importar este fichero en :file:`js/index.js`:

.. code-block:: js

   import style from "../_sass/main.sass";

Por último, habrá que cambiar la configuración de :program:`webpack` para que se
procesen los ficheros |SASS|, de modo que en sustitución de las líneas:

.. code-block:: js

   {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, "css-loader"]
   }

habrá que incluir:

.. code-block:: js

   {
      test: /\.sass$/i,
      use: [MiniCssExtractPlugin.loader,
            "css-loader", 
            "sass-loader"]
   }


Autoprefixer
============
Este *plugin* modifica el |CSS| resultante para añadir prefijos del vendedor a
las opciones cuando es preciso. Antes, no obstante, es necesario instalar
algunos paquetes opciones::

   $ npm install --save-dev postcss-loader autoprefixer

Añadamos a :file:`_sass/main.sass` alguna opción propicia:

.. code-block:: sass

   ::placeholder
      color: grey

y modifiquemos la configuración de :file:`webpack/webpack.common.js` para
habilitar la transformación:

.. code-block:: js
   :emphasize-lines: 5-10

   {
      test: /\.sass$/i,
      use: [MiniCssExtractPlugin.loader,
            "css-loader",
            { 
               loader: "postcss-loader",
               options: {
                  plugins: () => [require("autoprefixer")]
               }
            },
            "sass-loader"]
   }

.. note:: El *plugin* también usa :program:`browserslist` para determinar los
   prefijos que debe añadir, así que es aplicable lo explicado para :ref:`babel
   <babel>`.

Procesamiento de |CSS|
======================
Es interesante discutir sobre la forma de procesar el código |CSS|, porque
dependiendo de nuestras intenciones puede interesarnos alterar las intrucciones
vertidas hasta el momento. Algunas puntualizaciones, son aplicables al uso de
cargadores para otros tipos de ficheros. En principio hemos postulado:

.. code-block:: js

   {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, "css-loader"]
   }

y si el origen es un fichero |SASS|\ [#]_:

.. code-block:: js

   {
      test: /\.(css|sass)$/i,
      use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
   }

por lo que se puede adivinar que el procesamiento es de derecha a izquierda.  El
resultado del procesamiento de :program:`css-loader` es un módulo que debemos
seguir procesando para que nos resulte útil.
:program:`MiniCssExtractPlugin.loader` toma todos estos módulos y los compone en
un único fichero |CSS| que se coloca en el directorio de salida (el definido
mediante *output*). Sin embargo, hay otras soluciones:

:program:`style-loader`
   Que es capaz de tomar los módulos e incluirlos dentro de un elemento style_
   em eñ |HTML|:

   .. code-block:: js

      {
         test: /\.css$/i,
         use: ["style-loader", "css-loader"]
      }

:program:`file-loader`\ +\ :program:`extract-loader`
   :program:`extract-loader` permite tomar los módulos y generar cadenas de
   texto, mientras que :program:`file-loader` es capaz de tomar esas cadenas de
   texto y generar ficheros de salida, uno por cadena (o sea, por fichero de
   entrada) con lo que obtendré multiples ficheros en vez de uno solamente como
   al usar :program:`MiniCssExtractPlugin.loader`:

   .. code-block:: js

      {
         test: /\.css$/i,
         use: ["file-loader?name=[path][name].css", "extract-loader", "css-loader"]
      }

   .. note:: Esto, en principio, puede resultar algo absurdo, porque no se obra
      modificación alguna y en ese caso, casi es mejor o usar únicamente
      *file-loader* o copiar los ficheros de origen en un destino como hace
      CopyPlugin_ y que trataremos en los ejemplos, pero notemos que el origen
      no tienen por qué ser ficheros |CSS|, sino |SASS| si añadimos
      :program:`sass-loader` a la lista de cargadores.

Es también interesante reseñar que *use* puede ser también una función que
devuelva el array de cargadores, lo que permite generar de forma dinámica qué
transformaciones se obrarán:

.. code-block:: js

   {
      test: /\.css$/i,
      use: function(file) {
         console.log("Procesando... ", file.resource);
         return ["style-loader", "css-loader"];
      }
   }

También es útil saber que:

.. code-block:: js

   {
      test: /\.css$/i,
      use: [{
         loader: "file-loader",
         options: {
            name: "[name].[ext]"
         }
      }
   }

equivale a:

.. code-block:: js

   {
      test: /\.css$/i,
      user ["file-loader?name=[name].[ext]"]
   }

Imágenes
========
Imaginemos que incluimos en nuestro |HTML| de ejemplo alguna imagen:

.. code-block:: html

   <!DOCTYPE html>
   <html lang="es">
   <head>
      <meta charset="UTF-8">
      <title>Aplicación simple</title>
   </head>
   <body>
      <h1>Aplicación simple</h1>
      <img src="images/logo512.png" alt="Logo HTML grande">
      <img src="images/logo64.png" alt="Logo HTML pequeño">
   </body>
   </html>

.. note:: Para las imágenes se han tomando el logo de |HTML|\ 5, descargado de
   la `página oficial <https://www.w3.org/html/logo/>`_, en tamaño de 512px y
   64px.

Si probáramos inmediatamente a regenerar el *bundle*, veríamos que escupe un
error como consecuencia de que no sabe manejar este tipo de ficheros. Para
hacerlo es preciso usar :program:`url-loader`:

.. literalinclude:: files/webpack.common.file.js
   :language: js

Este cargador hace dos cosas:

- Copia el fichero (no tiene por qué ser una imagen) al resultado final.
- Pero si el fichero es menor que el límite definido (en el ejemplo 4K), en vez
  de copiar el fichero genera una dataURI_ en Base64.

.. note:: Para imágenes exclusivamente puede usarse :program:`img-loader` que es
   un minimizador de imágenes::

      # npm install --save-dev img-loader

   y la configuración podría hacerse así:

   .. code-block:: js

      {
         test: /\.(png|jpe?g|gif|svg)$/i,
         use: [
            'url-loader?limit=4096&name=images/[name].[ext]',
            'img-loader'
         ]
      }

Múltiples entornos
==================
Con la configuración hecha hasta aquí, tenemos dos configuraciones distintas:
una para producción y otra para desarrollo que se logran cargando ficheros
de configuración distintos. Sin embargo, :program:`webpack` permite pasar por
línea de comandos variables que pueden utilizarse dentro del *script* que
constituye la configuración\ [#]_. Jugar con los valores de estas variables posibilita
crear una amplia variedad de configuraciones de manera sencilla.

Para ilustrarlo crearemos una configuración con los siguientes ficheros:

.. code-block:: none

   +-- webpack.config.js
   +-- webpack/
         +-- webpack.common.js
         +-- webpack.production.js
         +-- webpack.development.js

que invocaremos del siguiente modo:

.. code-block:: js

   "scripts": {
      "build": "webpack --env.production",
      "watch": "webpack --env --watch",
      "debug": "webpack-dev-server --env --open chromium"
   },

En el caso de :code:`build` se pasa la variable *production* con un valor
verdadero, ya que no indicar su valor indica tal cosa
(:code:`--env.foobar=valor` permitiría pasar para una variable un valor
concreto). En los otros dos casos debe usarse :code:`--env` para que se creen el
objeto *env*, pero al no pasarlo *production* queda indefinido y, por tanto,
puede asimilarse a :code:`false`.

Los ficheros de configuración quedan así:

.. literalinclude:: files/webpack.common.f.js
   :language: js

.. literalinclude:: files/webpack.production.f.js
   :language: js
   :emphasize-lines: 17

.. literalinclude:: files/webpack.development.f.js
   :language: js

.. literalinclude:: files/webpack.config.f.js
   :language: js
   :emphasize-lines: 2

Para precisar la configuración se usan dos variables:

* *production*, ya introducida anteriormente.
* *debug*, que permite definir si se quieren mensajes de depuración
  de :ref:`babel <babel>`. 

Carga de módulos
================
Sistema de módulos
------------------
Como se verá en los :ref:`ejemplos posteriores <webpack-ejemplos>`, lo habitual
es que el código se deba cargar otros módulos propios o ajenos. :program:`webpack`
permite que se usa tanto el sistema CommonJS_ como el *ES2015*. Aconsejamos:

+ Usar CommonJS_ en los ficheros de configuración, ya que es el sistema para el
  que *NodeJS* tiene soporte.
+ Usar *ES2015* dentro del código de la propia aplicación, ya que es el estándar
  aprobado y bajo determinadas circunstancias (como no importar aplicaciones de
  terceros\ [#]_ dentro del propio código), genera un código directamente usable
  en navegadores modernos.

.. _webpack-conf-import:

Importación en la configuración
-------------------------------
Ya se ha visto que para cargar módulos (al estilo *ES2015*, por ejemplo) es
necesario::

   import L from "leaflet";
   import $ from "jquery";

Ahora bien, con :program:`webpack` es también posible hacer esta importación 
a través de la configuración, haciendo uso del plugin Provide_:

.. code-block:: js

   // webpack.config.js
   const webpack = require("webpack");

   module.exports = {
      // ...
      plugins: [
         new webpack.ProvidePlugin({
            L: "leaflet",
            $: "jquery"
         })
      ]
   }

Esta alternativa es provechosa para dos situaciones:

* Cuando se usan librerías de terceros, ya que :program:`webpack` será capaz de
  construir los ficheros resultantes (contengan o no estas librerías de terceros),
  pero su importación no se encuentra en el código, por lo que si hemos usando
  el estilo *ES2015* y el navegador es moderno y lo soporta, podremos usar
  directamente el código fuente a través de la etiqueta script_, añadiendo las
  librerías de terceros a través de otras etiquetas script_.

  .. code-block:: html

     <script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"></script>
     <script src="https://unpkg.com/jquery@3.3.1/dist/jquery.min.js"></script>
     <script type="module" src="src/js/index.js"></script>
  

* Cuando requirimos importar repetidamente las librerías en distintos ficheros
  de nuestra aplicación.

.. _webpack-ejemplos:

Ejemplos
********
Los ejemplos de aplicación los construiremos en torno a  Leaflet_, la excelente
librería |GIS| y trataremos tres casos:

#. La creación de un plugin para esta librería, lo cual supone no crear una
   aplicación web en sí, sino tan sólo código *Javascript* intermedio que puede
   usarse posteriormente en la creación de una aplicación web.

#. La creación del plugin comentado, pero con la adición de algún ejemplo de uso
   que permita, no sólamente ilustrar cómo se utiliza, si no también, comprobar
   el código del plugin mientras se desarrolla. Es en realidad este caso, el que
   se debe llevar a la práctica, porque es evidente que cualquier desarrollo
   exige un proceso continuo de comprobación del código.

#. La creación de una aplicación web que use el plugin anterior, lo cual
   significa que el resultado final será una página |HTML| (con todos sus
   avíos).

.. _webpack-ej-plugin:

Plugin
======
Trataremos de hacer un plugin que implemente el efecto de agrandar un icono al
pasar el punto del ratón sobre él. Tal plugin es bastante sencillo y no requiere
más que escribir unas pocas líneas en un único fichero ``.js``. A pesar de esta
simpleza, hay particularidad: como nuestro código utiliza una librería de
terceros (Leaflet_), el código resultante puede o no contenerla:

* Si la contiene, puede servirnos para utilizarlo directamente en una aplicación
  web sin necesidad de cargar también Leaflet_.
* Si no la contiene, puede servirnos tanto como librería para hacer desarrollos
  posteriores con *NodeJS* (por supuesto, instalando también Leaflet_), como para
  utlizarla directamente en una aplicación web cargando Leaflet_ con otra
  etiqueta script_.

#. Preparemos el directorio de trabajo:

   .. code-block:: console

      $ mkdir leaflet.iconzoom
      $ cd leaflet.iconzoom
      $ npm init -y

   .. note:: Se supone que estamos usando la configuración 
      :download:`~/.npm-init.js <../03.node/files/npm-init.js>` propuesta al
      explicar :ref:`cómo crear un  directorio de trabajo para NodeJS <prep_workdir>`.

   A la pregunta de cuál será el fichero principal contestaremos que
   :file:`dist/leaflet.iconzoom.js`. Esta pregunta no es baladí, ya que este
   será el fichero que se importará cuando un aplicación ulterior use este
   plugin, importándolo con la línea:

   .. code-block:: js

      import "leaflet.iconzoom";

   La razón de que este sea el fichero apropiado es que es perfectamente
   funcional, portable y está optimizado.

#. Editamos :file:`package.json` para dejar los *scripts* del siguiente modo:

   .. code-block:: js

      "scripts": {
         "build": "webpack --env.output=min",
         "bundle": "webpack --env.output=bundle",
         "src": "webpack --env.output=src",
         "debug": "webpack-dev-server --env.output=debug --open"
      }

   *build*
      Código para producción **sin** Leaflet_:

      .. code-block:: html

         <!-- Leaflet -->
         <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css">
         <script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"></script>

         <!-- Plugin -->
         <script src="../dist/leaflet.iconzoom.js"></script>

   *bundle*
      Código para producción que incluye Leaflet_.

      .. code-block:: html

         <!-- Leaflet+Plugin -->
         <link rel="stylesheet" href="../dist/leaflet.iconzoom.bundle.css">
         <script src="../dist/leaflet.iconzoom.bundle.js"></script>

      .. note:: En este caso, el *plugin* es muy sencillo y no requiere |CSS|
         adicional, por lo que el |CSS| generado será una copia, sin más, del de
         Leaflet_.

   *src*
      Código para depuración **sin** Leaflet_ para su carga desde un navegador:
      .. code-block:: html

         <!-- Leaflet -->
         <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css">
         <script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"></script>

         <!-- Plugin para depuración -->
         <script src="../dist/leaflet.iconzoom-src.js"></script>

      En principio, es útil para que terceros puedan inspeccionar el código y
      cazar *bugs* sin necesidad de usar de instalar NodeJS_ y preparar un
      directorio de trabajo con el código fuente.

      .. note:: Si el navegador fuera moderno, podríamos utilizar directamente
         el código fuente, en vez de este fichero:

         .. code-block:: html

            <!-- Leaflet -->
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css">
            <script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"></script>

            <!-- Plugin para depuración -->
            <script type="module" src="../src/index.js"></script>

   *debug*
      Script para depuración interactiva. Como esto requiere crear un ejemplo de
      uso y una configuración más compleja de :program:`webpack`, no será operativo
      hasta que desarrollemos el próximo caso.

#. Instalamos los paquetes necesarios\ [#]_:

   .. code-block:: console

      $ npm install --save-dev webpack webpack-dev-server webpack-cli webpack-merge
      $ npm install --save-dev babel-loader @babel/core @babel/cli @babel/preset-env
      $ npm install core-js leaflet
      $ npm install --save-dev css-loader mini-css-extract-plugin
      $ npm install --save-dev url-loader file-loader

#. Escribimos el plugin en :download:`src/leaflet.iconzoom.js
   <files/leaflet.iconzoom.js>`:

   .. literalinclude:: files/leaflet.iconzoom.js
      :language: js

   .. note:: Del código pueden resultar chocantes varios aspectos:

      - El módulo se limita a alterar el objeto global :code:`L` por lo
        que no es preciso exportar nada. De haber exportado algo, se habría
        usado el sistema de módulos de *ES2015*.

      - No se importa dentro del código nada procedente de Leaflet_, porque:

        + El código *Javascript* se importará a través del :ref:`plugin Provide
          <webpack-conf-import>` por ser la librería de terceros.
        + El código |CSS| se incluirá en el punto de entrada, para
          lograr que se lleve a cabo el procesamiento sólo si obtiene la
          variante *bundle* del p*lugin*.

#. Y el verdadero meollo, configuramos :program:`webpack` de forma modular. Por
   un lado, :download:`webpack.config.js <files/webpack.config.f.js>`:

   .. literalinclude:: files/webpack.config.f.js
      :language: js

   En la parte común de la configuración, :download:`webpack/webpack.common.js
   <files/plugin/webpack.common.js>`, que es esta:

   .. _webpack-plugin-webpack.common.js:
   
   .. literalinclude:: files/plugin/webpack.common.js
      :language: js
      :emphasize-lines: 9-19, 29-31, 36, 63-76

   Hay algunas aclaraciones pertinentes:

   * El nombre del fichero de salida, cambia dependiendo de qué versión queramos
     obtener. Esto permite generarlas todas y poder elegir cuál se usará desde
     otra aplicación.

   * Se importa el javascript de Leaflet_ mediante el plugin Provide_, tal como
     se enticipó al mostrar el código del *plugin*.

   * Para la versión *bundle* se añade al punto de entrada el |CSS| de Leaflet_,
     a fin de que sólamente genere el |CSS| en esta versión. En consonancia,
     sólo es necesario tratar el |CSS| y los ficheros externos en esta versión.

   * Para el resto de versiones que no incluyen Leaflet_:

     a. Añadiendo `externals <https://webpack.js.org/configuration/externals/>`_
        se logra eliminar Leaflet_ del fichero resultante, pero hay que indicar
        cómo estará disponible la librería dependiendo de cómo se cargue.
        Obviamente, esto es posible porque:
   
     #. A *output* se añaden unos atributos que permiten construir un módulo |UMD|
        que es válido tanto para usarlo directamente en el navegador (con
        `script`_) como para usarlo en *NodeJS* (ya que puede cargarse con
        :ref:`CommonJS <module-commonjs>`). El valor de *library* es el nombre de
        la variable global que contendrá el objeto que exporta el módulo. Por
        tanto, en este ejemplo, si la librería se carga directamente en el
        navegador, :code:`window.Lcz` contendrá lo exportado. Como el módulo no
        exporta nada, carece por completo de interés.

     .. seealso:: Échele un ojo a la documentación oficial sobre la `creación de
        módulos con webpack <https://webpack.js.org/guides/author-libraries/>`_.

   :download:`webpack/webpack.development.js
   <files/plugin/webpack.development.js>` no presenta novedades destacables;
   simplemente, se ha optado por colocar los mapeos por separado:

   .. literalinclude:: files/plugin/webpack.development.js
      :language: js

   .. _webpack-externals:

   Del mismo modo, tampoco, :download:`webpack/webpack.production.js
   <files/plugin/webpack.production.js>` presenta novedades:

   .. literalinclude:: files/plugin/webpack.production.js
      :language: js

#. Generamos los ficheros resultantes:

   .. code-block:: console

      $ npm run build
      $ npm run src
      $ npm run bundle

   .. note:: Es importante recordar que en :file:`packages.json` hemos notado
      como el fichero principal a :file:`dist/leaflet.iconzoom.js`, así que
      conviene que al menos éste se genere.

#. Hecho todo lo anterior, podemos rematar el repositorio *git*:

   .. code-block:: console

      $ vim README.rst
      $ vim LICENSE
      $ git add .
      $ git commit "Primera implementación"

   crear en Github_ un repositorio homónimo (*leaflet.iconzoom*) sin inicializar
   con nuestro usuario, y subir el código a él:

   .. code-block:: console

      $ git remote add origin https://github.com/miusuario/leaflet.iconzoom.git
      $ git push -u origin master

El resultado es `este repositorio de Github
<https://github.com/sio2sio2/leaflet.iconzoom/tree/v0.1.0>`_.

Aplicación web
==============
La aplicación web desarrolla una página muy simple que usa el *plugin* anterior.
Como es una aplicación final, a diferencia del caso del *plugin*, sólo
necesita dos sabores:

- El optimizado y portable para producción, que incluirá todas las dependencias
  (Leaflet_ en este caso).

- El apropiado para la depuración, durante el desarrollo.

#. Preparamos el directorio de trabajo:

   .. code-block:: console

      $ mkdir test.leaflet.iconzoom
      $ cd test.leaflet.iconzoom
      $ npm init -y

#. Instalamos el *software* preciso:

   .. code-block:: console
   
      $ npm install --save-dev webpack webpack-dev-server webpack-cli webpack-merge
      $ npm install --save-dev babel-loader @babel/core @babel/cli @babel/preset-env
      $ npm install --save-dev html-loader html-webpack-plugin
      $ npm install --save-dev css-loader mini-css-extract-plugin
      $ npm install --save-dev url-loader file-loader
      $ npm install --save-dev sass-loader node-sass
      $ npm install --save-dev postcss-loader autoprefixer
      $ npm install core-js leaflet
      $ npm install git+https://github.com/sio2sio2/leaflet.iconzoom.git

#. Configuramos los *scripts*:

   .. code-block:: js

      "scripts": {
        "build": "webpack --env.output=min",
        "debug": "webpack-dev-server --env.output=debug --open"
      },

   El primero de los cuales, genera la aplicación para producción y el segundo
   es útil para depurar la aplicación.

#. Creamos los ficheros que conforman el proyecto:

   .. code-block:: none

      + src
         +-- index.html
         +-- js
         |    +-- index.js
         +-- sass
              +-- index.sass

   a. Creamos la página :download:`src/index.html <files/page/index.html>`:

      .. literalinclude:: files/page/index.html
         :language: html

      Como puede verse, es la página cruda sin enlaces a Leaflet_, el plugin
      anterior o el *script* que crea el mapa.

   b. Definimos el estilo (con |SASS|) en :download:`src/sass/index.sass <files/page/index.sass>`:

      .. literalinclude:: files/page/index.sass
         :language: sass

   c. Y el propio *script* :download:`src/js/index.js <files/page/index.js>`:

      .. literalinclude:: files/page/index.js
         :language: js

      .. note:: En este caso, como desarrollamos una aplicación final, no
         necesitamos tener ninguna prevención sobre cómo importamos Leaflet_ o
         el propia plugin que previamente hemos desarrollado.

#. Y creamos la configuración para :program:`webpack` con

   :download:`webpack.config.js <files/page/webpack.config.js>`:

   .. literalinclude:: files/page/webpack.config.js
      :language: js

   :download:`webpack/webpack.common.js <files/page/webpack.common.js>`, que
   hace que los ficheros resultantes se generen dentro de :file:`docs/`\ [#]_:

   .. literalinclude:: files/page/webpack.common.js
      :language: js
      :emphasize-lines: 10

   :download:`webpack.production.js <files/page/webpack.production.js>`:

   .. literalinclude:: files/page/webpack.production.js
      :language: js

   :download:`webpack.development.js <files/page/webpack.development.js>`:

   .. literalinclude:: files/page/webpack.development.js
      :language: js

#. Generamos el resultado:

   .. code-block:: console

      $ npm run build

#. Por último, se remata y publica el repositorio:

   .. code-block:: console

      $ vim README.rst
      $ vim LICENSE
      $ git add --all .
      $ git commit -m "Primera implementación"

      $ git remote add origin https://github.com/sio2sio2/test.iconzoom.git
      $ git push -u origin master

   .. note:: Para que el ejemplo sea visitable, en Github_ dentro de *Settings*,
      la publicación del directorio :file:`/docs` de la rama *master*.

El resultado está publicado en `este segundo repositorio
<https://github.com/sio2sio2/test.iconzoom>`_.

Plugin con ejemplo
==================
Cuando se desarrolla una librería y no una aplicación, es indispensable crear al
menos una página de ejemplo de aplicación por dos razones:

#. Porque un ejemplo de aplicación que ilustre el uso es muy recomendable para
   mostrar a terceros cómo debe programar con la librería
#. Porque la propia página sirve para probar y depurar el código.

La primera razón implica que todo el código del ejemplo (|HTML|, |CSS| y
*Javascript*) sea absolutamente claro a la lectura de un programador humano, lo
cual se consigue escribiendo a mano los ficheros que componen el ejemplo e
impidiendo que :program:`webpack` pueda obrar transformación alguna. 

Siguiendo este principio, tomemos el directorio de trabajo del :ref:`ejemplo de
desarrollo del plugin <webpack-ej-plugin>` y añadamos un directorio
:file:`examples/`\ [#]_ con todo el código que desarrolla el ejemplo:

.. code-block:: none

   +-- examples
         +-- index.html
         +-- js/
         |   +-- main.js
         +-- css/
             +-- main.css

:download:`index.html <files/page-e/index.html>`, que escribimos por completo a
mano tendrá este contenido:

.. literalinclude:: files/page-e/index.html
   :language: html

:download:`js/main.js <files/page-e/main.js>`, este otro:

.. literalinclude:: files/page-e/main.js
   :language: js

y :download:`css/main.css <files/page-e/main.css>`, finalmente, este:

.. literalinclude:: files/page-e/main.css
   :language: css

Si se han generado los ficheros en :file:`dist/`, el ejemplo es perfectamente
funcional y, si se ejecuta en el directorio de trabajo
:program:`webpack-dev-server` mediante esta orden:

.. code-block:: console

   $ npx webpack-dev-server --env.output debug --contentBase $(realpath .)

podremos ver la página en la dirección:

.. code-block:: none

   http://localhost:8080/examples

Podríamos trasladar esta forma de arrancar el servidor a la configuración, pero
hay un problema y es la segunda razón por la que es interesante el ejemplo: la
depuración durante el desarrollo. Al estar constituido el ejemplo por ficheros
estáticos accesibles al servidor a través de la opción *contentBase*, sólo se
mandará orden de recarga cuando se cambie el código del plugin (que sí se genera
con :program:`webpack`, pero no cuando cambie el código del ejemplo; y lo
interesante es que la recarga se produzca ante cualquier cambio.

La solución viene de la mano del plugin de :program:`webpack` CopyPlugin_ que le
facilita copiar en crudo ficheros y directorios. La estrategia es copiar
:file:`examples`, porque de este modo sí se procesará el contenido y, en
consecuencia, cualquier cambio en él también provocará la recarga de la página.
Lo primero es instalar el plugin:

.. code-block:: console

   $ npm install --save-dev copy-webpack-plugin

Y, lo siguiente, alterar :download:`webpack/webpack.development.js
<files/page-e/webpack.development.js>`:

.. literalinclude:: files/page-e/webpack.development.js
   :language: js
   :emphasize-lines: 3, 9, 14-18, 25-35

El fichero se ha modificado exclusivamente para modelar cómo se comporta
*webpack* en el sabor *debug* y las claves de los cambios son:

* CopyPlugin_ copia el contenido de :file:`examples/` en el propio directorio
  virtual, pero obviando los ficheros de backup de :program:`vi` para evitar
  que, si se usa este editor, el proceso de edición provoque la continua
  recarga de la página. Si se usa otra herramienta para el desarrollo, es
  probable que deba cambiar la lista de ignorados.

* También en el directorio virtual se generían los ficheros resultantes de la
  transformación del plugin, pero en el ejemplo se encuentra escrito:

  .. code-block:: html

     <!-- Plugin -->
     <script src="../dist/leaflet.iconzoom.js"></script>

  Para que siga funcionando en este sabor el enlace, es necesario modificar la
  salida y añadir :file:`dist/` antes del nombre.

* En :ref:`webpack/webpack.common.js <webpack-plugin-webpack.common.js>` hay un
  detalle que es conveniente aclarar ahora: el nombre del fichero resultante
  para el sabor *min* y *debug* es el mismo, lo que provoca que, cuando se
  visite el ejemplo durante la depuración podamos seguir la ejecución del código
  en los ficheros originales, mientras que cuando se visita el ejemplo a través
  de las páginas de Github_, se utiliza el código optimizado.

El resultado se encuentra en `su repositorio de Github
<https://github.com/sio2sio2/leaflet.iconzoom>`_ y en las páginas de Github_ se
encuentra colgado `el ejemplo de uso
<https://sio2sio2.github.io/leaflet.iconzoom/examples>`_.


.. rubric:: Enlaces de interés

* En el interesante `blog de Valentino Gagliardi
  <https://www.valentinog.com/blog/>`_ hay una entrada de `introducción a
  Webpack4 <https://www.valentinog.com/blog/webpack/>`_ y otra para describir
  `cómo hacer con Webpack4 tareas que se hacen con Gulp
  <https://www.valentinog.com/blog/from-gulp-to-webpack-4-tutorial/>`_ y que
  puede informar de algunos aspectos adicionales a los explicados en la primera
  entrada

.. ¿Merecen estos scripts la pena?
   https://www.robinwieruch.de/javascript-project-setup-tutorial/
   https://www.robinwieruch.de/webpack-advanced-setup-tutorial/

.. rubric:: Notas al pie

.. [#] Por lo general, los que saben de esto suelen recomendar el uso de
   :program:`webpack`. Por ejemplo, éche un vistazo a `esta justificación
   <https://openwebinars.net/blog/webpack-vs-gulp-comparacion-en-espanol-actualizado/>`_

.. [#] Tengamos presente que :code:`__dirname` es :file:`webpack`, ya que la
   configuración se encuentra en :file:`webpack/webpack.development.js`.

.. [#] Si se usa :code:`--open` sin argumento adicional:

   .. code-block:: js

      "debug": "webpack-dev-server --mode development --open"

   tomará como valor :code:`true`. Sin embargo, puedo añadirse el navegador que
   se quiere usar:

   .. code-block:: js

      "debug": "webpack-dev-server --mode development --open chromium"

   Se prefiere, no obstante, no incluir el argumento y darle valor a *open* a
   través de la configuración.

.. [#] En los sistemas *linux*, el navegador predefinido es el que se obtiene
   así:

   .. code-block:: console

      $ xdg-settings get default-web-browser
      firefox-esr.desktop

.. [#] Entiéndase que los dos scripts no tienen por qué corresponderse con dos
   ficheros. Cada uno de ellos puede estar programado de forma modular y
   componerse de múltiples ficheros.

.. [#] *Transpilar* (y transpilación y transpilador) es un término
   construido por analogía con el verbo *compilar*. De un modo análogo al que 
   :dfn:`compilar` sea convertir código de programación en código máquina,
   :dfn:`transpilar` es traducir còdigo de programación a una versión distinta,
   por ejemplo, a una más antigua para mantener la compatibilidad con versiones
   más antiguas del intérprete. Traducir de `CoffeeScript`_ o `TypeScript`_ a
   *Javascript* también es *transpilar*.

.. [#] También podemos usar :program:`postcss-loader`, entre :program:`css-loader`
   y :program:`sass-loader`, pero importa poco a efectos de esta discusión.

.. [#] Las variables de entorno que se pasan de forma estándar (véase *NODE_ENV*
   cuando se trataba :ref:`babel <babel>`) se encuentran disponibles en el
   script a través de :code:`process.env`:

   .. code-block:: js

      console.log(process.env.HOME)

.. [#] A menos claro está que hayamos hecho una copia incluida en nuestro
   desarrollo de ese módulo ajeno, porque el problema de las librerías de
   terceros es que se encuentran alojadas fuera del directorio de trabajo (en
   :file:`node_modules` o en el directorio global de instalación) y esa
   localización no es alcanzable por un cliente web. Otra solución es usar el
   plugin Provide_, que se explica a continuación.

.. [#] La necesidad de incluir los cuatro últimos paquetes se debe a que
   nuestra intención es ser capaces de procesar el |CSS| de Leaflet_ para
   el script *bundle*, y tal fichero *refiere*, además, algunas imágenes.

.. [#] Esta aparente excentricidad tiene una explicación totalmente ajena a la
   aplicación en sí: entre otras alternativas, Github_ permite publicar el
   contenida del directorio :file:`/docs`, así que hay se almacena el resultado
   para que éste se publique en la dirección
   `https://sio2sio2.github.io/test.iconizoom <https://sio2sio2.github.io/test.iconizoom>`_

.. [#] La elección no es arbitraria: es el directorio donde la `Guía de Leaflet
   <https://leafletjs.com/2013/06/28/leaflet-plugin-authoring-guide.html#code>`_
   prescribe que se dispongan los ejemplos.

.. _script: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
.. _link: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link
.. _CoffeeScript: https://coffeescript.org/#introduction
.. _TypeScript: https://www.typescriptlang.org/
.. _Object.assign: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
.. _Promise: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
.. _Array.from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
.. _dataURI: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
.. _Leaflet: https://leafletjs.com
.. _Bootstrap: https://getbootstrap.com/
.. _Less: http://lesscss.org/
.. _Github: https://github.com
.. _CommonJS: https://nodejs.org/docs/latest/api/modules.html
.. _Provide: https://webpack.js.org/plugins/provide-plugin/
.. _Gulp: https://gulpjs.com/
.. _Browserify: http://browserify.org/
.. _NodeJS: https://nodejs.org/
.. _CopyPlugin: https://github.com/webpack-contrib/copy-webpack-plugin
.. _style: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style

.. |HTML| replace:: :abbr:`HTML (HyperText Markup Language)`
.. |CSS| replace:: :abbr:`CSS (Cascading Style Sheets)`
.. |SASS| replace:: :abbr:`SASS (Syntactically Awesome Style Sheets)`
.. |GIS| replace:: :abbr:`GIS (Geographic information system)`
.. |UMD| replace::  :abbr:`UMD (Universal Module Definition)`
