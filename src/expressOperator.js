const { Subscriber } = require('rxjs')

function createExpressOperator (operatorName, ...args) {
  return function expressOperatorFunction (source) {
    return source.lift(new ExpressOperator(operatorName, ...args), true)
  }
}

class ExpressOperator {
  constructor (operatorName, ...args) {
    this.operatorName = operatorName
    this.args = args
  }

  call (subscriber, source) {
    return source.subscribe(
      new ExpressOperatorSubscriber(subscriber, this.operatorName, ...this.args)
    )
  }
}

class ExpressOperatorSubscriber extends Subscriber {
  constructor (destination, operatorName, ...args) {
    super(destination)
    this.operatorName = operatorName
    this.args = args
  }

  _next (ctx) {
    try {
      ctx.res[this.operatorName](...this.args)
    } catch (error) {
      this.destination.error(error)
      return
    }
    this.destination.next(ctx)
  }
}

module.exports = createExpressOperator
