const express = require('express')

const app = express()
const userRouter = express.Router()
const adminRouter = express.Router()

app.use('/user', userRouter)
app.use('/admin', adminRouter)

userRouter.get('/stuff', (req, res) => {
  res.status(200).send('public stuff')
})

adminRouter.get('/stuff', (req, res) => {
  res.status(200).send('admin stuff')
})

app.listen(8080)