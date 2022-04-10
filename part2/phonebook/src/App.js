import { useState } from 'react'

import People from './components/People'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'

const App = (props) => {
  const [persons, setPersons] = useState(props.persons)
  const [filter, setNewFilter] = useState('')

  const handleMaker = (f) => (event) => {
    f(event.target.value)
  }

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handle={handleMaker(setNewFilter)}/>

      <h2>Add new</h2>
      <PersonForm
        persons={persons}
        setPersons={setPersons}
      />

      <h2>People</h2>
        <People people={personsToShow} />
    </div>
  )
}

export default App
