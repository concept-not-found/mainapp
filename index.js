const Ultradom = require('ultradom')

function wireSpecification (onStateUpdate, specification, state = {}) {
  for (const key in specification) {
    const value = specification[key]
    if (typeof value === 'function') {
      if (key === 'view') {
        state[key] = (props) => value(state, props)
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
      throw new Error(`component specification requires view(state) to be a function, but view was a ${typeof additionalSpecification.view}`)
    }
    return new ComponentFactory(Object.assign({}, this.spec, additionalSpecification))
  }

  get specification () {
    return this.spec
  }
}

module.exports = {
  h (name, attributes, ...children) {
    return typeof name === 'function'
      ? name(attributes, children)
      : Ultradom.h(name, attributes, children)
  },

  Component (specification) {
    if (!specification.view) {
      throw new Error('component specification requires view(state), but view was not found')
    }
    if (typeof specification.view !== 'function') {
      throw new Error(`component specification requires view(state) to be a function, but view was a ${typeof specification.view}`)
    }

    return new ComponentFactory(specification)
  },

  App (mainComponent, container) {
    let mainComponentInstance
    function render () {
      requestAnimationFrame(() => Ultradom.render(mainComponentInstance.view(), container))
    }
    mainComponentInstance = mainComponent.create(render)
    render()
    return mainComponentInstance
  }
}
