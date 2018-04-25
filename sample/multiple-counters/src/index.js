import {h, Module, App} from '../../../index.js'

const Counter = Module({
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

const Main = Module({
  FirstCounter: Counter,
  SecondCounter: Counter,
  view ({FirstCounter, SecondCounter}) {
    return <div>
      <FirstCounter.view name="first" />
      <SecondCounter.view name="second" />
      <p>Sum - {FirstCounter.count + SecondCounter.count}</p>
    </div>
  }
})

App(Main, document.getElementById('mainapp-entry'))
