import React from 'react'

const Person = ({person, removePerson}) => {
  return (
    <li className='person'>
      {person.name} {person.number}
      <button onClick={removePerson}>Remove</button>
    </li>
  )
}

const People = ({people, removePerson}) => {
  return (
    <div>
      {people.map(p =>
        <Person key={p.id} person={p} removePerson={() => removePerson(p.id)}/>
      )}
    </div>
  )
}

export default People
