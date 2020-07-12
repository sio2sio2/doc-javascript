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
aunque pronto fue adoptado e implementado *a su manera* (recibiendo el nombre de
*JSScript*) en su competidor `Internet Explorer
<https://es.wikipedia.org/wiki/Internet_Explorer>`_, con lo que surgieron toda
una de incompatibilidades que lastraban el desarrollo de la web.

En 1997, *Netscape* remitió a la *ECMA* el lenguaje para su estandarización y
surgieron las distintas versiones del estándar *ECMAScript* (abreviado *ES* o
*ES-262*, en donde el número hace referencia a que es la norma *ECMA* 262 la que
recoge las especificaciones):

* **ES1** (1997), **ES2** (1998), **ES3** (1999) y la nunca publicada versión 4, que
  podemos agrupar juntas y son las versiones arcaicas del lenguaje.

* **ES5** surgida en 2009.

* **ES2015** (también conocida como *Javascript* v6) de 2015. La decisión de
  sustituir el número de versión por el año de lanzamiento se debió a que *ECMA*
  decidió editar nuevas versiones en los meses de junio de cada año. y así ha
  seguido siendo. Esta versión incorporó bastantes novedades respecto a la
  anterior.

* **ES2016**, **ES2017**, etc. que son las versiones anuales posteriores. A fecha de
  redacción de este documento la última versión publicada es la *ES2019* (o
  *Javascript* v10).

.. note:: A pesar del cambio de denominación es frecuente que algunos sigan
   refiriendo las revisiones con su número de versión.

Modo estricto
=============
En *ES5* se introdujo un modo estricto para el lenguaje que, simplemente, le
indica al intérprete que sea menos permisivo al interpretarlo. Se puede
interpretar *en modo estricto* todo un fichero entero o sólo una función
particular. Para ello, la primera línea del fichero o la función debe contener
esta cadena::

   "use strict";

El efecto de utilizar el modo estricto es que el intérprete falla al encontrarse
con código que, por lo general, se debe a errores de digitalización o tienen
efectos secundarios indeseados. Por ejemplo, en modo estricto no puede usarse
una variable si previamente no se ha declarado explícitamente.

.. note:: Es importante tener presente que la especificación de *ES2015*
   prescribe que los módulos se interpreten siempre en modo estricto, aunque no
   se haya indicado explícitamente.

Bucles :code:`for`
==================
*Javascript* dispone de dos tipos de bucles iterativos:

* El ``for`` con sintaxis de **C** que permite recorrer secuencias a través de
  los ínjdices de sus componentes::

   arr = ["a", "b", "c"];
   str = "abc";

   for(let i=0; i < arr.length; i++) console.log(arr[i]);
   for(let i=0; i < str.length; i++) console.log(str[i]);

* Un bucle de tipo *forach* que tiene dos variantes:

  - Si se usa ``in`` se recorren a lps nombres de las propiedades
    :ref:`enumerables <object-descriptors>` de cualquier objeto::

      for(const idx of arr) {
         console.log(idx);  // Imprime sucesivamente "0", "1", "2"
      }

  - A partir de *ES2015*, si se usa ``of`` se recorren los valores de las
    propiedades enumerables de cualquier objeto::

      for(const e of arr) {
         console.log(e);  // Imprime sucesivamente "a", "b", "c"
      }

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

Tipos
=====
*Javascript* define los siguientes tipos:

* Tipos primitivos:

  * Lógico (``true`` o ``false``).
  * Cadena.
  * Numérico (número en coma flotante de doble precisión). No hay soporte nativo
    para enteroes.
  * Nulo (``null``).
  * Indefinido, sin valor (``undefined``).
  * Símbolo: es un tipo que sirve para definir valores únicos. Puede usarse como
    como clave para las propiedades de los objetos::

      const s = Symbol();
      const objeto = {};
      objeto[s] = "La clave es un símbolo";

* Objetos:

  * `Array
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array>`_::

      const arr = [1, 2, 3];

  * `Fecha
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date>`_::

      const ahora = new Date();

  * `Funciones
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function>`_.

  * Objetos equivalentes a los datos primitivos (como en *Java*)::

      const s = new String("abc");
      const n = new Number(12);
      const b = new Boolean(true);

  * Objetos en general::

      const o = {};

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
- Un objeto this_.

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

