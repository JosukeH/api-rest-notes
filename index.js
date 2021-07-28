require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
require('./mongo')
const Note = require('./models/Note')
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

Sentry.init({
  dsn: 'https://988e62c585064d648f27cca63be7f0f3@o925495.ingest.sentry.io/5874492',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id).then((note) => {
    if (note) {
      return res.json(note)
    } else {
      res.status(404).end()
    }
  })
    .catch((err) => {
      next(err)
      // console.log(err.message)
      res.status(400).end()
    })
})

app.post((req, res) => {
  const note = req.body

  if (!note.content) {
    return res.status(404).json({
      error: 'required "content" field is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })

  newNote.save()
    .then(newNote => {
      console.log(newNote)
    })
    .catch(err => {
      console.log(err)
    })
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id).then((result) => {
    res.status(204).end()
  }).catch(err => next(err))

  res.status(204).end()
})

app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      res.status(200).end()
    })
  res.status(204).end()
})

app.use(Sentry.Handlers.errorHandler())

app.use((req, res, next) => {
  res.status(404).end()
})

app.use((error, req, res, next) => {
  console.error(error)
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'id used is malformed' })
  } else {
    res.status(500).end()
  }
})

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`)
})
