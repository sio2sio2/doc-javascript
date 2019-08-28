.. highlight: js

****************
Particularidades
****************

Generalidades
*************

Características
===============
Resumiendo enormemente, *Javascript* es un lenguaje:

- Interpretado

- Imperativo orientado a objetos (aunque :ref:`ya veremos <object-model>` que no
  basado en clases), pero con muchas características propias de la programación
  funcional.

- De tipado dinámico y débil.

Versiones
=========
*Javascript* nació en el `navegador Netscape <https://es.wikipedia.org/wiki/Netscape_Navigator>`_,
aunque pronto fue adoptado e implementado ("a su manera*") en su competidor `Internet Explorer
<https://es.wikipedia.org/wiki/Internet_Explorer>`_ con el nombre de *JScript* y
surgieron toda una de incompatibilidades que lastraban el desarrollo de la web.

En 1997, *Netscape* remitió a la *ECMA* el lenguaje para su estandarización y
surgieron las distintas versiones del estándar *ECMAScript* (abreviado *ES* o
*ES-262*, en donde el número hace referencia a que el estándar es la norma
*ECMA* 262):

* **ES1** (1997), **ES2** (1998), **ES3** (1999) y la nunca publicada versión 4, que
  podemos agrupar juntas y son las versiones arcaicas del lenguaje.

* **ES5** surgida en 2009.

* **ES2015** (también conocida como *Javascript* v6) de 2015. La decisión de
  sustituir el número de versión por el año de lanzamiento se debió a que *ECMA*
  decidió editar nuevas versiones en los meses de junio de cada año. y así ha
  seguido siendo. Esta versión incorporó bastantes novedades respecto a la
  anterior.

* **ES2016**, **ES2017**, etc.

.. note:: A pesar del cambio de denominación es frecuente que algunos sigan
   refiriendo las versiones con su número de lanzamiento.

Modo estricto
=============
En *ES5* se introdujo un modo estricto para el lenguaje que, simplemente, le
indica al intérprete que sea menos permisivo al interpretar el lenguaje. Se
puede interpretar estrictamente un fichero entero o una función particular. Para
ello, la primera línea del fichero o la función debe contener esta cadena::

   "use strict";

El efecto de utilizar el modo estricto es que el intérprete falla al encontrarse
con código que, por lo general, se debe a errores de digitalización o tienen
efectos secundarios indeseados. Por ejemplo, en modo estricto no puede usarse
una variable si previamente no se ha declarado explícitamente.

.. note:: Es importante tener presente que la especificación de *ES2015*
   prescribe que los módulos se interpreten siempre en modo estricto, aunque no
   se haya indicado explícitamente.

Variables
*********
Declaración
===========
Hay tres modos de declarar variables::

   var x = 2;
   let z = 4;
   const Y = 3;

La primera forma es la única que ha existido tradicionalmente; mientras que la
segunda y la tercera se introdujeron en *ES2015*. La última forma permite
definir constantes y requiere obligatoriamente declarar cuál es el valor
asignado. Las otras dos, en cambio, pueden declararse sin recibir valor. En tal
caso, su valor es :code.`undefined`, hasta que no se le asigne un valor.

Por otra parte, en *Javascript* las funciones son ciudadanas de primera clase.

Hay otra diferencia capital entre estas tres declaraciones relacionada con su
ámbito de existencia: las declaradas con :code:`var` tiene como ámbito la
función dentro de la que se definen, mientras que las declaradas con :code:`let`
y :code:`const` el bloque. Se profundizará más adelante en ello.

.. _decl-no-var:

Cuando se lleva a cabo una asignación, sin haber hecho una declaración previa
pueden ocurrir dos cosas:

- En modo estricto, la variable pasa a ser un atributo del :ref:`objeto global
  <objeto-global>`.
- En otro caso, se produce un error.

Contexto de ejecución
=====================
El :dfn:`contexto de ejecución` es, simplemente, el contexto en que se ejecuta
una determinada parte del código. En *Javascript* hay un contexto global y cada
función crea su propio contexto de ejecución::

   // Contexto global
   var a = 1;

   function f1() {
      // Contexto de f1
      var b = 2;
      f2();
      console.log("Dentro del contexto de f1");
   }

   function f2() {
      // Contexto de f2
      var c = 3;
      console.log("Dentro del contexto de f2");
   }

   f1();

En el caso de los contextos de ejecución se habla de :dfn:`pila de contextos`,
ya que al comenzar el programa se crea el contexto global, al invocarse la
función :code:`f1()` se crea un contexto para esta función, dentro de la cual se
invoca a la función :code:`f2()` lo que provoca la creación de otro contexto. Al
salir de esta última función se destruye este contexto y volvemos al contexto de
la función :code:`f1` y al acabar esta, regresamos al contexto global, el cual
se destruye al acabar el programa. Obsérvese que la *pila de contextos* depende
de por dónde se desarrolle la ejecución.

