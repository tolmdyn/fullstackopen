import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={() => {props.action(props.value + 1)}}>
    {props.text}
    </button>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  let total = props.good + props.neutral + props.bad
  let average = (props.good + (props.bad*-1)) / total
  let positive = (props.good / total) * 100

  if (total == 0){
    return (
      <div> No feedback given. </div>
    )
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine text="good" value ={props.good} />
          <StatisticLine text="neutral" value ={props.neutral} />
          <StatisticLine text="bad" value ={props.bad} />
          <StatisticLine text="total" value ={total} />
          <StatisticLine text="average" value ={average} />
          <StatisticLine text="positive" value ={positive} />
        </tbody>
      </table>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
    <h1> Give Feedback! </h1>
    <Button text="good" value={good} action={setGood} />
    <Button text="neutral" value={neutral} action={setNeutral} />
    <Button text="bad" value={bad} action={setBad} />

    <h1>Statistics</h1>
    <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
