const { Requests } = require('../requests')
const append = require('../operator/append')

Requests.prototype.append = append
