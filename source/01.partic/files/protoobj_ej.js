// Obtiene los descriptores de todas los atributos enumerables de un objeto
function attrs2descr(obj) {
   return Object.fromEntries(Object.keys(obj || {}).map(e => [e, Object.getOwnPropertyDescriptor(obj || {}, e)]));
}

const base = {
   /* Genera un objeto a partir del prototipo */
   crear() {
      const self = Object.create(this);
      if(typeof self?.inicializar === "function") self.inicializar(...arguments);
      return self;
   },

   /* Genera un nuevo prototipo extendiendo éste */
   extender(attrs, props) {
      return Object.create(this, Object.assign(attrs2descr(attrs), props));
   },

   /* Añade o modifica atributos al propio prototipo */
   incluir(attrs, props) {
      return Object.defineProperties(this, Object.assign(attrs2descr(attrs), props));
   }
}

const rectangulo = base.extender({
   inicializar(anchura, altura) {
      this.anchura = anchura;
      this.altura = altura;
   },

   dimension: 2,

   get area() {
      return this.anchura * this.altura;
   },

   get perimetro() {
      return 2*(this.anchura + this.altura);
   },

   escalar(factor) {
      this.anchura *= factor;
      this.altura *= factor;
      return this;
   }
});

const rec1 = cuadrado.crear(5, 7),
      rec2 = cuadrado.crear(2, 5);

const cuadrado = rectangulo.extender({
   inicializar(lado) {
      this.lado = lado;
   },

   get anchura() {
      return this.lado;
   },

   get altura() {
      return this.lado;
   }
});

const cua1 = cuadrado.crear(10),
      cua2 = cuadrado.crear(5);
