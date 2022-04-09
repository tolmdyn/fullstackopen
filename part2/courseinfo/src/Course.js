import React from 'react'

const Header = (props) => (
  <h1>{props.course}</h1>
)

const Content = (props) => (
  <div>
  {props.parts.map(part =>
    <ul key={part.id}>
      <Part part={part} />
    </ul>
  )}
  </div>
)

const Part = ({part}) => {
  return (
    <li>
    {part.name} {part.exercises}
    </li>
  )
}

const Total = ({parts}) => {
  let sum = 0
  const total = parts.reduce((s, p) => s + p.exercises
    ,sum
    )

  return (
      <b>Number of exercises {total}</b>
  )
}

const Course = ({courses}) => {
  return (
    <div>
    {courses.map(course =>
      <div key={course.id}>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )}
    </div>
  )
}

export default Course
