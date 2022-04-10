import React from 'react'

const Person = ({person}) => {
  return (
    <div>{person.name} {person.number}</div>
  )
}

const People = ({people}) => {
  return (
    <div>
      {people.map(p =>
        <Person key={p.id} person={p} />
      )}
    </div>
  )
}

export default People
