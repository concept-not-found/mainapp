const {render} = require('ultradom')
const h = require('./h')
const materialize = require('./materialize')
const AppFactory = require('./app-factory')

module.exports = {
  h,
  materialize,
  App: AppFactory((view, container) => () => requestAnimationFrame(() => render(materialize(view()), container)))
}
