import { Either, Left, Right, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(2)
  }

  return left('error')
}

test('success result', () => {
  const success = doSomething(true)

  expect(success).instanceOf(Right)
  expect(success.isRight()).toBe(true)
  expect(success.isLeft()).toBe(false)
  expect(success.value).toEqual(2)
})

test('error result', () => {
  const error = doSomething(false)

  expect(error).instanceOf(Left)
  expect(error.isLeft()).toBe(true)
  expect(error.isRight()).toBe(false)
  expect(error.value).toEqual('error')
})
