Programación en el cliente 
==========================
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

   [0-9]*/index

.. rubric:: Notas al pie

.. [#] La tendencia indica que el `uso de webpack es cada vez mayor
   <https://buddy.works/blog/webpack-vs-gulp>`_.

.. _script: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script
.. _link: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link
.. _Less: http://lesscss.org/
.. _Gulp: https://gulpjs.com/
.. _Browserify: http://browserify.org/

.. |HTML| replace:: :abbr:`HTML (HyperText Markup Language)`
.. |CSS| replace:: :abbr:`CSS (Cascading Style Sheets)`
.. |SASS| replace:: :abbr:`SASS (Syntactically Awesome Style Sheets)`
