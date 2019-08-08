.. _node.js:

NodeJS_
=======
Durante mucho tiempo la programación en *Javascript* se limitó básicamente a
proporcionar algunos efectos en el navegador y mecanismos de validación más o
menos complejos en los formularios, mientras que el grueso de la programación
se resolvía en el lado del servidor. La falta de estandarización efectiva que
provocaba la existencia de múltiples extensiones que hacían el código
incompatible entre navegadores tampoco ayudaba demasiado.

Sin embargo, la competencia entre navegadores y la consiguiente implantación de
los estándares web (incluido ECMAScript_),
la aparición de Ajax_ y el hito que supuso la interfaz de Gmail_, y la aparición
de la máquina virtual `V8 de Google`_ que propició la aparición de NodeJS_,
ha cambiado aquella situación por completo. En la actualidad gran parte de la
programación se ha transladado al cliente y los navegadores llegan a ejecutar
código largo y complejo. Además, la máquina virtual ha posibilitado que el
propio *Javascript* puede utilizarse como lenguaje de servidor.

En consecuencia, las técnicas para programar *Javascript* han evolucionado y, en
gran parte de los casos, escribir un único fichero ``.js`` con todo el código de
la aplicación es inviable, como sería inviable construir dentro de un fichero
toda una aplicación en *Python* o *Java*.

Trataremos bajo este epígrafe cómo preparar un entorno para programar
aplicaciones modernas con NodeJS_, ya sean para servidor o para cliente.

.. toctree::
   :glob:
   :maxdepth: 2

   [0-9]*

.. _ECMAScript: http://www.ecma-international.org/publications/standards/Ecma-262.htm
.. _AJAX: https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX
.. _Gmail: http://gmail.google.com
.. _V8 de Google: https://v8.dev/
.. _NodeJS: https://nodejs.org/es/
