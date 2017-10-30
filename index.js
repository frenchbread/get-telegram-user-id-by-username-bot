const Checker = require('./dist').default
const config = require('./config')

const checker = new Checker(config)

checker.listen()
