import {h, Module, App} from '../../..'

const counterSpecification = {
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
}

const Main = Module({
  nextCounterId: 0,
  counters: [],
  addCounter ({nextCounterId, counters}) {
    const id = nextCounterId
    return {
      nextCounterId: id + 1,
      counters: [
        ...counters,
        Module(Object.assign(counterSpecification, {
          id
        }))
      ]
    }
  },
  removeCounter ({counters}, counterId) {
    return {
      counters: counters.filter(({id}) => id !== counterId)
    }
  },
  view ({addCounter, removeCounter, counters}) {
    return <div>
      <button onclick={addCounter}>Add counter</button>
      <div>
        {counters.map((counter) => <div>
          <counter.view key={counter.id} name={`counter #${counter.id}`} />
          <button style="margin-bottom: 20px;" onclick={() => removeCounter(counter.id)}>Remove counter #{counter.id}</button>
        </div>)}
      </div>
      <p>Sum - {counters.reduce((sum, {count}) => sum + count, 0)}</p>
    </div>
  }
})

App(Main, document.getElementById('mainapp-entry'))
