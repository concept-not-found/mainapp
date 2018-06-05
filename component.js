const isPlainObject = require('is-plain-object')

async function unmount (state, key) {
  const child = state[key]
  if (isPlainObject(child)) {
    if (child.willUnmount) {
      await child.willUnmount(key)
      delete child.willUnmount
    }
    for (let childKey in child) {
      await unmount(child, childKey)
    }
  }
}
module.exports = (onStateUpdate, mainSpecification) => {
  const $global = {}
  function wireSpecification (specification, state) {
    for (const key in specification) {
      const value = specification[key]
      if (value === undefined) {
        unmount(state, key)
        delete state[key]
      } else if (key === 'view') {
        state[key] = (attributes, children) => value(state, attributes, children)
      } else if (typeof value === 'function') {
        state[key] = async (...parameters) => {
          const update = await value(state, ...parameters)
          if (!update) {
            return
          }
          const parentUpdate = update.$parent
          delete update.$parent
          const globalUpdate = update.$global
          delete update.$global

          wireSpecification(update, state)
          if (parentUpdate && state.$parent) {
            wireSpecification(parentUpdate, state.$parent)
          }
          if (globalUpdate) {
            wireSpecification(globalUpdate, $global)
          }
          onStateUpdate()
        }
      } else if (isPlainObject(value)) {
        if (isPlainObject(state[key])) {
          wireSpecification(value, state[key])
        } else {
          const childState = {}
          Object.defineProperty(childState, '$global', {
            value: $global,
            enumerable: false,
            writeable: false,
            configurable: false
          })
          Object.defineProperty(childState, '$parent', {
            value: state,
            enumerable: false,
            writeable: false,
            configurable: false
          })
          state[key] = wireSpecification(value, childState)
          const child = state[key]
          if (child.didMount) {
            child.didMount(key)
            delete child.didMount
          }
        }
      } else { // data
        state[key] = value
      }
    }
    return state
  }
  return wireSpecification(mainSpecification, $global)
}
