import * as Ultradom from 'ultradom'

export function h (name, attributes, ...children) {
  return typeof name === 'function'
    ? name(attributes, children)
    : Ultradom.h(name, attributes, children)
}

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
    } else if (value instanceof ModuleFactory) {
      state[key] = value.create(onStateUpdate)
    } else if (value instanceof Array) {
      state[key] = value.map((arrayValue) => arrayValue instanceof ModuleFactory
        ? arrayValue.create(onStateUpdate)
        : arrayValue)
    } else { // data
      state[key] = crappyDeepClone(value)
    }
  }
  return state
}

// we use a class to be able to instanceof it later
class ModuleFactory {
  constructor (specification) {
    this.specification = specification
  }

  create (onStateUpdate) {
    return wireSpecification(onStateUpdate, this.specification)
  }
}

export function Module (specification) {
  if (!specification.view) {
    throw new Error('module specification requires view(state), but view was not found')
  }
  if (typeof specification.view !== 'function') {
    throw new Error(`module specification requires view(state) to be a function, but view was a ${typeof specification.view}`)
  }

  return new ModuleFactory(specification)
}

export function App (mainModuleFactory, container) {
  let mainModule
  function render () {
    requestAnimationFrame(() => Ultradom.render(mainModule.view(), container))
  }
  mainModule = mainModuleFactory.create(render)
  render()
}
