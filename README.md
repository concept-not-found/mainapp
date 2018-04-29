Mainapp
=======

*You are now in control*

Mainapp is a micro web application framework. It is where the control flow starts and is never let go.

Getting started
---------------
Let's write a simple counter application.
```js
import {h, Component, App} from 'mainapp'

const Main = Component({
  count: 0,
  down ({count}, value) {
    return {
      count: count - value
    }
  },
  up ({count}, value) {
    return {
      count: count + value
    }
  },
  view ({count, down, up}) {
    return <div>
      <h1>{count}</h1>
      <button onclick={() => down(1)}>-</button>
      <button onclick={() => up(1)}>+</button>
    </div>
  }
})

App(Main, document.getElementById('mainapp-entry'))
```

Everything in Mainapp is a component. Components have state and a `view`.

### State
State is a mixture of data, actions and child components. In our example `count: 0` is the initial data.

Actions are functions that return an update to the state. Here `down` and `up` are the two actions. When defining an action, the first argument is the state. The remaining arguments are values passed at the call of the action.

### View
View returns the DOM fragment for this component. Like actions the first argument is the state, but the second argument is the attributes and children passed by the parent (more on this later).

### Bringing everything together
The `view` shows the current count and two buttons to decrement and increment the count. The `view` binds the `down` and `up` actions to buttons. Notice the call to `down` only passed in the value to decrement by. The state is not passed into `down`, this is handled automatically by Mainapp. This simplifies the caller of actions. Finally on the last line, the `Main` component is passed into `App` where is it bound to a container and rendered.

### JSX
Under the covers, Mainapp is using [Ultradom][1] for rendering and extends `h` to support function as child component.

### More samples
 * [Inline component](https://github.com/concept-not-found/mainapp/tree/master/sample/inline-component)
 * [Multiple components](https://github.com/concept-not-found/mainapp/tree/master/sample/multiple-components)
 * [Dynamic components](https://github.com/concept-not-found/mainapp/tree/master/sample/dynamic-components)
 * [Imported component](https://github.com/concept-not-found/mainapp/tree/master/sample/imported-component)
 * [Code splitting actions](https://github.com/concept-not-found/mainapp/tree/master/sample/code-splitting-action)
 * [Code splitting component](https://github.com/concept-not-found/mainapp/tree/master/sample/code-splitting-component)
 * [Dependency injection](https://github.com/concept-not-found/mainapp/tree/master/sample/dependency-injection)

API
---

### `h(name, attributes, ...children)`
Creates a new virtual DOM node. Supports function as child component.

### `Component(specification)`
Creates a component with specification. Specifications **must** include a `view` function. The specification can include the initial data, actions and child components.

Actions are functions of the form `async actionName(state, ...parameters)`. Actions are optionally asynchronous but must always return an update to the state, which is data, actions and child components.

Since child components are on state, all data can be read off the the child and all actions on the child can be called.

The `view` is a function of the form `view(state, attributes, children)`. The `view` uses the state to build the DOM fragment. The `view` can render data, bind actions to event handlers, and render child components using the form `<childComponent.view attributeKey="attributeValue">Grandchildren</childComponent.view>`. The child component receives `attributes` and `children` in the last two arguments of its own `view` function.

Components have their specification exposed as the `.specification` property. This is useful for unit testing.

Components can also have their specification extended using `.extend(additionalSpecification)`. This returns a new component with the new specification. This does not modify the original component's specification.

### `App(mainComponent, container)`
Creates an application using the main component and binds it to the container element. `App` returns the main component instance, which can be used to read all the data and call all the actions.

[1]: https://github.com/jorgebucaran/ultradom