Objeto this_
============
Cada contexto de ejecución tiene asociado un objeto this_. Es importante tener
presente que el significado de this_ en *Javascript* es mucho amplio del que
tiene comúnmente en lenguajes orientados a objetos como *Java* o *Python*
(aunque en este se pueda llamar de cualquier manera). En estos lenguajes, this_
representa al objeto mismo dentro de sus propios métodos. Por eso, en *Python*
podemos escribir:

.. code-block:: python

   class Rectangulo:

      def __init__(self, x, y):
         self.width = x
         self.height = y

      def area(self):
         return self.width*self.height;

En *Javascript*, tiene este significado (que se tratará al tratar el
:ref:`modelo de objetos <object-model>`), pero no exclusivamente, ya que
cualquier contexto de ejecución tiene definido un objeto this_.

En el contexto global, el valor de this_ es:

- El objeto global (o sea, *window*) en los navegadores. Además, los contextos
  globales de todos los ficheros de código son exactamente el mismo.

- En NodeJS_. en cambio, cada fichero tiene un contexto diferente y el valor de
  this_ coincide con el objeto de importación (en caso de que se use
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

La discusión sobre el valor de this_ dentro de las funciones, la incluiremos
bajo el próximo epígrafe.

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

      (name), desc) => ({name: name, description: desc})

Las funciones flecha no expresan el nombre, pero podemos asignarlas a un
identificador (como por otro lado también puede hacerse con las funciones
anónimas en sintaxis tradicional)::

  // Función flecha asociada a un identificador.
  var suma = (arg1, arg2) => arg1 + arg2;

  // Una forma más enrevesada de definir la primera función:
  var suma = function(arg1, arg2) {
     return arg1 + arg2;
  }

Las funciones flecha no son simple `azúcar sintáctico
<https://es.wikipedia.org/wiki/Az%C3%BAcar_sint%C3%A1ctico>`_, sino que hay
una diferencia capital entre ellas y las funciones tradicionales: no crean un
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


Si ejecutamos el ejemplo, la función tradicional *dos1* generará un nuevo
contexto (this_ distinto y argumentos propios), mientras que la función flecha
*dos2* no lo hace.

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

this_ predeterninado
--------------------

El objeto this_ del contexto ejecución que crea cada función depende de
múltiples factores:

- En las *funciones flecha* se conserva el del entorno externo.
- En funciones independendientes::

   function foobar() {
      console.log(this);  // Objeto global o undefined.
   }

  depende del modo: en modo estricto queda indefnido (``undefined``), mientras
  que en otro caso, es el objetp global.

- En métodos de un objeto, representa al propio objeto::

   const objeto = {a: 1, b: 2, c: 3};

   objeto.foobar = function() {
      console.log(this.a);
   }

   objecto.foobar();  // Imprime 1.

   // Pero:

   foobar2 = objeto.foobar;

   foobar2();  // Imprime undefined en modo estricto (error en otro caso).

  .. note:: Una función también podemos considerarla un objeto:

     .. code-block:: js

        function ABC() {}
        ABC.a = 1;

        ABC.foobar = function() {
           console.log(this.a);
        }

        ABC.foobar();  // Imprime 1.
   
- Y aunque se entenderá al tratar el :ref:`modelo de objetos <object-model>`,
  dentro de las funciones constructoras y en los métodos del prototipo de dicho
  constructor, this_ representa al propio objeto::

   // Constructor
   function Foobar(a) {
      this.a = a;
   }

   Foobar.prototype.metodo = functioN() {
      console.log(this.a);
   }

   const objeto = new Foobar(1);  // Se asigna 1 a objeto.a;
   objeto.metodo();               // Imprime 1.

Manipulación de this_
---------------------
Aunque lo establecido bajo el epígrafe anterior son los valores que adquiere
this_ dependendiendo de cómo se haya definido la función, es posible alterar
dinámicamente el contexto a través de diversas herramientas. Para ilustrarlas
tomemos de ejemplo la función::

   function foobar(x, y) {
      console.log("this". this);
      console.log(x, "--", y);
   }

