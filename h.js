const {h} = require('ultradom')

module.exports = (name, attributes, ...children) => {
  if (typeof name === 'function') {
    return name(attributes, children)
  }
  if (name.view) {
    return name.view(attributes, children)
  }
  return h(name, attributes, children)
}
