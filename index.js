require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

require('./mongo')
const Note = require('./models/Note')
const PORT = process.env.PORT
app.use(cors())

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
      console.error(err)
      res.status(503).end()
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

app.delete('/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndRemove(id).then((result) => {
    res.status(204).end()
  }).catch(err => next(err))

  res.status(204).end()
})

app.put('/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo)
    .then(result => {
      res.status(200).end()
    })

  res.status(204).end()
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