`.bind()`_
   Permite crear una nueva función en que se definen de antemano el objeto this_
   y todos los argumentos que se le proporcionen::

      const barfoo = foobar.bind({}, 1);  // Proporcionamos this y el primer argumento.
      barfoo(2);                          // this= {}; x= 1; y= 2.

   .. note::  ``.bind()`` puede cumplir la función que hace `partial
      <https://docs.python.org/3.7/library/functools.html#partial-objects>`_ en
      *Python*, aunque tiene el efecto añadido de modificar el objeto
      this_. Para una solución que no lo modifique puede usarse el
      siguiente código::

         const partial = (func, ...args) => (...rest) => func(..args, ...rest);

`.call()`_
   Ejecuta la función permitiendo modificar el objeto this_, que pasa a
   ser el primer argumento::

      foobar.call({}, 1 2):  // this= {}; x= 1; y= 2.

`.apply()`_
   Actúa como ``.call()`` modificando el objeto this_, pero pasa el resto
   de argumentos en forma de *array*::

      foobar.apply({}, [1, 2]);  // this= {}; x= 1; y= 2.

.. note:: Las definiciones hechas con :code:`.bind()` provocan que quede anulado
   el efecto de ``.call()`` y ``.apply()``.

.. _object-model:

Modelo de objetos
*****************
En *Javascript* no existen clases\ [#]_, de modo que los objetos no se crean
mediante la instanciación de clases. Los objetos, en cambio, se crean usando
otro objeto ya existente como prototipo, de manera que el nuevo objeto posee las
características de su prototipo y añade otras nuevas que podamos conferirle. El
prototipo a su vez tendrá su propio prototipo, y así sucesivamente hasta llegar
a un último objeto básico cuyo prototipo es :code:`null`. De este modo, para
acceder al atributo o método de un objeto se consulta si éste está definido en
el propio objeto, si no lo esa, se consulta en su prototipo; si no, en el
prototipo del prototipo y así sucesivamente. A esto es a lo que se llama
:dfn:`cadena de prototipos`.

.. image:: files/cadena_proto.png

.. note:: La cadena de prototipos tiene un prototipo final que se
   caracteriza porque su prototipo es *null*.

Conceptos básicos
=================
Creación
--------
Hay cuatro mecanismos distintos para la creación de objetos:

Directa
"""""""
La forma más directa y sencilla de crear un objeto es declararlo
explícitamente::

   var obj = {};

En este caso, el prototipo de *obj* (que podemos averiguar a través del método
`Object.getPrototypeOf`_), es el último objeto posible de la *cadena de
prototipos*, o sea, ese objeto cuyo prototipo, a su vez, es :code:`null`::

   var prototipo_obj = Object.getPrototypeOf(obj);  // Es "o" en el gráfico.
   Object.getPrototypeOf(prototipo_obj);  // Devuelve null

Otra forma de obtener el prototipo de un objeto es a través del atributo
estándar a partir de *ES2015* `__proto__`_ (aunque aun así se desaconseja)::

   obj.__proto__.__proto__ === null;  // Es true.

.. warning:: Aunque `__proto__`_ no es atributo de sólo lectura y existe el método
   `Object.setPrototypeOf`_, alterar la cadena de prototipos afecta dramáticamente
   al rendimiento de la aplicación.

Por prototipo
"""""""""""""
Otra forma de crear un objeto es definirlo a partir de otro que actúe como su
prototipo::

   var p = Object.create(obj);

De este modo, obtenemos un objeto *p* cuyo prototipo es *obj*::

   p.__proto__ === obj  // Es true.

.. _object-const:

Por constructor
"""""""""""""""
Un último método para crear un objeto es definir una función constructora::

   function MiObjeto(value) {
      this.value = value;
   }

   var q = new MiObjeto(5);
   console.log(q.value);   // Imprime 5.

Si al invocar la función se usa el operador `new
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new>`_,
éste hace que el objeto this_ de la función represente el propio objeto que se
pretende crear y que se devuelva tal objeto. 

En este caso, el prototipo del nuevo objeto es la propiedad `prototype
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype>`_
de la función constructora::

   q.__proto__ === MiObjeto.prototype     // true

De hecho, existe la función constructura `Object
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object>`_,
y la forma explícita que usamos para crear un objeto vacío es equivalente a::

   var o = new Object();

por tanto::

   o.__proto__ === Object.prototype

y::

   Object.prototype.__proto___ === null

Además, el prototipo del atributo *prototype* de cualquier función es el
prototipo de ``Object``::

   MiObjeto.prototype.__proto__ === Object.prototype

Por otro lado, el atributo *prototype* de la función constructora tiene un
atributo `constructor
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor>`_,
que es la propia función constructora::

   MiObjeto.prototype.constructor === MiObjecto

Por pseudo-clase
""""""""""""""""
A partir de *ES2015*, se introdujo un mecanismo para crear objetos a
partir de clases que, en realidad. no son tales::

   class Persona {
      constructor(nombre, nacimiento, sexo) {
         this.nombre = nombre;
         this.nacimiento = nacimiento;
         this.sexo = sexo;
         this.defuncion = null;
      }

      // Definiciones de métodos y atributos que se tratarán más adelante.
   }

   var pepe = new Persona("Pepe", "1980-11-09", "V");

Este código sí resulta familiar a un programador versado en la programación
orientada a objetos basada en clases. Sin embargo, esta sintaxis sólo es
`azúcar sintáctico`_ ya que la orientación a objetos sigue siendo basada en
prototipos. De hecho, si tras la definición probamos a consultar qué es
``Persona``::

   typeof Persona  // function

obtendremos que la supuesta clase es en realidad una mera función constructora.

.. _object-model-attr:

Atributos
---------
Para **definir** atributos basta con *enchufárselos* al objeto::

   var o = {};       // El objeto está vacio.
   o.value = 5;
   o["value"] = 10;  // Alternativa.
   o.getValue = function() { return this.value; };  // Es un método.

.. note:: La *notación de array* es muy útil cuando el nombre del atributo
   se encuentra en una variable::

      var attr = "value";
      console.log(o[attr]);  // 10.

Por supuesto, es posible añadir atributos en el momento de la creación del
objeto::

   var o = {
      value: 10,
      getValue: function() {
         return this.value;
      }
   }

Como consecuencia de la :ref:`cadena de prototipos <object-model>`, cualquier
método o atributo que se encuentre enchufado a uno de los prototipos y que no
haya sido sobrescrito, es accesible también::

   var p = Object.create(o);
   console.log<p.x);  // 10.

