import Counter from './'

describe('counter', () => {
  const specification = Counter.specification

  it('starts the count at zero', () => {
    expect(specification.count).toBe(0)
  })

  it('decrements by value given to down', () => {
    const state = {
      count: 42
    }
    const value = 40
    expect(specification.down(state, value)).toEqual({
      count: 2
    })
  })

  it('increments by value given to up', () => {
    const state = {
      count: 42
    }
    const value = 40
    expect(specification.up(state, value)).toEqual({
      count: 82
    })
  })

  it('renders the count and -/+ buttons', () => {
    const state = {
      count: 42
    }
    expect(specification.view(state)).toMatchSnapshot()
  })
})
