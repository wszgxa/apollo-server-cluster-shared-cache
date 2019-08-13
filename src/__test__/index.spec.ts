import sayHello from '../'

describe('sayHello', (): void=> {
  it('should return Hello World!', (): void => {
    expect(sayHello()).toBe('Hello World!')
  })
})
