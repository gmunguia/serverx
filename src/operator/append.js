const Requests = require('../requests')
const createExpressOperator = require('../expressOperator')

module.exports = function append (field, value) {
  return createExpressOperator('append', field, value)(this)
}
