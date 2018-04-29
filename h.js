const {h} = require('ultradom')

module.exports = (name, attributes, ...children) => {
  return typeof name === 'function'
    ? name(attributes, children)
    : h(name, attributes, children)
}
