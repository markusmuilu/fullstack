const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
]

app.get('/api/persons', (request, response) => {
    return response.json(persons)
})

app.get('/info', (request, response) => {
    request.requestTime = new Date()
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p><p></p><p>${request.requestTime}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person){
        return response.json(person)
    }{
        return response.status(400).json({
            error: 'content missing'
        })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p=> p.id !== id)
    response.status(204).end()
})

const generateId = () => {
    let id = String(Math.floor(Math.random()*1000))
    while (persons.filter(p => p.id === id).length !== 0){
        id = String(Math.floor(Math.random()*1000))
    }
    return id
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name){
        return response.status(404).json({
            error: 'name is missing'
        })
    }

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

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})