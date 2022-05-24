const mongoose = require('mongoose')


if (process.argv.length < 2) {
  console.log('Please provide the password as an argument: node mongo.js <password>')

  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://tolmdyn:${password}@cluster0.p5lkg.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3){
  mongoose.connect(url)

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
    process.exit(1)
  })
} else if (process.argv.length == 5) {
  mongoose.connect(url)
  const name = process.argv[3]
  const number = process.argv[4]

  console.log(name, number);

  const person = new Person({
    name,
    number
  })

  person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
    process.exit(1)
  })
} else {
    console.log('Please provide correct number of arguments: <password> OR <password> <name> <number>')
}
