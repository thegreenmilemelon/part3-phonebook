import React, { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import personObject from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [filterValue, setFilterValue] = useState("");
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const [notification, setNotification] = useState({
    message: null,
    msgClassName: null,
  });

  useEffect(() => {
    personObject.getAll().then((response) => {
      console.log("response is ", response);
      setPersons(response);
    });
  }, []);

  const handleFilter = (event) => {
    setFilterValue(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleNotification = (message, msgClassName) => {
    setNotification({ message, msgClassName });
    setTimeout(() => {
      setNotification({ message: null, msgClassName: null });
    }, 3000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    const existingNumber = persons.find(
      (person) => person.number === newNumber
    );

    if (existingPerson && existingNumber) {
      const message = `${newName} is already added to phonebook`;
      handleNotification(message, "error");
      return;
    }

    if (existingPerson) {
      if (existingPerson.number !== newNumber) {
        if (
          window.confirm(
            `${newName} is already added to phonebook, replace the old number with the new one?`
          )
        ) {
          personObject
            .update(existingPerson.id, { ...existingPerson, number: newNumber })
            .then((response) => {
              setPersons(
                persons.map((person) =>
                  person.id !== existingPerson.id ? person : response
                )
              );
              setNewName("");
              setNewNumber("");

              const message = `${newName} was updated with new number`;
              handleNotification(message, "success");
            })
            .catch((error) => {
              const updatedPerson = persons.filter(
                (person) => person.id !== existingPerson.id
              );
              setPersons(updatedPerson);
              setNewName("");
              setNewNumber("");
              const message = `${newName} was not found in the phonebook`;
              handleNotification(message, "error");
            });
          return;
        }
      }
    }

    personObject
      .create(newPerson)
      .then((response) => {
        setPersons([...persons, response]);
        setNewName("");
        setNewNumber("");

        const message = `${newName} was added to phonebook`;
        handleNotification(message, "success");
      })
      .catch((error) => {
        console.log("frontend error ", error.response.data);
        const message = "error.response.data.error";
        handleNotification(message, "error");
      });
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterValue.toLowerCase())
  );

  const handleDestroyPerson = (id) => {
    const person = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personObject.destroy(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  useEffect(() => {
    console.log(`persons`, persons);
  }, [persons]);

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification
        message={notification.message}
        msgClassName={notification.msgClassName}
      />

      <Filter value={filterValue} onChange={handleFilter} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        onSubmit={handleSubmit}
      />
      <Persons
        persons={filteredPersons}
        onDestroyPerson={handleDestroyPerson}
      />
    </div>
  );
};

export default App;
