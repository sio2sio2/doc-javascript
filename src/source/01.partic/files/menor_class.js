class Menor extends Persona {
   constructor(nombre, nacimiento, sexo, tutor) {
      super(nombre, nacimineto, sexo);
      this.tutor = tutor;
   }

   set nacimiento(value) {
      const actual = this._nacimineto;

      super(value);
      if(this.esMayor()) {
         this._nacimiento = actual;
         throw new Error("La persona no es menor de edad");
      }
   }
}
