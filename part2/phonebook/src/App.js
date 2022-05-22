import { useState, useEffect } from 'react'

import People from './components/People'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/persons'

const App = (props) => {
  const [persons, setPersons] = useState([])
  const [filter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({text:null, style:'message'})

  const handleMaker = (f) => (event) => {
    f(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const removePerson = (id) => {
    const p = persons.find(p=> p.id === id)

    //confirm?
    if (window.confirm("Delete entry?")){
      console.log("remove", id, p)
      personService.deletePerson(id).then(returnedPerson => { //update the persons state to not show removed
        setPersons(persons.filter(person => person.id !== id)) //could also repull the data from the server instead
        showNotifcationMessage(`${p.name} removed from list`, 'message')
      })
    }
  }

  const showNotifcationMessage = (text, style) => {
    setNotificationMessage({text, style})
    setTimeout(() => {
      setNotificationMessage({text:null, style:'message'})
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter filter={filter} handle={handleMaker(setNewFilter)}/>

      <h2>Add new</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
        showNotifcationMessage={showNotifcationMessage}
      />

      <h2>People</h2>
        <People people={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App
