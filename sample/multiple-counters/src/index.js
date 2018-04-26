import {h, Component, App} from '../../..'

const Counter = Component({
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
  view ({count, down, up}, {name}) {
    return <div>
      <h1>{name}: {count}</h1>
      <button onclick={() => down(1)}>-</button>
      <button onclick={() => up(1)}>+</button>
    </div>
  }
})

const Main = Component({
  first: Counter,
  second: Counter,
  view ({first, second}) {
    return <div>
      <first.view name="first" />
      <second.view name="second" />
      <p>Sum: {first.count + second.count}</p>
    </div>
  }
})

App(Main, document.getElementById('mainapp-entry'))
