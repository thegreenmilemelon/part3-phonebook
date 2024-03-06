const PersonForm = ({
  newName,
  newNumber,
  onNameChange,
  onNumberChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <h3>Add a new</h3>
    <div>
      <label htmlFor="name">Name:</label>
      <input id="name" value={newName} onChange={onNameChange} min={3} />
    </div>
    <div>
      <label htmlFor="number">Phone Number:</label>
      <input
        id="number"
        type="text"
        value={newNumber}
        onChange={onNumberChange}
      />
    </div>
    <button type="submit">Add</button>
  </form>
);

export default PersonForm;
