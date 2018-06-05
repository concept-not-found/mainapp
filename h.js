const {h} = require('ultradom')

module.exports = (name, attributes = {}, ...children) => {
  if (typeof name === 'function') {
    return {
      view: name,
      attributes,
      children
    }
  }
  if (name.view) {
    return {
      view: name.view,
      attributes,
      children
    }
  }
  return h(name, attributes, children)
}
