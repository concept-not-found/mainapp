import {h, Module, App} from '../../..'

import Counter from './Counter'

const Main = Module({
  counter: Counter,
  view ({counter}) {
    return <div>
      <counter.view />
    </div>
  }
})

App(Main, document.getElementById('mainapp-entry'))
