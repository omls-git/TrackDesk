// src/App.js
import React, { useState } from 'react';


function EmployeeTracker() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setModalIsOpen(true)}>Add Employee</button>
      
    </div>
  );
}

export default EmployeeTracker;
