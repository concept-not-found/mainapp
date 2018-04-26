const Ultradom = require('ultradom')

function crappyDeepClone (value) {
  return JSON.parse(JSON.stringify(value))
}

function wireSpecification (onStateUpdate, specification, state = {}) {
  for (const key in specification) {
    const value = specification[key]
    if (typeof value === 'function') {
      if (key === 'view') {
        state[key] = (props) => value(state, props)
      } else { // action
        state[key] = async (parameter) => {
          const update = await value(state, parameter)
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
      state[key] = crappyDeepClone(value)
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

  App (mainComponentFactory, container) {
    let mainComponent
    function render () {
      requestAnimationFrame(() => Ultradom.render(mainComponent.view(), container))
    }
    mainComponent = mainComponentFactory.create(render)
    render()
  }
}
