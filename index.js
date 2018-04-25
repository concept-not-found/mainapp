import * as Ultradom from 'ultradom'

export function h(name, attributes, ...children) {
  return typeof name === 'function'
    ? name(attributes, children)
    : Ultradom.h(name, attributes, children)
}

function crappyDeepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function Module(specification) {
  if (!specification.view) {
    throw new Error('module specification requires view(state), but view was not found')
  }
  if (typeof specification.view !== 'function') {
    throw new Error(`module specification requires view(state) to be a function, but view was a ${typeof specification.view}`)
  }

  function moduleFactory(onStateUpdate) {
    const state = {}
    for (const key in specification) {
      const value = specification[key]
      if (typeof value === 'function') {
        if (key === 'view') {
          state[key] = (props) => value(state, props)
        } else if (value.moduleFactory) {
          const module = 
          state[key] = value(onStateUpdate)
        } else {
          state[key] = async (parameter) => {
            const update = await value(state, parameter)
            Object.assign(state, update)
            onStateUpdate()
          }
        }
      } else {
        state[key] = crappyDeepClone(value)
      }
    }
    return state
  }
  moduleFactory.moduleFactory = true
  return moduleFactory
}

export function App(moduleFactory, container) {
  let mainModule
  function onStateUpdate() {
    requestAnimationFrame(() => Ultradom.render(mainModule.view(), container))
  }
  mainModule = moduleFactory(onStateUpdate)
  onStateUpdate()
  return mainModule
}
