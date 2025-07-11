import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorState, setErrorState] = useState(false)

  useEffect(() => {
    console.log("Effect")
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        console.log(initialPersons)
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')
  console.log(persons)

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    if (persons.filter(person => person.name == nameObject.name).length == 0) {
      personService.create(nameObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
          setErrorMessage(`Added ${newPerson.name}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    } else {
      const person = persons.find(p => p.name === nameObject.name) 
      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...person, number: nameObject.number }
        personService.update(changedPerson.id, changedPerson)
          .then(updated => {
            setPersons(persons.filter(p => p.id !== updated.id).concat(updated))
            setNewName('')
            setNewNumber('')
            setErrorMessage(`${changedPerson.name} number updated`)
            setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
          }
          )
      }
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

  const handlePersonRemoval = (id) => {
    const person = persons.find(p => p.id === id)
     if (window.confirm(`Delete ${person.name}?`)) {
        personService.remove(person.id)
          .catch( () => {
            setErrorState(true)
            setErrorMessage(`${person.name} already deleted`)
            setTimeout( () => {
              setErrorMessage(null)
              setErrorState(false)
            }, 5000)
          }

        )
        setPersons(persons.filter(p => p.id !== person.id))
        setErrorMessage(`Deleted ${person.name}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
  }
  const personsleft = newSearch.length == 0 ? persons : persons.filter(person => person.name.includes(newSearch))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} error={errorState} />

      <Filter newSearch={newSearch} handler={handleSearchChange} />
      
      <h2>Add new</h2>

      <PersonForm nameval={newName} namehandl={handleNameChange} numval={newNumber} numhandl={handleNumberChange} adder={addName} />

      <h2>Numbers</h2>

      <PersonList personlist={personsleft} remove={handlePersonRemoval } />
    </div>
  )

}

export default App