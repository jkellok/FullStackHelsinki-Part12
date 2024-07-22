import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationClassName, setNotificationClassName] = useState('notification')

  useEffect(() => {
    personService
      .getAll()
      .then(initialData => {
        setPersons(initialData)
        setFilteredPersons(initialData)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()

    function nameExists() {
      // some() iterative method, return true if (at least) one element passes the test
      const nameExists = (person) => person.name === newName
      return persons.some(nameExists)
    }
    // if newName exists already in persons, alert
    // change number of already existing person
    if (nameExists() === true) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        // find right person object and change number property
        const person = persons.find(p => p.name === newName)
        console.log("person found", person)
        const changedPerson = { ...person, number: newNumber }
        // put changedPerson with updated number to server
        personService
          .replaceNumber(person.id, changedPerson)
          .then(returnedPerson => {
            console.log("returned person", returnedPerson)
            const updatedPersons = persons.map(p => p.id !== person.id ? p : returnedPerson)
            setPersons(updatedPersons)
            setFilteredPersons(updatedPersons)
            setSearchValue('')
            setNotificationMessage(`The number of ${newName} was updated`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(error => {
            setNotificationMessage(`Information of ${newName} has already been removed from server`)
            setNotificationClassName('notification-error') // set classname so we can change style used
            setTimeout(() => {
              setNotificationMessage(null)
              setNotificationClassName('notification')
            }, 5000)
            const updatedPersons = persons.filter(p => p.id !== person.id)
            setPersons(updatedPersons)
            setFilteredPersons(updatedPersons)
          })
      }
    }
    // if newName doesn't exist in persons, add it
    else {
      const personObject = {
        name: newName,
        number: newNumber,
        //id: persons.length + 1,
        }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          // update filteredPersons too and empty search input
          // otherwise adding a person does not update filtered persons and would not be rendered
          setSearchValue('')
          setFilteredPersons(persons.concat(returnedPerson))
          setNotificationMessage(`${newName} was added to phonebook`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          // show error message if validation failed when adding person
          setNotificationMessage(error.response.data.erorr) // mongoose error message
          setNotificationClassName('notification-error') // set classname so we can change style used
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationClassName('notification')
          }, 5000)
        })
    }
  }

  const deletePersonOf = (id) => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then((returnedPerson) => {
          console.log("deleted", returnedPerson)
          // set persons states without the deleted one
          const personsAfterDeletion = persons.filter(person => person.id !== id)
          setPersons(personsAfterDeletion)
          setFilteredPersons(personsAfterDeletion)
          setSearchValue('')
          setNotificationMessage(`${person.name} was deleted from phonebook`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearchValue(event.target.value)
    // searchValue lags one character behind so using event.target.value better for filtering
    console.log("searchvalue", searchValue)
    // return Object.values(person).join('').toLowerCase().incl... to search by every property
    const filtering = persons.filter(person => {
      if (event.target.value === "") return persons // if search empty, return all persons
      return person.name.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setFilteredPersons(filtering)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} notificationClassName={notificationClassName} />
      <Filter searchValue={searchValue} handleSearchChange={handleSearchChange} />
      <h1>Add a new person</h1>
      <PersonForm addPerson={addPerson} searchValue={searchValue} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h1>Numbers</h1>
      <div>
        {filteredPersons.map(person =>
          <Person
            person={person.name}
            number={person.number}
            key={person.id}
            deletePerson={() => deletePersonOf(person.id)}
          />
          )}
      </div>
    </div>
  )
}

export default App