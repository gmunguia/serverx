const { Requests } = require('../requests')
const cookie = require('../operator/cookie')

Requests.prototype.cookie = cookie
