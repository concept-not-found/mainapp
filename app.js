module.exports = (renderFactory) => (mainComponent, container) => {
  let mainComponentInstance
  const render = renderFactory(() => mainComponentInstance.view(), container)
  mainComponentInstance = mainComponent.create(render)
  render()
  return mainComponentInstance
}
