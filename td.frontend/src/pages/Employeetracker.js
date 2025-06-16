// src/App.js
import React, { useState } from 'react';
import EmployeeModal from '../components/EmployeeModal';


function EmployeeTracker() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
        <div className="App">
            <button onClick={() => setModalIsOpen(true)}>Add Employee</button>

            {/* Show Modal if modalIsOpen is true */}
            {modalIsOpen && (
                <EmployeeModal
                    show={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}
                />
            )}
        </div>
    );
}

export default EmployeeTracker;