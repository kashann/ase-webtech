const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const sequelize = new Sequelize('rest_linkedin','root','',{
  dialect : 'mysql',
  define : {
    timestamps : false
  }
})

const Person = sequelize.define('person',{
  first_name : {
    type : Sequelize.STRING,
    allowNull : false,
    validate : {
      len : [3,40]
    }
  },
  last_name : {
    type : Sequelize.STRING,
    allowNull : false,
    validate : {
      len : [3,40]
    }
  },
  age : {
      type : Sequelize.INTEGER,
      allowNull : false,
      validate : {
          isNumeric : true,
          isInt : true,
          min : 18,
          max : 90
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

const Job = sequelize.define('job', {
  title : {
    type : Sequelize.STRING,
    allowNull : false,
    validate : {
      len : [5,200]
    }
  },
  responsabilities : {
    type : Sequelize.TEXT,
    allowNull : false,
    validate : {
      len : [10,5000]
    }
  },
  timestamp : {
    type : Sequelize.DATEONLY,
    allowNull : false,
    defaultValue : Sequelize.NOW
  }
})

Person.hasMany(Job)

const app = express()
app.use(bodyParser.json())

app.get('/create', (req, res, next) => {
  sequelize.sync({force : true})
    .then(() => res.status(201).send('created'))
    .catch((error) => next(error))
})

app.get('/persons', (req, res, next) => {
  Person.findAll()
    .then((persons) => res.status(200).json(persons))
    .catch((error) => next(error))
})

app.post('/persons', (req, res, next) => {
  Person.create(req.body)
    .then(() => res.status(201).send('created'))
    .catch((error) => next(error))
})

app.get('/persons/:id', (req, res, next) => {
  Person.findById(req.params.id, {include : [Job]})
    .then((person) => {
      if (person){
        res.status(200).json(person)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .catch((error) => next(error))
})

app.put('/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if ([person]){
        return person.update(req.body, {fields : ['first_name', 'last_name', 'age', 'email']})
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

app.delete('/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person){
        return person.destroy()
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

app.get('/persons/:pid/jobs', (req, res, next) => {
  Person.findById(req.params.pid)
    .then((person) => {
      if (person){
        return person.getJobs()
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then((jobs) => {
      if (!res.headersSent){
        res.status(200).json(jobs)  
      }
    })
    .catch((error) => next(error))  
})

app.post('/persons/:pid/jobs', (req, res, next) => {
  Person.findById(req.params.pid)
    .then((person) => {
      if (person){
        let job = req.body
        job.person_id = person.id
        return Job.create(job)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then((jobs) => {
      if (!res.headersSent){
        res.status(201).send('created')  
      }
    })
    .catch((error) => next(error))  

})

app.get('/persons/:pid/jobs/:jid', (req, res, next) => {
  Job.findById(req.params.jid)
    .then((job) => {
      if (job){
        res.status(200).json(job)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .catch((error) => next(error))
})

app.put('/persons/:pid/jobs/:jid', (req, res, next) => {
  Job.findById(req.params.jid)
    .then((job) => {
      if (job){
        return job.update(req.body, {fields : ['title', 'responsabilities']})
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

app.delete('/persons/:pid/jobs/:jid', (req, res, next) => {
  Job.findById(req.params.jid)
    .then((job) => {
      if (job){
        return job.destroy()
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