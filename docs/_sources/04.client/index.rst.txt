.. _webpack:

**************************
Programación en el cliente 
**************************
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

Existe varias alternativas para lograr este objetivo (Gulp_\ +\ Browserify_
podría ser una de ellas), aunque aquí nos centraremos en analizar
:program:`webpack`\ [#]_.

.. rubric:: Contenidos

.. toctree::
   :glob:
   :maxdepth: 2

   [0-9]*

.. rubric:: Enlaces de interés

* En el interesante `blog de Valentino Gagliardi
  <https://www.valentinog.com/blog/>`_ hay una entrada de `introducción a
  Webpack4 <https://www.valentinog.com/blog/webpack/>`_ y otra para describir
  `cómo hacer con Webpack4 tareas que se hacen con Gulp
  <https://www.valentinog.com/blog/from-gulp-to-webpack-4-tutorial/>`_ y que
  puede informar de algunos aspectos adicionales a los explicados en la primera
  entrada

.. ¿Merecen estos enlaces la pena?
   https://www.robinwieruch.de/javascript-project-setup-tutorial/
   https://www.robinwieruch.de/webpack-advanced-setup-tutorial/

* `Optimising your application bundle size with webpack
  <https://hackernoon.com/optimising-your-application-bundle-size-with-webpack-e85b00bab579>`_.

.. rubric:: Notas al pie

.. [#] Por lo general, los que saben de esto suelen recomendar el uso de
   :program:`webpack`. Por ejemplo, éche un vistazo a `esta justificación
   <https://openwebinars.net/blog/webpack-vs-gulp-comparacion-en-espanol-actualizado/>`_

.. _script: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
.. _link: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link
.. _Less: http://lesscss.org/
.. _Gulp: https://gulpjs.com/
.. _Browserify: http://browserify.org/

.. |HTML| replace:: :abbr:`HTML (HyperText Markup Language)`
.. |CSS| replace:: :abbr:`CSS (Cascading Style Sheets)`
.. |SASS| replace:: :abbr:`SASS (Syntactically Awesome Style Sheets)`
