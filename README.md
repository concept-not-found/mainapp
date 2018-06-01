# <img src="https://cdn.rawgit.com/concept-not-found/mainapp/0b139598/logo/mono-white-outlined.svg" width="486" height="142"/>

*You are now in control*

`mainapp` is a micro web application framework, where the control flow starts and is never lost. `mainapp` implements a state container that you actually want to use. Update state without the ceremony.

Getting started
---------------
Here is a simple counter application.
```js
import {h, App} from 'mainapp'

App({
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
}, document.getElementById('mainapp-entry'))
```

Main loop
---------
<img src="https://cdn.rawgit.com/concept-not-found/mainapp/0b139598/docs/main-loop.svg" width="512" height="512"/>

All webapps have the same main loop. Let's learn how `mainapp` implements the main loop.

### State tree
The state tree is the whole application. The state tree has both the data and code (views and actions) in the same place. This mean the application can rewrite itself, which is useful for code splitting.

#### Views
When state is updated, `view`s functions are used to render the application. They return DOM fragments based on the current state tree.

#### Actions
Actions are functions on the state tree that implement application logic and update the state tree. They are triggered by events or other actions. Actions take the current state tree and return an update. Actions can be asynchronous.

#### Updating the state tree
Let's take a closer look at the counter sample and show how the state tree changes.

The initial state tree is...
```js
{
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
}
```

`mainapp` uses `view` to render user interface. `view` receives the current state tree as the first argument into the function. We destructure it to get the current `count` and two actions. The initial DOM would be...
```html
<div>
  <h1>0</h1>
  <button onclick="() => down(1)">-</button>
  <button onclick="() => up(1)">+</button>
</div>
```
Let's say the user clicks on the `+` button. First of all, notice how `mainapp` uses the native `onclick` event handler and how its bound to the `up` action. Looking at the implementation of the `up` action, we notice similar to the `view`, the first argument is the current state tree. But wait, in the event handler, we don't pass in the state tree? This is the magic the makes `mainapp` easy to use. When defining actions we get access to the state tree, but when calling the action, we don't need to worry about it. This is an example of [partial application](https://en.wikipedia.org/wiki/Partial_application) in action.

When the `up` action is called, it returns `{count: 0 + 1}`. We don't need to return the whole state tree, we just return what we want to update, in this case the `count`. This will update the state tree to be...
```js
{
  count: 1,
  ...rest of state tree is unchanged
}
```
`mainapp` automatically renders the user interface after the state tree is updated.

### Components
`mainapp` supports components as substate trees. For example, we can extract `Counter` as a component...
```js
import {h, App} from 'mainapp'

const Counter = {
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
}

App({
  counter: Counter
  view({counter}) {
    return <counter.view/>
  }
}, document.getElementById('mainapp-entry'))
```
Each component has their own state. We use the `Counter` component multiple times and each will have their own `count`. Notice how the root view renders the `Counter` using `<counter.view/>`.

### Inversion of control
Applications are simpler when the control flow is clear. When the control flow is spread all over the application, it is much harder to change. `mainapp` allows you to keep control at the root state tree.

While its easy for parent nodes in the state tree to call actions on children nodes, we need a way for child nodes to call actions on their parent or even on the top of the state tree. While this seems dangerous, in practise all webapps need to do this.

#### Parent and global access
All components have access to their parent state tree via `$parent` and the global state tree via `$global`.
```js
import {h, App} from 'mainapp'

const Grandchild = {
  name: 'grandchild',
  view({$global: {name: rootName}, $parent: {name: parentName}, name}) {
    return <div>
      <p>Root name: {rootName}</p>
      <p>Parent name: {parentName}</p>
      <p>Own name: {name}</p>
    </div>
  }
}

const Child = {
  name: 'child',
  grandchild: Grandchild,
  view({grandchild}) {
    return <grandchild.view/>
  }
}

App({
  name: 'root',
  child: Child,
  view({child}) {
    return <child.view/>
  }
}, document.getElementById('mainapp-entry'))
```
This will render...
```html
<div>
  <p>Root name: root</p>
  <p>Parent name: child</p>
  <p>Own name: grandchild</p>
</div>
```
Component actions can also update `$global` and `$parent`.

More samples
------------
 * [Inline component](https://github.com/concept-not-found/mainapp-samples/tree/master/inline-component)
 * [Multiple components](https://github.com/concept-not-found/mainapp-samples/tree/master/multiple-components)
 * [Dynamic components](https://github.com/concept-not-found/mainapp-samples/tree/master/dynamic-components)
 * [Imported component](https://github.com/concept-not-found/mainapp-samples/tree/master/imported-component)
 * [Code splitting actions](https://github.com/concept-not-found/mainapp-samples/tree/master/code-splitting-action)
 * [Code splitting component](https://github.com/concept-not-found/mainapp-samples/tree/master/code-splitting-component)
 * [Dependency injection](https://github.com/concept-not-found/mainapp-samples/tree/master/dependency-injection)

