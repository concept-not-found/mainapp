import RemoteCounter from './'

describe('remote counter', () => {
  const specification = RemoteCounter.specification

  it('starts in a loading state', () => {
    expect(specification.loading).toBe(true)
  })

  it('loads the count from the api using loadCount', () => {
    const apiService = {
      async loadCount () {
        return 42
      }
    }
    expect(specification.loadCount({apiService})).resolves.toEqual({
      loading: false,
      count: 42
    })
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

  it('renders loading while still loading', () => {
    const state = {
      loading: true
    }
    expect(specification.view(state)).toMatchSnapshot()
  })

  it('renders the count and -/+ buttons when loaded', () => {
    const state = {
      loading: false,
      count: 42
    }
    expect(specification.view(state)).toMatchSnapshot()
  })
})
