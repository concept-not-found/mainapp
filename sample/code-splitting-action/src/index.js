import {h, Component, App} from '../../..'

const Main = Component({
  count: 1,
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
  async loadDouble () {
    const {default: double} = await import('./double-action')
    return {
      double
    }
  },
  view ({count, down, up, loadDouble, double}) {
    return <div>
      <h1>{count}</h1>
      <button onclick={() => down(1)}>-</button>
      <button onclick={() => up(1)}>+</button>
      <button onclick={loadDouble} disabled={double}>Load double</button>
      <button onclick={double} disabled={!double}>Double</button>
    </div>
  }
})

App(Main, document.getElementById('mainapp-entry'))
