const { Requests } = require('../requests')
const status = require('../operator/status')

Requests.prototype.status = status
