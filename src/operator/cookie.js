const Requests = require('../requests')
const createExpressOperator = require('../expressOperator')

module.exports = function append (name, value, options = {}) {
  return createExpressOperator('cookie', name, value, options)(this)
}
