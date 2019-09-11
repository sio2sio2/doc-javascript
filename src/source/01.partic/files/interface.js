/**
 * Integra el o2 en o1 respetando los getters/setters.
 */
function assign(o1, o2) {
   Object.defineProperties(o1,
      Object.getOwnPropertyNames(o2 || {}).reduce((v, name) => {
         v[name] = Object.getOwnPropertyDescriptor(o2, name);
         return v
      }, {})
   );
   return o1;
}

/**
 * Crea una interfaz.
 *
 * @param {Array<String>} interface: Lista de nombres de métodos y atributos
 *    que obliga a definir la interfaz. Si es un método debe hacerse acabar el nombre
 *    con paréntesis. Por ejemplo: [ "value1", "value2", method()" ].
 * @returns {Object} La definición de la interfaz.
 */
function doInterface(interface) {
   return {
      id: Symbol(),
      attrs: interface,
      /**
       * Obliga a que el constructor implemente la interfaz.
       *
       * @param {Function} constr:  Constructor de objetos.
       * @param {Object} attrs: Objeto con la definición de métodos y atributos
       *    que se incorporarán al prototype de la función.
       *
       * @returns {Function}: El propio constructor.
       *
       */
      implementedBy: function(constr, attrs) {
         assign(constr.prototype, attrs);

         // Comprobamos que el prototipo tenga definida toda la interfaz.
         for(let name of this.attrs) {
            if(name.endsWith("()")) {
               name = name.slice(0, -2);
               if(typeof constr.prototype[name] !== "function") {
                  throw new Error(`${constr.name} no implementa la función ${name}`);
               }
            }
            if(!constr.prototype.hasOwnProperty(name)) {
               throw new Error(`${constr.name} no implementa ${name}`);
            }
         }

         Object.defineProperty(constr.prototype, "__interface__", {value: this.id});

         return constr;
      }
   }
}

module.exports = doInterface;
