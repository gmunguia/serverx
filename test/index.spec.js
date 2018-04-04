const { Requests } = require('../src/')
const request = require('request-promise-native')
const cookie = require('cookie')

let requests
let subscription

beforeEach(() => {
  requests = new Requests({ port: 3000 })
})

afterEach(() => {
  subscription.unsubscribe()
})

test('responds to requests', async () => {
  subscription = requests
  .send(() => 'foo')

  const response = await request.get('http://localhost:3000/')
  expect(response).toBe('foo')
})

test('map', async () => {
  subscription = requests
  .map(({ req }) => ({ ctx: req.method }))
  .send(({ ctx }) => ctx)

  const response = await request.get('http://localhost:3000/')
  expect(response).toBe('GET')
})

test('flatMap', async () => {
  subscription = requests
  .flatMap(({ req }) => Requests.of({ ctx: req.method }))
  .send(({ ctx }) => ctx)

  const response = await request.get('http://localhost:3000/')
  expect(response).toBe('GET')
})

test('cookie', async () => {
  subscription = requests
  .cookie('bar', 'baz')
  .cookie('qux', 'quux')
  .send(({ ctx }) => 'foo')

  const response = await request.get('http://localhost:3000/', {
    resolveWithFullResponse: true
  })

  console.log(response.headers['set-cookie'])
  console.log(cookie.parse(response.headers['set-cookie'][0] || ''))

  const actualCookies = response.headers['set-cookie']
  const expectedCookies = expect.stringContaining('bar=baz')

  expect(actualCookies).toEqual(expect.arrayContaining([expectedCookies]))
})
