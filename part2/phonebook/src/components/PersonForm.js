import React from 'react'
import { useState } from 'react'

const InputItem = ({text, value, handle}) => {
  return (
    <div>
    {text}:
    <input
      value={value}
      onChange={handle}
    />
    </div>
  )
}

const PersonForm = (props) => {
  const persons = props.persons
  const setPersons = props.setPersons

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
      event.preventDefault()

      if (containsName(newName)){
        window.alert(`${newName} is already added to phonebook`);
      } else {

      const personObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }

      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const isPerson = (p1) => (p2) => p1.name === p2.name

  const isName = (name) => (person) => name === person.name

  const containsName = (name) => {
    return persons.some(isName(name));
  }

  const containsPerson = (person) => {
    return persons.some(isPerson(person));
  }

  const handleMaker = (f) => (event) => {
    f(event.target.value)
  }

  return (
    <form onSubmit={addPerson}>
      <InputItem text='name' value={newName} handle={handleMaker(setNewName)}/>
      <InputItem text='number' value={newNumber} handle={handleMaker(setNewNumber)}/>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
