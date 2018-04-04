const express = require('express')
const { Observable, Subject, Subscriber } = require('rxjs')

class Requests extends Observable {
  constructor ({ port = 3000 } = {}, source) {
    super()

    if (source) {
      this.source = source
      return this
    }

    const app = express()
    app.use((req, res, next) => {
      this.source.next({ req, res })
      next()
    })
    const server = app.listen(port)
    const dispose = () => { server.close() }

    this.source = new Subject()
    this._subscribe = (subscriber) => {
      this.source.subscribe(subscriber)
      return dispose
    }
  }

  lift (operator, isResNeeded = false) {
    if (!isResNeeded) {
      return new Requests({}, new MiddlewareObservable(this, operator))
    }

    const observable = new Requests({}, this)
    observable.operator = operator
    return observable
  }

  send (createResponse, createError) {
    return this.subscribe({
      next: ({ req, res, ...locals }) => res.send(createResponse({ req, ...locals })),
      error: ({ res, error }) => { console.error(error); res.status(500).send('ko') },
    })
  }
}

class MiddlewareObservable extends Observable {
  constructor (source, operator) {
    super()
    this.source = source
    return this.mergeMap(
      ({ req, res, ...locals }) => {
        return Observable.of({ ...locals, req })
        .lift(operator)
        .map(ctx => ({ ...ctx, req, res }))
        .catch(error => { throw { req, res, error } })
      }
    )
  }
}

module.exports = { Requests }
