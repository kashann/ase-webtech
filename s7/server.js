const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const sequelize = new Sequelize('rest_messages', 'root', '', {
  dialect : 'mysql'
})

const Message = sequelize.define('message',{
  title : Sequelize.STRING,
  content : Sequelize.STRING
})

const app = express()
app.use(bodyParser.json())

app.get('/create', (req, res) => {
  sequelize.sync({force : true})
    .then(() => res.status(201).send('created'))
    .catch((err) => {
      console.warn(err)
      res.status(500).send('some error...')
    })
})

app.get('/messages', (req, res) => {
  Message.findAll()
    .then((messages) => res.status(200).json(messages))
    .catch((err) => {
      console.warn(err)
      res.status(500).send('some error...')
    })
})

app.post('/messages', (req, res) => {
  Message.create(req.body)
    .then(() => res.status(201).send('created'))
    .catch((err) => {
      console.warn(err)
      res.status(500).send('some error...')
    })
})

app.get('/messages/:id', (req, res) => {
  Message.findById(req.params.id)
    .then((message) => {
      if (message){
        res.status(200).json(message)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .catch((err) => {
      console.warn(err)
      res.status(500).send('some error...')
    })
})

app.put('/messages/:id', (req, res) => {
  Message.findById(req.params.id)
    .then((message) => {
      if (message){
        return message.update(req.body)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('modified')
      }
    })
    .catch((err) => {
      console.warn(err)
      res.status(500).send('some error...')
    })
})

app.delete('/messages/:id', (req, res) => {
  Message.findById(req.params.id)
    .then((message) => {
      if (message){
        return message.destroy()
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('removed')
      }
    })
    .catch((err) => {
      console.warn(err)
      res.status(500).send('some error...')
    })
})

app.listen(8080)