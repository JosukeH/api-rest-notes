const moongose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

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
