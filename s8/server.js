const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const sequelize = new Sequelize('rest_messages','root','',{
  dialect : 'mysql',
  define : {
    timestamps : false
  }
})

const Author = sequelize.define('author',{
  name : {
    type : Sequelize.STRING,
    allowNull : false,
    validate : {
      len : [3,40]
    }
  },
  email : {
    type : Sequelize.STRING,
    allowNull : false,
    validate : {
      isEmail : true
    }
  }
},{
  underscored : true
})

const Message = sequelize.define('message', {
  title : {
    type : Sequelize.STRING,
    allowNull : false,
    validate : {
      len : [5,20]
    }
  },
  content : {
    type : Sequelize.TEXT,
    allowNull : false,
    validate : {
      len : [10,1000]
    }
  },
  timestamp : {
    type : Sequelize.DATE,
    allowNull : false,
    defaultValue : Sequelize.NOW
  }
})

Author.hasMany(Message)

const app = express()
app.use(bodyParser.json())

app.get('/create', (req, res, next) => {
  sequelize.sync({force : true})
    .then(() => res.status(201).send('created'))
    .catch((error) => next(error))
})

app.get('/authors', (req, res, next) => {
  Author.findAll()
    .then((authors) => res.status(200).json(authors))
    .catch((error) => next(error))
})

app.post('/authors', (req, res, next) => {
  Author.create(req.body)
    .then(() => res.status(201).send('created'))
    .catch((error) => next(error))
})

app.get('/authors/:id', (req, res, next) => {
  Author.findById(req.params.id, {include : [Message]})
    .then((author) => {
      if (author){
        res.status(200).json(author)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .catch((error) => next(error))
})

app.put('/authors/:id', (req, res, next) => {
  Author.findById(req.params.id)
    .then((author) => {
      if (author){
        return author.update(req.body, {fields : ['name', 'email']})
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
    .catch((error) => next(error))
})

app.delete('/authors/:id', (req, res, next) => {
  Author.findById(req.params.id)
    .then((author) => {
      if (author){
        return author.destroy()
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
    .catch((error) => next(error))
})

app.get('/authors/:aid/messages', (req, res, next) => {
  Author.findById(req.params.aid)
    .then((author) => {
      if (author){
        return author.getMessages()
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then((messages) => {
      if (!res.headersSent){
        res.status(200).json(messages)  
      }
    })
    .catch((error) => next(error))  
})

app.post('/authors/:aid/messages', (req, res, next) => {
  Author.findById(req.params.aid)
    .then((author) => {
      if (author){
        let message = req.body
        message.author_id = author.id
        return Message.create(message)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then((messages) => {
      if (!res.headersSent){
        res.status(201).send('created')  
      }
    })
    .catch((error) => next(error))  

})

app.get('/authors/:aid/messages/:mid', (req, res, next) => {
  Message.findById(req.params.mid)
    .then((message) => {
      if (message){
        res.status(200).json(message)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .catch((error) => next(error))
})

app.put('/authors/:aid/messages/:mid', (req, res, next) => {
  Message.findById(req.params.mid)
    .then((message) => {
      if (message){
        return message.update(req.body, {fields : ['title', 'content']})
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
    .catch((error) => next(error))  
})

app.delete('/authors/:aid/messages/:mid', (req, res, next) => {
  Message.findById(req.params.mid)
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
    .catch((error) => next(error))
})


app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).send('some error')
})

app.listen(8080)