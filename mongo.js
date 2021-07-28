const moongose = require('mongoose')
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

moongose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
  .then(() => {
    console.log('database connected')
  })
  .catch(err => {
    console.log(err)
  })

process.on('uncaughtException', () => {
  moongose.connection.disconnect()
})
