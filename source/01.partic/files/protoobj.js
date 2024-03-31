/* Base para derivar prototipos y crear objetos */
const base = (function() {
   // Obtiene los descriptores de todas los atributos enumerables de un objeto
   function attrs2descr(obj) {
      return Object.fromEntries(Object.keys(obj || {}).map(e => [e, Object.getOwnPropertyDescriptor(obj || {}, e)]));
   }

   return {
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
})();