Es preciso puntualizar que cuando existen diferentes ficheros, el
comportamientdo difiere dependiendo de cuál sea el interprete:

- En los navegadores, todos los ficheros comparten el mismo contexto que es un
  contexto glonal, por lo que si nen el nivel superior definimos::

   var x = 2;

  estaremos haciendo exactamente lo mismo que\ [#]_::

   window.x = 2


- En NodeJS_, en cambio, al ser cada fichero un módulo distinto, cada fichero
  tiene su contexto particular.

Cada vez que se crea un contexto, el intérprete establece tres cosas:

- Un entorno léxico (*lexical environment*).
- Un entorno de variable (*variable environment*).
- Un objeto :code:`this`.

Entornos
========
Al crearse un nuevo contexto de ejecución se crean un entorno léxico y un
entorno de variable que, en principio, son idénticos. Cada entorno recoge la
declaración de variables y funciones y una referencia al entorno externo. En
consecuencia, en el entorno de la función ``f2()``, tenemos acceso a la variable
``c``, pero también a la ``b`` y a la ``a``, ya que cuando un identificador no
se encuentra en el propio entorno se sigue buscando en el entorno externo y, si
tampoco se encuentra en este se busca en el externo del externo y así
sucesivamente hasta llegar al entorno global, cuyo entorno externo es
:code:`null`. Esto define una :dfn:`cadena de alcances`. Por la misma razón, si
en un entorno interno se define una variable con el mismo nombre que en un
entorno externo, la variable externa queda eclipsada, ya que nunca se consultará
su valor al haberse encontrado antes en la *cadena de alcances*. Obsérvese que
la *cadena de alcances* depende de cómo esté escrito el código, no de cómo se
ejecute.

Afinando más, un entorno está constituido por:

- Una referencia al entorno extorno (que es lo que posibilita la *cadena de
  alcances*).
- Un registro de ambiente que mapea identificadores con valores. Tal registro
  tiene dos clases de registros:

  + Los registros declarativos del entorno para las declaraciones de variables y
    funciones llevadas a cabo en el entorno.
  + Los registros de objeto del entorno que se usan con la sentencia with_ y
    para el entorno global. Por esta razón, las definiciones hechas sobre el
    :ref:`objeto global <objeto-global>` siempre están disponibles.

Ya hemos indicado que en un principio, los entornos léxico y de variables son
idénticos en un *contexto de ejecución*. Cuándo y por qué divergen es fácil de
entender con un ejemplo::

   function foobar() {
      var a = 1;

      {
         var b = 2;
         let c = 3;
      }

   }

Ya se indicó que el ámbito de las variables declaradas con ``var`` es la
función, mientras que la de las definidas con ``let`` (o  ``const``) es el
bloque. En consecuencia, ``b``, aunque definida dentro del bloque, existe
fuera de él. De hecho, *Javascript* opera de manera que traslada siempre las
declaraciones de las variables (aunque no la asignación) al comienzo de su ámbito,
por lo que ``b`` antes del bloque existe, aunque está indefinido::

   function foobar() {
      var a = 1;

      // Aquí existe b pero vale undefined.

      {
         var b = 2;
         let c = 3;
      }

      // Aquí b vale 2.

   }

``c``, en cambio, sólo existe dentro del bloque. La forma que usa el intérprete
para implementar esto es la de apuntar ``b`` en el entorno de variables, pero
``c`` en el entorno léxico. Por tanto, dentro del bloque el entorno de variables
y el entorno de variables difiere.

.. _objeto-global:

Objeto global
=============
:dfn:`Objeto global` es aquel que las definidas que pertenecen al alcance global.
En un navegador el objeto global es *window*.

.. note:: Recuérdese que en modo **no estricto**, las asignaciones sin
   declaración se definen como variables globales, esto es, pasan a formar parte
   del objeto global.

Objeto :code:`this`
===================
Cada contexto de ejecución tiene asociado un objeto :code:`this`. Es importante
tener presente que el significado de :code:`this` en *Javascript* es mucho
amplio que el que tiene comúnmente en lenguajes orientados a objetos como *Java*
o *Python* (aunque en este se pueda llamar de cualquier manera). En estos
lenguajes, :code:`this` representa al objeto mismo dentro de sus propios
métodos. Por eso, en *Python* podríamos escribir:

.. code-block:: python

   class Rectangulo:

      def __init__(self, x, y):
         self.width = x
         self.height = y

      def area():
         return self.width*self.height;

En *Javascript*, tiene este significado que ya se tratará con el :ref:`modelo de
objetos <object-model>`, pero no exclusivamente, ya que cualquier contexto de
ejecución tiene definido este objeto.

En el contexto global, el valor de :code:`this`:

- En los navegadores :code:`this` coincide con el objeto global, y los contextos
  globales de todos los ficheros de código son exactamente el mismo.

- En NodeJS_. en cambio, cada fichero tiene un contexto diferente y el valor de
  :code:`this` coincide con el objeto de importación (en caso de que se use
  *CommonJS*)::

      exports.a = 1;
      let b = 2;

      console.log(this);  // {a: 1}

      function c() {
         console.log("Soy una función");
      }

      exports.c = c;

      console.log(this);  // {a: 1, c: [Function: c]}


   .. seealso:: A su debido tiempo. requerirá echarle un ojo a los :ref:`módulos
      en Javascript <js-modules>`.

La discusión sobre el valor de :code:`this`, la incluiremos bajo el próximo
epígrafe.

Funciones
*********
Las funciones en *Javascript* tiene algunas particularidades que conviene
conocer.

Sintaxis
========
Hay dos formas de definir funciones:

* La **tradicional**::

     function suma(arg1, arg2) {
         // Implementación...
         return arg1 + arg2;
     }

* A partir de *ES2015*, la **función flecha**::

   (arg1, arg2) => {
      // Implementación...
      return arg1 + arg2;
   }

 En caso de que la función conste de una única sentencia podemos simplificar la
 construcción eliminado las llaves y la sentencia :code:`return`::

   (arg1, arg2) => arg1 + arg2

.. note:: Si se quiere devolver un objeto, entonces es forzoso encerrarlo entre
   paréntesis para evitar ambigüedad::

      (name), desc) => ({name: name, decription: desc})

 Las funciones flecha no expresan el nombre, pero podemos asignarlas a un
 identificador (como por otro lado también puede hacerse con las funciones
 anónimas en sintaxis tradicional)::

   // Función flecha asociada a un identificador.
   var suma = (arg1, arg2) => arg1 + arg2;

   // Una forma más enrevesada de definir la primera función:

   var suma = function(arg1, arg2) {
      return arg1 + arg2;
   }

