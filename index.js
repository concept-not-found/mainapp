const {render} = require('ultradom')
const h = require('./h')
const AppFactory = require('./app-factory')

module.exports = {
  h,
  App: AppFactory((view, container) => () => requestAnimationFrame(() => render(view(), container)))
}
