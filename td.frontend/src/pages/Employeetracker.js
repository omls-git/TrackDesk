// src/App.js
import React, { useState, useEffect} from 'react';
import EmployeeModal from '../components/EmployeeModal';
import EmployeeTable from '../components/EmployeeTable';
import { getClients, getEmployees } from '../services/API';


function EmployeeTracker() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
   const [clients, setClients] = useState([]);


  const fetchEmployees = async () => {
    try {
      const employeeList = await getEmployees();
      console.log('Fetched employees:', employeeList);
      setEmployees(employeeList);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {    
     async function fetchClients() {
      const fetchedClients = await getClients();
      setClients(fetchedClients);
      fetchEmployees();
    }
    fetchClients();
  }, []);

  const handleEmployeeSave = () => {
    fetchEmployees(); // Refresh table data
    setModalIsOpen(false); // Close modal after saving
  };


  return (
        <div>
            <button onClick={() => setModalIsOpen(true)}>Add Employee</button>
            <EmployeeTable data={employees} clients={clients} />
            {/* Show Modal if modalIsOpen is true */}
            {modalIsOpen && (
                <EmployeeModal
                    show={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}
                    onSave={handleEmployeeSave}
                />
            )}
        </div>
    );
}

export default EmployeeTracker;