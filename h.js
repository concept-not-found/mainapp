const {h} = require('ultradom')

module.exports = (name, attributes, ...children) => typeof name === 'function'
  ? name(attributes, children)
  : h(name, attributes, children)
