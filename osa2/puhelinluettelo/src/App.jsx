import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    if (persons.filter(person => person.name == nameObject.name).length == 0) {
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    } else {
      alert(`${nameObject.name} is already added to phonebook`)
    }  
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const personsleft = newSearch.length == 0 ? persons : persons.filter(person => person.name.includes(newSearch))

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter newSearch={newSearch} handler={handleSearchChange} />
      
      <h2>Add new</h2>

      <PersonForm nameval={newName} namehandl={handleNameChange} numval={newNumber} numhandl={handleNumberChange} adder={addName} />

      <h2>Numbers</h2>

      <PersonList personlist={personsleft} />
    </div>
  )

}

export default App