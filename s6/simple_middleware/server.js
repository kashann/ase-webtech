const express = require('express')

const app = express()
app.use((req, res, next) => {
  console.log(req.url + ' was requested')
  next()
})

app.use((req, res, next) => {
  if (req.url == '/private'){
    res.status(400).send('this stuff is secret')
  }
  else{
    next()
  }
})

app.use((req, res, next) => {
  let oldSend = res.send
  res.send = function(content){
    let modifiedContent = 'middleware was here ' + content
    oldSend.apply(this, [modifiedContent])
  }
  next()
})

app.get('/public', (req, res) => {
  res.status(200).send('public stuff')
})

app.get('/private', (req, res) => {
  res.status(200).send('private stuff')
})

app.listen(8080)