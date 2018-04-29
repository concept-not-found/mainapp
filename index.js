const {render} = require('ultradom')

const h = require('./h')
const Component = require('./component')
const App = require('./app')

function renderFactory (view, container) {
  return () => requestAnimationFrame(() => render(view(), container))
}

module.exports = {
  h,
  Component,
  App: App(renderFactory)
}
