module.exports = (...fns) => (...x) => (fns.reduceRight((next, fn) => (...y) => fn.apply(null, next ? [...y, next] : y))).apply(null, x)
