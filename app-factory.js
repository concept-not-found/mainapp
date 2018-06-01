const Component = require('./component')

module.exports = (renderFactory) => (mainComponent, container) => {
  let mainComponentInstance
  const render = renderFactory(() => mainComponentInstance.view(), container)
  mainComponentInstance = Component(render, mainComponent)
  render()
  return mainComponentInstance
}
