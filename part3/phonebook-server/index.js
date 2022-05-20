const express = require('express')
var morgan = require('morgan')

const app = express()

//app.use(morgan('tiny'))

morgan.token('content', function (req, res) {
  if (req.method == 'POST'){
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.use(express.json())

let data = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

const generateId = () => {
  max = 9999
  return Math.floor(Math.random() * max);
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (request, response) => {
  const text = `Phonebook has info for ${data.length} people.<br>${new Date()}`
  response.send(text)
})

app.get('/api/persons', (request, response) => {
  response.json(data)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = data.find(person => person.id === id)

  if (person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const isName = (name) => (person) => name === person.name

const containsName = (name) => {
  return data.some(isName(name));
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  //console.log(body)

  if (!body.name || !body.number){
    return response.status(400).json({
      error:'content missing'
    })
  }

  if (containsName(body.name)){
    return response.status(400).json({
      error:'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  data = data.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data = data.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
