require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
  response.send('Server is running!')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then( persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    request.requestTime = new Date()
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p><p></p><p>${request.requestTime}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id).then( person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p=> p.id !== id)
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name){
        return response.status(404).json({
            error: 'name is missing'
        })
    }
    /*
    if (persons.filter(p => p.name === body.name).length !== 0){
        return response.status(404).json({
            error: 'name must be unique'
        })
    }

    if (!body.number){
        return response.status(404).json({
            error: 'number is missing'
        })
    }
    */
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then( savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


/* Keeping these here just incase
let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]*/