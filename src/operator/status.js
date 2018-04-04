const Requests = require('../requests')
const createExpressOperator = require('../expressOperator')

module.exports = function status (code) {
  return createExpressOperator('status', code)(this)
}
