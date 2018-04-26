import Counter from './Counter'

describe('counter', () => {
  it('decrements by value given to down', () => {
    const specification = Counter.specification
    const state = {
      count: 42
    }
    const value = 40
    expect(specification.down(state, value)).toEqual({
      count: 2
    })
  })

  it('increments by value given to up', () => {
    const specification = Counter.specification
    const state = {
      count: 42
    }
    const value = 40
    expect(specification.up(state, value)).toEqual({
      count: 82
    })
  })

  it('renders the count and -/+ buttons', () => {
    const specification = Counter.specification
    const state = {
      count: 42
    }
    expect(specification.view(state)).toMatchSnapshot()
  })
})
