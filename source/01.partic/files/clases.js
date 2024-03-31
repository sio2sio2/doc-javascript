class Rectangulo {

   static dimensiones = 2;

   constructor() {
      this.inicializar(...arguments);
   }

   inicializar(altura, anchura) {
      this.altura = altura;
      this.anchura = anchura;
   }

   get area() {
      return this.altura * this.anchura;
   }

   get perimetro() {
      return 2*(this.altura + this.anchura);
   }
}

const rec1 = new Rectangulo(5, 7),
      rec2 = new Rectangulo(2, 5);

class Cuadrado extends Rectangulo {

   inicializar(lado) {
      this.lado = lado;
   }

   get anchura() {
      return this.lado;
   }

   get altura() {
      return this.lado;
   }

   /* Sobreescribimos a modo de ejemplo */
   get area() {
      console.log(`Estoy calculando el área para ${this.constructor.name}`);
      return super.area;
   }
}

const cua1 = new Cuadrado(10),
      cua2 = new Cuadrado(5);
