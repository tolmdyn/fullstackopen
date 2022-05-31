import React from 'react'
import { useState } from 'react'

import personService from '../services/persons'

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
  const showNotifcationMessage = props.showNotifcationMessage

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
      event.preventDefault()

      const personObject = {
        name: newName,
        number: newNumber
      }

      if (containsName(newName)){
        if (window.confirm(`${newName} already in phonebook, overwrite?`)){
          const id = persons.find(p => p.name === newName).id
          console.log(id);
          personService
            .update(id, personObject)
            .then(response => {
              setPersons(persons.filter(p => p.id !== id).concat(response))
              setNewName('')
              setNewNumber('')
              showNotifcationMessage(`${newName} modified`, 'message')
            })
            .catch(error =>{
              showNotifcationMessage(`${newName} has already been removed from the server`, 'error')
            })
        }
      } else {
        personService
          .create(personObject)
          .then(response => {
            setPersons(persons.concat(response))
            setNewName('')
            setNewNumber('')
            showNotifcationMessage(`${newName} added`, 'message')
          })
          .catch(error => {
            console.log(error.response.data.error)
            showNotifcationMessage(`${error.response.data.error}`, 'error')
          })
    }
  }

  //const isPerson = (p1) => (p2) => p1.name === p2.name

  const isName = (name) => (person) => name === person.name

  const containsName = (name) => {
    return persons.some(isName(name));
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
