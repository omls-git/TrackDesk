// src/App.js
import React, { useState } from 'react';
import EmployeePermissionModal from './Employee';

function EmployeeTracker() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setModalIsOpen(true)}>Add Employee</button>
      <EmployeePermissionModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
    </div>
  );
}

export default EmployeeTracker;
