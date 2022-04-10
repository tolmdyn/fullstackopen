import React from 'react'

const Filter = ({filter, handle}) => {
  return (
    <div>
      filter shown:
      <input
        value={filter}
        onChange={handle}
        />
    </div>
  )
}

export default Filter
