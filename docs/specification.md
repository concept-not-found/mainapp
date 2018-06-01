## Setup
In order make App more testable, we need to setup an internal api before we can test it.
```js
> lastRendering = undefined
> saveRendering = undefined
> resetTestRenderer = () => {
..  lastRendering = new Promise((resolve) => {
..    saveRendering = (view) => {
..      resolve(view)
..      saveRendering = undefined
..    }
..  })
..}
> App = AppFactory((view) => () => saveRendering && saveRendering(view()))
```

### when `name` is a String, return a node with name as the tag
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

## view has access to state
```js
> App({
..  message: 'hello',
..  view({message}) {
..    return message
..  }
..}).view()
'hello'
```

## view has access to attributes from parent
JSX: `<child.view key="value" />`
```js
> child = {
..  name: 'Child',
..  view(state, attributes) {
..    return JSON.stringify(attributes)
..  }
..}
> App({
..  child,
..  view({child}) {
..    return h(child.view, {
..      key: 'value'
..    })
..  }
..}).view()
'{"key":"value"}'
```

## view has access to children from parent
JSX: `<child.view>mine</child.view>`
```js
> child = {
..  name: 'Child',
..  view(state, attributes, children) {
..    return JSON.stringify(children)
..  }
..}
> App({
..  child,
..  view({child}) {
..    return h(child.view, {}, 'mine')
..  }
..}).view()
'["mine"]'
```

## actions have access to state
```js
> component = App({
..  count: 10,
..  up({count}) {
..    return {
..      count: count + 1
..    }
..  }
..})
> component.up().then(() => component.count)
Resolve: 11
```

## actions can have parameters
```js
> component = App({
..  count: 100,
..  setCount(state, value) {
..    return {
..      count: value
..    }
..  }
..})
> component.setCount(9000).then(() => component.count)
Resolve: 9000
```

## actions can update state
```js
> component = App({
..  name: 'Bob',
..  greet(state) {
..    return {
..      name: 'Alice'
..    }
..  }
..})
> component.greet().then(() => component.name)
Resolve: 'Alice'
```

## actions can be asynchronous
```js
> component = App({
..  name: 'Bob',
..  async greet(state) {
..    return Promise.resolve({
..      name: 'Alice'
..    })
..  }
..})
> component.greet().then(() => component.name)
Resolve: 'Alice'
```

## parent component have access to child state
```js
> child = {
..  name: 'Child'
..}
> component = App({
..  name: 'Parent',
..  child
..})
> component.child.name
'Child'
```

## parent component can use child components' view
JSX: `<p>comfort <child.view /></p>`
```js
> child = {
..  name: 'Child',
..  view() {
..    return 'Waaah'
..  }
..}
> parent = App({
.. name: 'Parent',
.. child,
.. view({child}) {
..   return h('p', {}, 'comfort ', h(child.view))
..  }
..})
> parent.view()
  ({
..  name: 'p',
..  attributes: {},
..  children: ['comfort ', 'Waaah'],
..  key: undefined
..})
```

## child component have their own state
```js
> child = {
..  age: 'Child',
..  view({age}) {
..    return age
..  }
..}
> parent = App({
.. age: 'Such old',
.. child,
.. view({age, child}) {
..   return `parent age: ${age}, child age: ${child.view()}`
..  }
..})
> parent.view()
'parent age: Such old, child age: Child'
```

## child component can update their own state
```js
> child = {
..  age: 'Child',
..  growUp() {
..    return {
..      age: 'Adult'
..    }
..  },
..  view({age}) {
..    return age
..  }
..}
> parent = App({
.. age: 'Such old',
.. child,
.. view({age, child}) {
..   return `parent age: ${age}, child age: ${child.view()}`
..  }
..})
> parent.child.growUp().then(() => parent.view())
Resolve: 'parent age: Such old, child age: Adult'
```

## child components have access to parent state
```js
> child = {
..  age: 'Child',
..  view({$parent:{age: parentAge}}) {
..    return parentAge
..  }
..}
> parent = App({
.. age: 'Such old',
.. child,
.. view({child}) {
..   return `child's parent age: ${child.view()}`
..  }
..})
> parent.view()
'child\'s parent age: Such old'
```

## child components can update parent state
```js
> child = {
..  age: 'Child',
..  growUp() {
..    return {
..      $parent: {
..        age: 'Such old and wise'
..      }
..    }
..  },
..  view({$parent:{age: parentAge}}) {
..    return parentAge
..  }
..}
> parent = App({
.. age: 'Such old',
.. child,
.. view({child}) {
..   return `child's parent age: ${child.view()}`
..  }
..})
> parent.child.growUp().then(() => parent.view())
Resolve: 'child\'s parent age: Such old and wise'
```

## child components have access to global state
```js
> grandchild = {
..  age: 'Grandchild',
..  view({$global: {age: grandparentAge}}) {
..    return grandparentAge
..  }
..}
> child = {
..  age: 'Child',
..  grandchild,
..  view({age}) {
..    return age
..  }
..}
> parent = App({
.. age: 'Such old',
.. child,
.. view({child: {grandchild}}) {
..   return `grandchild's grandparent age: ${grandchild.view()}`
..  }
..})
> parent.view()
'grandchild\'s grandparent age: Such old'
```

## child components can update global state
```js
> grandchild = {
..  age: 'Grandhild',
..  growUp() {
..    return {
..      $global: {
..        age: 'Such old and wise'
..      }
..    }
..  },
..  view({$global: {age: grandparentAge}}) {
..    return grandparentAge
..  }
..}
> child = {
..  age: 'Child',
..  grandchild,
..  view({age}) {
..    return age
..  }
..}
> parent = App({
.. age: 'Such old',
.. child,
.. view({child: {grandchild}}) {
..   return `grandchild's grandparent age: ${grandchild.view()}`
..  }
..})
> parent.child.grandchild.growUp().then(() => parent.view())
Resolve: 'grandchild\'s grandparent age: Such old and wise'
```

## state can be updated with data
```js
> component = App({
..  name: 'Bob',
..  greet(state) {
..    return {
..      name: 'Alice'
..    }
..  }
..})
> component.greet().then(() => component.name)
Resolve: 'Alice'
```

## state can be updated with actions
```js
> component = App({
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
..})
> component.rube().then(() => component.goldberg()).then(() => component.greeting)
Resolve: 'Hello'
```

## state can update the view
```js
> component = App({
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
..})
> component.naysayers().then(() => component.view())
Resolve: 'No'
```

## state can be updated with child components
```js
> child = {
..  name: 'Baby'
..}
> component = App({
..  veryMuch(state) {
..    return {
..      child
..    }
..  }
..})
> component.veryMuch().then(() => component.child.name)
Resolve: 'Baby'
```

### App returns the main component instance
```js
> resetTestRenderer()
> main = App({
..  wired: true,
..  view({wired}) {
..    return `wired: ${wired}`
..  }
..})
> main.view()
'wired: true'
```

### main component is rendered
```js
> resetTestRenderer()
> App({
..  view() {
..    return 'hello'
..  }
..})
> lastRendering
Resolve: 'hello'
```

### main component is re-rendered when state is updated
```js
> resetTestRenderer()
> main = App({
..  name: 'Bob',
..  greet() {
..    return {
..      name: 'Alice'
..    }
..  },
..  view({name}) {
..    return name
..  }
..})
> lastRendering
Resolve: 'Bob'
> resetTestRenderer()
> main.greet()
> lastRendering
Resolve: 'Alice'
```