Recuérdese que cuando :ref:`se construye un objeto a partir de una función
constructora <object-const>`, el prototipo del objeto coincide con el atributo
*prototype* de la función, por lo que cualquier atributo que se enchufe a él
será accesible por el objeto::

   function MiObjeto(value) {
      this.value = value;
   }
   MiObjeto.prototype.x = 100;

   var q = new MiObjeto(5);
   console.log(q.x);  // 100:

Volveremos más adelante sobre este concepto al explicar :ref:`cómo construir de
forma sistemática objetos que representen instancias de un mismo tipo
<javascript-clases>` (o sea, lo que en la orientación a objetos basada en
clases. llamaríamos instancias de una misma clase)

Dado que desde un objeto son accesibles tanto los atributos propios como los
atributos de cualquiera de los prototipos de la cadena, es conveniente saber
cómo distinguir si son propios o heredados:

.. warning:: Al tratar los :ref:`descriptores <object-descriptors>` explicaremos
   el concepto de *propiedad enumerable*.

`Object.keys()`_
   Devuelve un array con los nombres de los **atributos propios
   enumerables** del objeto::

      var o = {x: 1};
      var p = Object.create(o);
      p.y = 2;
      console.log(Object.keys(p));  // [ 'y' ]

   Son semejantes, `Object.values()`_, que devuelve los valores en vez de los
   nombres y `Object.entries()`_, que devuelve tuplas nombre-valor.

`Object.getOwnPropertyNames()`_
   Devuelve un array con los nombres de **todos los atributos propios** del
   objeto (sean o no enumerables).

`.hasOwnProperty(name)`_
   Deuelve :code:`true` sólo en caso de que el atributo suministrado sea propio
   del objeto::

      p.hasOwnProperty("y");           // true.
      p.hasOwnProperty("x");           // false.
      p.hasOwnProperty("no_existo");  // false.

`for ... in`_
   Itera sobre **todos los atributos enumerables** del objeto, incluidos los
   heredados::

      for(const name in p) {
         console.log(name);  // Dos iteraciones, una "x" y otra "y".
      }

