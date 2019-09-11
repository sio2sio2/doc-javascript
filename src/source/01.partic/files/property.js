function addProperty(constructor, name, desc) {
   if(!constructor.prototype) {
      console.error("No se pasa una función constructora");
      return;
   }
   desc = desc || {};
   if(typeof desc.checker !== 'function') desc.checker = function(v) { return true; };
   if(desc.configurable === undefined) desc.configurable = false;
   if(desc.enumerable === undefined) desc.enumerable = true;

   function getter() {
      var n = "_" + this.constructor.name + "__" + name;
      return this[n];
   }

   function setter(v) {
      // Almacena el valor en un atributo "oculto".
      var n = "_" + this.constructor.name + "__" + name;
      if (Object.getOwnPropertyDescriptor(this, n) === undefined) {
         Object.defineProperty(this, n, {
            configurable: false,
            enumerable: false,
            writable: true
         });
      }
      if(desc.checker(v)) this[n] = v;
   }

   Object.defineProperty(constructor.prototype, name, {
      configurable: desc.configurable,
      enumerable: desc.enumerable,
      get: getter,
      set: setter
   });
}

function addProperties(constructor, desc) {
   for(name in desc) addProperty(constructor, name, desc[name]);
};
