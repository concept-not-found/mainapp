import {h, Component} from '../../../..'

export default Component({
  inject (state, apiService) {
    return {
      apiService
    }
  },
  loading: true,
  count: NaN,
  async loadCount (state) {
    const {apiService} = state
    const remoteCount = await apiService.loadCount()
    return {
      loading: false,
      count: remoteCount
    }
  },
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
  view ({loading, count, down, up}) {
    if (loading) {
      return <p>Loading...</p>
    }
    return <div>
      <h1>{count}</h1>
      <button onclick={() => down(1)}>-</button>
      <button onclick={() => up(1)}>+</button>
    </div>
  }
})
