import { useState } from 'react'


const TopAnecdote = (props) => {
  let top = 0

  for (let i = 0; i < props.votes.length; i++){
    if (props.votes[i] > props.votes[top]){
      top = i
    }
  }
  
  return (
    <div>
      {props.anecdotes[top]}
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const updateVotes = (item) => {
    let new_votes = [...votes]
    new_votes[item]++
    setVotes(new_votes)
  }

  return (
    <div>
      <h1> Anecdote of the day </h1>
      {anecdotes[selected]}
      <br/>
      <p> Has {votes[selected]} votes. </p>
      <button onClick={() => {updateVotes(selected)}}>
        vote
      </button>
      <button onClick={() => {setSelected(Math.floor(Math.random() * anecdotes.length))}}>
        next anecdote
      </button>
      <br/>
      <h1> Anecdote with the most votes </h1>
      <TopAnecdote votes={votes} anecdotes={anecdotes}/>
    </div>
  )
}

export default App
