class Persona {
   constructor(nombre, nacimiento, sexo) {
      this.nombre = nombre;
      this.nacimiento = nacimiento;
      this.sexo = sexo;
   }

   // Atributo estático de sólo lectura.
   static get sexo() {
      return ["Varón", "Hembra"];
   }

   static check_fecha(value) {
      // Comprobamos si la fecha es correcta y devuelve true/false.
      return true;
   }

   // Getters y setters

   get nacimiento() {
      return this._nacimiento;
   }

   set nacimiento() {
      if(!check_fecha(value)) {
         throw new Error(`${value}: fecha inválida`);
      }
      this._nacimiento = value
   }

   get sexo() {
      return this._sexo;
   }

   set sexo(value) {
      if(sexos.indexOf(value) === -1) {
         throw new Error(`${value}: sexo incorrecto`);
      }
      this._sexo = value;
   }

   get defuncion() {
      return this._defuncion;
   }

   get edad() {
      // Se calcula la edad en años a partir de
      // la fecha de hoy y la fecha de nacimiento.
   }

   // Método público
   matar(value) {
      if(!check_fecha(value)) {
         throw new Error(`${value}: fecha inválida`);
      }
      if(value < this.nacimiento) {
         throw new Error(`Defunción anterior al nacimiento`);
      }
      this._defuncion = value;
   }

}
