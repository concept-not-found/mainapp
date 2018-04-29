
function wireSpecification (onStateUpdate, specification, state = {}) {
  for (const key in specification) {
    const value = specification[key]
    if (typeof value === 'function') {
      if (key === 'view') {
        state[key] = (attributes, children) => value(state, attributes, children)
      } else { // action
        state[key] = async (...parameters) => {
          const update = await value(state, ...parameters)
          Object.assign(state, wireSpecification(onStateUpdate, update, state))
          onStateUpdate()
        }
      }
    } else if (value instanceof ComponentFactory) {
      state[key] = value.create(onStateUpdate)
    } else if (value instanceof Array) {
      state[key] = value.map((arrayValue) => arrayValue instanceof ComponentFactory
        ? arrayValue.create(onStateUpdate)
        : arrayValue)
    } else { // data
      state[key] = value
    }
  }
  return state
}

function viewRequired () {
  const error = new Error('component specification requires view, but view was not found')
  error.code = 'ERROR_VIEW_NOT_FOUND'
  return error
}

function viewMustBeFunctionButWas (badView) {
  const error = new Error(`component specification requires view to be a function, but view was a ${typeof badView}`)
  error.code = 'ERROR_VIEW_NOT_FUNCTION'
  return error
}

// we use a class to be able to instanceof it later
class ComponentFactory {
  constructor (specification) {
    this.spec = specification
  }

  create (onStateUpdate) {
    return wireSpecification(onStateUpdate, this.spec)
  }

  extend (additionalSpecification) {
    if (additionalSpecification.view && typeof additionalSpecification.view !== 'function') {
      throw viewMustBeFunctionButWas(additionalSpecification.view)
    }
    return new ComponentFactory(Object.assign({}, this.spec, additionalSpecification))
  }

  get specification () {
    return this.spec
  }
}

module.exports = (specification) => {
  if (!specification.view) {
    throw viewRequired()
  }
  if (typeof specification.view !== 'function') {
    throw viewMustBeFunctionButWas(specification.view)
  }

  return new ComponentFactory(specification)
}
