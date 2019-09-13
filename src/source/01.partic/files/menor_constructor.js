const Menor = (function() {

   // Constructor
   function Menor(nombre, nacimiento, sexo, tutor) {
      Persona.call(this, nombre, nacimiento, sexo);
      this.tutor = tutor;         
   }

   const superProto = Persona.prototype;

   // Implementación de la herencia.
   Menor.prototype = Object.create(superProto);
   Menor.prototype.constructor = Menor;

   // El menor no puede tener más de 17 años,
   // así que redefinimos el setter de nacimiento.
   (function() {
      const superNacimiento = Object.getOwnPropertyDescriptor(superProto, "nacimiento");

      Object.defineProperty(Menor.prototype, "nacimiento", {
         get: superNacimiento.get,
         set: function(value) {
            const actual = this._nacimiento;

            superNacimiento.set.call(this, value);
            if(this.esMayor()) {
               this._nacimiento = actual;
               throw new Error("La persona no es menor de edad");
            }
         },
         enumerable: true
      });
   })();

   // Podemos seguir ampliando la "subclase" con más métodos y atributos.

   return Menor;
})();
