import { useState, useEffect } from 'react'
import './App.css'



function App() {
  const [countries, setCountries] = useState([])
  const [ search, setSearch ] = useState('')



  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const filteredCountries = countries.filter( country => country.official.includes(search))
  return (
    <div>
      Hello!
    </div>
  )
}

export default App
