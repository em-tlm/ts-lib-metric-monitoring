function proxyFn(methods, target, sources){
  methods.forEach((method) => {
    target[method] = (...args) => {
      sources.forEach((source) => {
        source[method].apply(source,args);
      })
    }
  })
}

module.exports = proxyFn;