Métodos
-------
Al ser las funciones en *Javascript* ciudadanas de primera clase, podemos
considerar los métodos como atributos cuya valor es una función. Es, por tanto,
aplicable todo lo indicado bajo el epígrafe dedicado a los :ref:`atributos
<object-model-attr>`, con lo cual sólo es necesario aclarar la naturaleza del
contexto (el objeto this_) en los métodos: this_ representa el objeto al que
pertenece el método::

   var o = {x: 1};
   o.getX = function() {
      return this.x;       // this es "o".
   }

En caso de que se use no un método propio del objeto, sino un método definido en
algún objeto intermedio de la cadena de prototipos, this_ representa igualmente
al objeto::

   var p = Object.create(o);
   p.x = 2;
   p.getX();   // Devuelve 2, ya que this es "p".

.. _object-descriptors:

Descriptores
------------
Hasta ahora, nos hemos limitado a añadir atributos a los objetos sin excesivo
cuidado::

   var o = {x: 1};
   o.y = 2;

esto es, sin preocuparnos de su visibilidad o la posibilidad de modificar su
valor. Si consultamos mediante `Object.getOwNPropertyDescriptor()`_ las
características de cualquiera de los dos atributos, obtendremos lo siguiente::

   Object.getOwnPropertyDescriptor(o, "x");
   { value: 1, writable: true, enumerable: true, configurable: true }

esto es, el valor del atributo y tres características:

* **writable**, que determina si el atributo puede modificar su valor.
* **enumerable**, que determina que el atributo debe listarse al iterar mediante
  el bucle `for ... in`_ o al usar `Object.keys()`_, `Object.values()`_ o
  `Object.entries()`_.
* **configurable**, que determina si se pueden modificar estas mismas
  características.

.. _object-data-descriptor:

**Descriptor de datos**
   Al objeto que describe el valor y las caracteríscas del atributo se le denomina
   :dfn:`descriptor de datos` y puede definirse mediante varias vías:

   `Object.defineProperty()`_
      Permite definir o redefinir el descriptor de un atributo::

         // Redefimos la característica enumerable del atributo "x"
         Object.defineProperty(o, "x", {enumerable: false});

         // Definimos un nuevo atributo declarando, además, su descriptor
         Object.defineProperty(o, "z", {
            value: 3,
            enumerable: false,
            writable: true,
            configurable: false
         });

      No es necesario indicar todas las características: se redefinirán sólo
      las que proporcionemos y en el primer caso se conservarán los valores
      preexistentes y en el segundo se establecerán a su valor predeterminado::

         Object.defineProperty(o, "w", {});
         {value: undefined, writable: false, enumerable: false, configurable: false}
         
   `Object.defineProperties()`_
      Como el anterior, pero permite [re]definir varios atributos a la vez::

         Object.defineProperties(o, {
            x: {enumerable: true, configurable: false},  // Redefinición.
            xx: {writable: false, value: 4}              // Atributo nuevo.
         });

   `Object.create()`_
      A la vez que crea un objeto a partir de un prototipo, Con su segundo argumento
      permite definir atributos facilitando sus descriptores de acceso. Este
      segundo argumento, tiene la misma sintaxis que el segundo de
      `Object.defineProperties()`_::

         var p = Object.create({x: 1}, {
            y: {value: 4, enumerable: true},
            z: {writable: true}
         });

      En este caso, *x* es un atributo heredado del prototipo e *y* y *z* atributos
      propios del objeto con las características reseñadas.

**Descriptor de acceso**
   Hay una variante de los descriptores denominada :dfn:`descriptor de acceso` en
   que en vez de facilitar el valor (*value*) y la escribibilidad (*writable*)
   se facilitan un *getter* o un *setter* o ambos, que permiten controlar qué valor
   devuelve el atributo y cómo se le asigna valor::

      Object.defineProperty(p, "temperatura", {
         get: function() {  // this es "p"
            return this._temperatura;
         },
         set: function(value) { // this es "p"
            if(value < 0) console.error("Temperatura en Kelvin");
            this._temperatura = value;
         },
         enumerable: true
      });
      Object.defineProperty(this, "_temperatura", {writable: true});

      p.temperatura = 300;
      console.log(p.temperatura);  // 300.

      p.temperatura = -10;  // Error.

   En el ejemplo, almacenamos el valor en la variable escondida
   *_temperatura* y, gracias al *setter*, controlamos que no se pueda asignar un
   valor negativo.

   Se puede usar una sintaxis alternativa a la anterior::

      Object.defineProperty(p, "temperatura", {
         get() {  // this es "p"
            return this._temperatura;
         },
         set(value) { // this es "p"
            if(value < 0) console.error("Temperatura en Kelvin");
            this._temperatura = value;
         },
         enumerable: true
      });
      Object.defineProperty(this, "_temperatura", {writable: true});

   Por otro lado, podemos definir directamente descriptores de acceso
   cuando creamos un objeto::

      var o = {
         x: 1,
         get temperatura() {
            return this._temperatura;
         },
         set temperatura(value) {
            if(value < 0) console.error("Temperatura en Kelvin");
            this._temperatura = value;
         }
      }
      Object.defineProperty(this, "_temperatura", {writable: true});

   .. warning:: En este último caso, los valores de *configurable* y
      *enumerable* del atributo *temperatura* son :code:`true`, esto es, los
      mismos que para u8n atributo como *x* del que no se especifica el
      descriptor de datos.

