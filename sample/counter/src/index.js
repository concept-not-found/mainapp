import {h, Module, App} from '../../../index.js'

const Main = Module({
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
