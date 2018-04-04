const { Requests } = require('../src/')
const { inspect } = require('util')

const matchRoute = function (route) {
  return function ({ req }) {
    return route.test(req.path)
  }
}

const server = new Requests({ port: 3000 })
const routes = {}
let rest = server
;[routes.home,   rest] = rest.partition(matchRoute(/^\/?$/))
;[routes.images, rest] = rest.partition(matchRoute(/^\/images/))
;[routes.debug,  rest] = rest.partition(matchRoute(/^\/debug/))

rest
.map(() => '404')
.send(({ ctx }) => ctx)

const done = []
function removeValues (obj) {
  if (done.indexOf(obj) >= 0) return 'cyclic'
  done.push(obj)

  return Object.keys(obj)
  .map(k => ({ k, v: obj[k] }))
  .filter(({ k, v }) => typeof v === 'object' && v !== null)
  .map(({ k, v }) => ({ k, v: removeValues(v) }))
  .reduce((acc, { k, v }) => Object.assign({}, acc, { [k]: v }), {})
}

routes.debug
.send(ctx => {
  const s = inspect(removeValues(ctx), { depth: 3 })
  console.log(s)
  return s
})

routes.home
.map(({ req }) => 'hello, ' + req.ip)
.send(({ ctx }) => ctx)

routes.images
.send(() => 'heres your image')
