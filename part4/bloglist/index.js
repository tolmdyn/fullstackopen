const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

//const cors = require('cors')

//const mongoose = require('mongoose')

//const mongoUrl = 'mongodb+srv://tolmdyn:xVPaxH72Xj9lbSzX@cluster0.p5lkg.mongodb.net/blognotes?retryWrites=true&w=majority'
//mongoose.connect(mongoUrl)

//a//pp.use(cors())
//app.use(express.json())

//const PORT = 3003
//app.listen(PORT, () => {
//  console.log(`Server running on port ${PORT}`)
//})

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