Las funciones flecha no son simple `azucar sintáctico
<https://es.wikipedia.org/wiki/Az%C3%BAcar_sint%C3%A1ctico>`_, sino que hay
diferencia capital con respecto a las funciones tradicional: no crean un
contexto de ejecución propio, sino que heredan el contexto externo. Por
ejemplo::

   function uno(a, b) {
      const [args, that] = [arguments, this]

      var dos1 = function(x) {
         console.log("Tradicional", this === that, arguments === args);
      }
      var dos2 = (x) => console.log("Flecha", this === that, arguments === args);

      dos1(b);  // Tradicional, false, false
      dos2(b);  // Flecha, true, true
   }

   uno.call({desc: "Soy el contexto"}, 1, 2);


Si ejecutamos el ejemplo, la función tradicional generará un nuevo contexto
(:code:`this` distinto y argumentos propios), mientras que la función flecha no
lo hace.

Argumentos
==========
Los argumentos de las funciones son posicionales, pero con algunas
características especiales:

* *Javascript* no es estricto con el número de parámetros proporcionados. Si se
  pasan más de los que se definieron, no se producirá ningún fallo::

   const sum = (a, b) => a + b;
   sum(1, 2);       // Devuelve 3.
   suma(1, 2, 10);  // Sobra el 10, pero sigue devolviendo 3.

* Si se pasan menos parámetros de los declarados, los parámetros restantes
  tomarán el valor ``undefined``.

* Desde *ES2015* pueden definirse valores predeterminados::

   const sum = (a = 10, b = 100) => a+b;
   sum(20);               // 100 + 20 = 120.
   suma(undefined, 200);  // 200 + 10 = 210.
   suma();                // 100 + 10 = 110.

 Antes, no obstante, era también bastante sencillo de implementar::

   function suma(a, b) {
      if(a === undefined) a = 10;
      if(b === undefined) b = 100;

      return a + b;
   }

* Las funciones disponen de un pseudo-array denominado arguments_ que contiene
  el valor de cada uno de los argumentos::

   function sum(a, b) {
      console.log(arguments[0]) // valor de a.
      console.log(arguments[1]) // valor de b.
      return a + b;
   }

  :code:`arguments` no es un array propiamente dicho y sólo permite recorrerlo,
  acceder por posición a sus elementos y consultar su longitud con ``length``.
  En modo no estricto, dispone además de un atributo ``callee`` que refiere la
  propia función::

   function sum(a, b) {
      console.log(sum === arguments.callee);  // true.
      return a + b;
   }

* A partir de *ES2015*, es posible también definir funciones con una cantidad
  fija de argumentos nominados, y otra variable::

   function foobar(a, b, ...rest) {
      console.log(a);      // 1
      console.log(b);      // 2
      console.log(rest);   // [3. 4]
   }

   foobar(1, 2, 3, 4);

Contexto
========

.. todo:: Tratar el contexto, y cómo cambiarlo mediante .call y .apply.

.. _object-model:

Modelo de objetos
*****************


.. rubric:: Notas al pie

.. [#] En modo estricto, se produce un error.

.. [#] Ya veremos que en un navegador el objeto global es *window*, de ahí la
   equivalencia.

.. _NodeJS: https://nodejs.org
.. _with: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with
.. _arguments: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
