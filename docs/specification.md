## Setup
In order make App more testable, we need to setup an internal api before we can test it.
```js
> lastRendering = undefined
> saveRendering = undefined
> resetTestRenderer = () => {
..  lastRendering = new Promise((resolve) => {
..    saveRendering = (view) => {
..      resolve(view); saveRendering = undefined
..    }
..  })
..}
> App = AppFactory((view) => () => saveRendering && saveRendering(view()))
```

## `h(name, attributes, ...children)`

### when `name` is a String, return a node  with name as the tag
```js
> h('p', {
..  style: {
..    textAlign: 'center'
..  }
..}, 'hello')
  ({
..  name: 'p',
..  attributes: {
..    style: {
..      textAlign: 'center'
..    }
..  },
..  children: ['hello'],
..  key: null
..})
```

### when `name` is a Function, return the result of the execution of the Function
```js
> count = (attributes, children) => `attributes: ${Object.keys(attributes).length}, children: ${children.length}`
> h(count, {
..  style: {
..    textAlign: 'center'
..  }
..}, 'hello')
'attributes: 1, children: 1'
```

## `Component(specification)`

### specification is available as a property
```js
> givenSpecification = {
..  view() {
..  }
..}
> Component(givenSpecification).specification === givenSpecification
true
```

## extending a specification returns a new component
```js
> Component({
..  view() {
..  }
..}).extend({moar: 'yes'}).specification.moar
'yes'
```

## extending a specification does not modify the original
```js
> givenSpecification = {
..  view() {
..  }
..}
> Component(givenSpecification).extend({moar: 'yes'})
> givenSpecification.moar
undefined
```

## extending a specification can overwrite exiting values
```js
> Component({
..  count: 10,
..  view() {
..  }
..}).extend({count: 42}).specification.count
42
```

## extending a specification and overwriting view will fail if view is not a function
```js
> Component({
..  view() {
..  }
..}).extend({view: 'nope'})
Error code: ERROR_VIEW_NOT_FUNCTION
```

## view is required
```js
> Component({})
Error code: ERROR_VIEW_NOT_FOUND
```

## view must be a function
```js
> Component({
..  view: 'hello'
..})
Error code: ERROR_VIEW_NOT_FUNCTION
```

## view has access to state
```js
> App(Component({
..  message: 'hello',
..  view({message}) {
..    return message
..  }
..})).view()
'hello'
```

## view has access to attributes from parent
JSX: `<child.view key="value" />`
```js
> child = Component({
..  name: 'Child',
..  view(state, attributes) {
..    return JSON.stringify(attributes)
..  }
..})
> App(Component({
..  child,
..  view({child}) {
..    return h(child.view, {
..      key: 'value'
..    })
..  }
..})).view()
'{"key":"value"}'
```

## view has access to children from parent
JSX: `<child.view>mine</child.view>`
```js
> child = Component({
..  name: 'Child',
..  view(state, attributes, children) {
..    return JSON.stringify(children)
..  }
..})
> App(Component({
..  child,
..  view({child}) {
..    return h(child.view, {}, 'mine')
..  }
..})).view()
'["mine"]'
```

## actions have access to state
```js
> component = App(Component({
..  count: 10,
..  up({count}) {
..    return {
..      count: count + 1
..    }
..  },
..  view() {
..  }
..}))
> component.up().then(() => component.count)
Resolve: 11
```

## actions can have parameters
```js
> component = App(Component({
..  count: 100,
..  setCount(state, value) {
..    return {
..      count: value
..    }
..  },
..  view() {
..  }
..}))
> component.setCount(9000).then(() => component.count)
Resolve: 9000
```

## actions can update state
```js
> component = App(Component({
..  name: 'Bob',
..  greet(state) {
..    return {
..      name: 'Alice'
..    }
..  },
..  view() {
..  }
..}))
> component.greet().then(() => component.name)
Resolve: 'Alice'
```

## actions can be asynchronous
```js
> component = App(Component({
..  name: 'Bob',
..  async greet(state) {
..    return Promise.resolve({
..      name: 'Alice'
..    })
..  },
..   view() {
..   }
..}))
> component.greet().then(() => component.name)
Resolve: 'Alice'
```

## parent component can access child components state
```js
> child = Component({
..  name: 'Child',
..  view() {
..  }
..})
> component = App(Component({
..  name: 'Parent',
..  child,
..  view() {
..    return 'Yes'
..  }
..}))
> component.child.name
'Child'
```

## parent component can use child components' view
JSX: `<p>comfort <child.view /></p>`
```js
> child = Component({
..  name: 'Child',
..  view() {
..    return 'Waaah'
..  }
..})
> component = App(Component({
.. name: 'Parent',
.. child,
.. view({child}) {
..   return h('p', {}, 'comfort ', h(child.view))
..  }
..}))
> component.view()
  ({
..  name: 'p',
..  attributes: {},
..  children: ['comfort ', 'Waaah'],
..  key: undefined
..})
```

## state can be updated with data
```js
> component = App(Component({
..  name: 'Bob',
..  greet(state) {
..    return {
..      name: 'Alice'
..    }
..  },
..  view() {
..  }
..}))
> component.greet().then(() => component.name)
Resolve: 'Alice'
```

## state can be updated with actions
```js
> component = App(Component({
..  rube(state) {
..    return {
..      goldberg(state) {
..        return {
..          greeting: 'Hello'
..        }
..      }
..    }
..  },
..  view() {
..  }
..}))
> component.rube().then(() => component.goldberg()).then(() => component.greeting)
Resolve: 'Hello'
```

## state can update the view
```js
> component = App(Component({
..  naysayers(state) {
..    return {
..      view(state) {
..        return 'No'
..      }
..    }
..  },
..  view() {
..    return 'Yes'
..   }
..}))
> component.naysayers().then(() => component.view())
Resolve: 'No'
```

## state can be updated with child components
```js
> child = Component({
..  name: 'Baby',
..  view() {
..  }
..})
> component = App(Component({
..  veryMuch(state) {
..    return {
..      child
..    }
..  },
..  view() {
..  }
..}))
> component.veryMuch().then(() => component.child.name)
Resolve: 'Baby'
```

## state can be updated with an array of child components
```js
> child = Component({
..  name: 'Baby',
..  view() {
..  }
..})
> component = App(Component({
..  children: [],
..  veryMuch(state) {
..    return {
..      children: [child]
..    }
..  },
..  view() {
..  }
..}))
> component.veryMuch().then(() => component.children[0].name)
Resolve: 'Baby'
```

## `app(mainComponent, container)`

### retuns the main component instance
```js
> resetTestRenderer()
> main = App(Component({
..  wired: true,
..  view({wired}) {
..    return `wired: ${wired}`
..  }
..}))
> main.view()
'wired: true'
```

### main component is rendered
```js
> resetTestRenderer()
> main = App(Component({
..  view() {
..    return 'hello'
..  }
..}))
> lastRendering
Resolve: 'hello'
```

### main component is re-rendered when state is updated
```js
> resetTestRenderer()
> main = App(Component({
..  name: 'Bob',
..  greet() {
..    return {
..      name: 'Alice'
..    }
..  },
..  view({name}) {
..    return name
..  }
..}))
> lastRendering
Resolve: 'Bob'
> resetTestRenderer()
> main.greet()
> lastRendering
Resolve: 'Alice'
```
