const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

app.locals.kittens = [{name : 'timmy', color : 'tabby'}]

app.get('/kittens', (req, res) => {
  res.status(200).json(app.locals.kittens)
})

app.post('/kittens', (req, res) => {
  let kitten = req.body
  app.locals.kittens.push(kitten)
  res.status(201).send('kitten assembled')
})

app.listen(8080)