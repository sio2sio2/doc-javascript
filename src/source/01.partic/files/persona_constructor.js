const Persona = function() {

   // ATRIBUTO PRIVADO (inacesible desde fuera)
   const sexos = ['Varón', 'Hembra'];

   function Persona(nombre, nacimiento, sexo) {
      initialize.call(this);

      this.nombre = nombre;
      this.nacimiento = nacimiento;
      this.sexo = sexo;
   }


   // MÉTODO PRIVADO (debe invocarse con call)
   function initialize() {
      // No enumerables, para que quede claro
      // al programador que no debería tocarlos jamás.
      Object.defineProperties(this, {
         _nacimiento: {writable: true},
         _sexo: {writable: true},
         _defuncion: {writable: true}
      });
   }

   // MÉTODO ESTÁTICO PRIVADO sin acceso al objeto
   function check_fecha(value) {
      // Comprobamos si la fecha es correcta y devulvemos true/false.
   }


   // ATRIBUTOS PÚBLICOS (algunos definidos mediante getter/setter)
   Object.defineProperties(Persona.prototype, {
      MAYORIA: {
         value: 18,
         enumerable: true
      },
      nacimiento: {
         get() {
            return this._nacimiento;
         },
         set(value) {
            if(!check_fecha(value)) {
               throw new Error(`${value}: fecha inválida`);
            }
            this._nacimiento = value
         },
         enumerable: true
      },
      sexo: {
         get() {
            return this._sexo;
         },
         set(value) {
            if(sexos.indexOf(value) === -1) {
               throw new Error(`${value}: sexo incorrecto`);
            }
            this._sexo = value;
         },
         enumerable: true,
      },
      defuncion: {
         get() {
            return this._defuncion;
         },
         enumerable: true
      },
      edad: {
         get() {
            // Se calcula la edad en años a partir de
            // la fecha de hoy y la fecha de nacimiento.
         },
         enumerable: true
      }
   });


   // MÉTODO PÚBLICOS
   Object.assign(Persona.prototype, {
      matar(value) {
         if(!check_fecha(value)) {
            throw new Error(`${value}: fecha inválida`);
         }
         if(value < this.nacimiento) {
            throw new Error(`Defunción anterior al nacimiento`);
         }
         this._defuncion = value;
      },
      esMayor() {
         return this.edad >= this.mayoria;
      }
   });

   return Persona;
}();

