import {h, Component, App} from '../../..'

import RemoteCounter from './RemoteCounter'
import TotallyRealApiService from './TotallyRealApiService'

async function init () {
  const totallyRealApiService = TotallyRealApiService()

  const Main = Component({
    remoteCounter: RemoteCounter,
    view ({remoteCounter}) {
      return <remoteCounter.view />
    }
  })

  const main = App(Main, document.getElementById('mainapp-entry'))

  await main.remoteCounter.inject(totallyRealApiService)
  main.remoteCounter.loadCount()
}

init()
