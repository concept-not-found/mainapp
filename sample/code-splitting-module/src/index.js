import {h, Module, App} from '../../..'

const Main = Module({
  async loadCounter () {
    const {default: Counter} = await import('./Counter')
    return {
      counter: Counter
    }
  },
  view ({loadCounter, counter}) {
    return <div>
      <button onclick={loadCounter} disabled={counter}>Load counter</button>
      {counter && <counter.view />}
    </div>
  }
})

App(Main, document.getElementById('mainapp-entry'))