.. _javascript-clases:

Plantillas (o sea, clases)
==========================
Si queremos lograr un código limpio y ordenado y que cumpla con los principios
de encapsulación o ocultación típicos de la programación orientada a objetos, no
es una buena práctica construir de cualquier forma objetos que modelen un mismo
tipo de entidad. Hay, fundamentamente, dos estrategias:

- Usar el :ref:`patrón del módulo <js-module-pattern>` y una función constructora,
  que es el enfoque más próximo al modelo de *Javascript*.
- Utilizar el azúcar sintáctico introducido en *ES2015* y pseudo-definir clases.

Para ilustrar ambos métodos definiremos objetos que representen personas y
utilizaremos estos como base para la definición de personas menores.

Mediante constructor
--------------------
.. literalinclude:: files/persona_constructor.js
   :language: js

Y para construir objetos que modelen menores de edad y hereden de estos:

.. literalinclude:: files/menor_constructor.js
   :language: js

Mediante :code:`class`
----------------------
La sintaxis para crear pseudo-clases es bastante simple y no permite yodas las
posibilidades que brinda tratar directamente con el constructor. Una definición
lo más equivalentemente posible a la anterior es esta:

.. literalinclude:: files/persona_class.js
   :language: js

Las principales diferencias, como consecuencia de las limitaciones, son:

- :code:`_nacimiento`, etc. son atributos enumerables y, aunque se podrían haber
  evitado, esto habría implicado usar `Object.defineProperty()`_, que es algo que
  queremos evitar para no enmarañar la claridad de la nueva sintaxis. Lo
  deseable es que hubiera un modo de hacer privados tales atributos.

- La variable privada :code:`sexo` se ha tenido que implementar como un *getter*
  estático que es público.

- :code:`check_fecha` se ha implementado como un método estático público, porque
  no hay modo de hacerlo privado.

.. seealso:: Hay ya propuestas para añadir al estándar la posibilidad de
   controlar la visibilidad o permitir dentro de la propia clase la definición
   de atributos estáticos. Consulte, `el repositorio de Github
   <https://github.com/tc39/proposal-class-fields>`_ o `este artículo de
   sitepoint.com <https://www.sitepoint.com/javascript-private-class-fields/>`_.

Extender esta clase para construir una que modele a un menor de edad es
sencillo:

.. literalinclude:: files/menor_class.js
   :language: js

Características
===============
Si echamos un vistazo a algún manual que trate la programación orientada a
objetos, se nos informará de que tal programación se caracteriza por:

* La *abstracción*, esto es, que únicamente se modelan las caracteristicas y los
  comportamientos relevantes para la resolución del problema.
* El *encapsulamiento*, esto es, que se modela dentro del objeto todo el
  comportamiento y las características de la entidad.
* La *ocultación*, o sea, los objetos se comportan como cajas negras de suerte
  que al exterior sólo se ofrece una |API| que permite interactuar con el
  objeto, mientras que su implementación resulta irrelevante para el resto del
  código.
* La *herencia*, que establece una jerarquía de objetos en la que unos objetos
  heredan comportamientos y características de otros.

Si aplicamos estas características al modelo de objetos de *Javascript* nos
encontramos con:

Abstracción
-----------
Restringiendo la discusión sobre abstracción a interfaces y clases abstractas,
*Javascript* no habilita ningún mecanismo para ellas, lo cual es lógico puesto
que se basa en el uso de prototipos. Si se quiere, no obstante, obligar de
alguna manera a que el prototipo de un objeto implemente una interfaz, podemos
improvisar un módulo como :download:`interface.js <files/interface.js>`:

