/**
 * for each of the method names specified in "methods"
 * create a function in "target" object with that method name and that function
 * should invoke the same functions in each of the source objects specified in "sources"
 * @param methods {[string]} - An array of method names.
 * @param target {Object} - The target object where new functions will be added.
 * @param sources {[Object]} - An array of source objectes to get the base functions.
 */
function proxyFn(methods, target, sources){
  methods.forEach((method) => {
    target[method] = (...args) => {
      sources.forEach((source) => {
        source[method].apply(source,args);
      });
    };
  });
}

module.exports = proxyFn;
