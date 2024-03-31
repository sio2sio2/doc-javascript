function attrs2descr(obj) {
   return Object.fromEntries(Object.keys(obj || {}).map(e => [e, Object.getOwnPropertyDescriptor(obj || {}, e)]));
}

function Base() {
   if(typeof this.inicializar === "function") this.inicializar(...arguments);
}
Object.assign(Base, {
   extender(attrs, props) {
      const constructor = function() { Base.call(this, ...arguments); }
      constructor.prototype = new this();
      Object.defineProperties(constructor.prototype, Object.assign(attrs2descr(attrs), props));
      constructor.prototype.constructor = constructor;
      Object.assign(constructor, this);
      return constructor
   },

   incluir(attrs, props) {
      Object.defineProperties(this.prototype, Object.assign(attrs2descr(attrs), props));
      return this;
   }
});

const Rectangulo = Base.extender({
   inicializar(altura, anchura) {
      this.altura = altura;
      this.anchura = anchura
   },

   dimension: 2,

   get area() {
      return this.anchura * this.altura;
   },

   get perimetro() {
      return 2*(this.anchura + this.altura); 
   },

   escalar() {
      this.anchura *= factor;
      this.altura *= factor;
      return this;
   }

});

const rec1 = new Rectangulo(5, 7),
      rec2 = new Rectangulo(2, 5);

const Cuadrado = Rectangulo.extender({
   inicializar(lado) {
      this.lado = lado
   },

   get anchura() {
      return this.lado;
   },

   get altura() {
      return this.lado;
   }
});

const cua1 = new Cuadrado(10),
      cua2 = new Cuadrado(5);