.. code-block:: js
   :emphasize-lines: 15

   const doInterface = require("./interface.js");

   // Los objetos deben implementar una interfaz
   // con el atributo "value" y los métodos "incr()" y "decr()".
   const IncrDecr = doInterface(["incr()", "decr()", "value"]);

   const Foobar = (function() {

      function Foobar(value) {
         Object.defineProperty(this, "_value", {value: value, enumerable: false});
      }

      // Podemos añadir a Foobar.prototype métodos y atributos,

      return IncrDecr.implementedBy(Foobar, {
         // Implementación de la interfaz.
         get value() { return this._value },
         incr() { return ++this._value },
         decr() { return --this._value },

         // Podemos añadir cualesquiera otros atributos y métodos
         // que queremos que formen parte de Foobar.prototype

      });
   })();

   const f = new Foobar(5);
   console.log(f.__interface__ === IncrDecr.id);  // true

Encapsulamiento
---------------
Para encapsular adecuadamente el comportamiento de un tipo de objetos lo más
conveniente es crearlos bien a través de la sintaxis de pseudo-clases bien a
través de la definición de una función constructora a cuyo atributo *prototype*
se añaden los atributos y métodos comunes a todos los objetos del tipo.

Ocultación
----------
Para controlar la visibilidad del código tenemos dos estategias:

- Tradicionalmente, se ha logrado aplicando el :ref:`patrón del módulo
  <js-module-pattern>`, de manera que sólo se exporte la función constructora,
  y jugando con la *enumerabilidad* de los atributos y métodos.

- En caso de que se programe con modulos, puede implementarse el comportamiento
  de un mismop tipo de objetos dentro de un fichero con lo que se logrará el
  mismo efecto que usando el *patrón del módulo*.

Herencia
--------
La *cadena de prototipos* es en sí misma una implementación del mecanismo de la
herencia: un objeto hereda de su prototipo.

Programación asínscrona
***********************

.. Explica con un ejemplo el infierno de los callbacks.
   https://dev.to/siwalikm/async-programming-basics-every-js-developer-should-know-in-2018-a9c
   
.. Otra buena explicación de Promise/async:
   https://medium.com/jspoint/javascript-promises-and-async-await-as-fast-as-possible-d7c8c8ff0abc


Enlaces de interés
******************
* `JavaScript Arrow Functions: How, Why, When (and WHEN NOT) to Use Them
  <https://zendev.com/2018/10/01/javascript-arrow-functions-how-why-when.html>`_.
* `Understanding Scope and Context in JavaScript
  <http://ryanmorr.com/understanding-scope-and-context-in-javascript/>`_.
* `Let's Learn JavaScript Closures
  <https://www.freecodecamp.org/news/lets-learn-javascript-closures-66feb44f6a44/>`_.
* `Lexical Environment — The hidden part to understand Closures
  <https://medium.com/@5066aman/lexical-environment-the-hidden-part-to-understand-closures-71d60efac0e0>`_.
* `https://dev.venntro.com/2013/09/es6-part-2/ <https://dev.venntro.com/2013/09/es6-part-2/>`_.

.. rubric:: Notas al pie

.. [#] En modo estricto, se produce un error.

.. [#] Ya veremos que en un navegador el objeto global es *window*, de ahí la
   equivalencia.

.. [#] No, no existen, ni siquiera a partir de *ES2015* donde aparece una
   sintaxis para *definir* clases. Abundaremos más adelante en esta aparente
   paradoja.

.. _NodeJS: https://nodejs.org
.. _with: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with
.. _arguments: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
.. _.bind(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
.. _.call(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
.. _.apply(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
.. _Object.create(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
.. _Object.keys(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
.. _Object.defineProperty(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
.. _Object.defineProperties(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
.. _Object.values(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values
.. _Object.getOwnPropertyNames(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
.. _Object.getOwnPropertyDescriptor(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
.. _Object.entries(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
.. _Object.getPrototypeOf: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
.. _Object.setPrototypeOf: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
.. _.hasOwnProperty(name): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
.. _for ... in: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
.. _`__proto__`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto
.. _this: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this

.. |API| replace:: :abbr:`API (Application Programming Interface)`
