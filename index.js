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

  const state = {
    dirty: true
  }
  for (const key in specification) {
    const value = specification[key]
    if (typeof value === 'function') {
      if (key === 'view') {
        state[key] = () => value(state)
      } else {
        state[key] = async (parameter) => {
          const update = await value(state, parameter)
          Object.assign(state, update, {
            dirty: true
          })
        }
      }
    } else {
      state[key] = crappyDeepClone(value)
    }
  }
  return state
}

export function Render(module, container) {
  function main() {
    if (module.dirty) {
      Ultradom.render(module.view(), container)
      module.dirty = false
    }
    requestAnimationFrame(main)
  }
  main()
}
