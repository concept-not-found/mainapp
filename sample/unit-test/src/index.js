import {h, Component, App} from '../../..'

import Counter from './Counter'

const Main = Component({
  counter: Counter,
  view ({counter}) {
    return <div>
      <counter.view />
    </div>
  }
})

App(Main, document.getElementById('mainapp-entry'))
