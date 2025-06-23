// src/App.js
import React, { useState, useEffect} from 'react';
import EmployeeModal from '../components/EmployeeModal';
import { deleteEmployees, getClients, getEmployees } from '../services/API';
import EmployeeTable from '../components/EmployeeTable';


function EmployeeTracker() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
   const [clients, setClients] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);

  const fetchEmployees = async () => {
    try {
      const employeeList = await getEmployees();
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

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term);
    if (term.trim() === "") {
      fetchEmployees();
    } else {
      const filtered = employees.filter(emp =>
        Object.values(emp)
          .some(value => String(value).toLocaleLowerCase().includes(term))
      );
      setEmployees(filtered);
    }
  };

  const handleDeleteEmp = async() => {
    await deleteEmployees(selectedEmployeeIds);
    setSelectedEmployeeIds([]);
    await fetchEmployees()
  }

  const handleCloseModal = async() =>{
    await fetchEmployees()
   setModalIsOpen(false)
  }

  return (
        <div>            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' }}>              
              <input
                type="text"
                placeholder="Search employees..."
                 className="form-control"
                value={searchTerm}
                onChange={handleSearch}
                style={{ flex: 1, marginRight: '16px', maxWidth: '300px', paddingRight: '30px' }}
                />
                {searchTerm && (
                  <span
                    onClick={() => setSearchTerm('')}
                    style={{
                      position: 'relative',
                      right: '40px',
                      cursor: 'pointer',
                      color: '#aaa',
                      fontWeight: 'bold',
                      fontSize: '20px',
                      zIndex: 2,
                      userSelect: 'none'
                    }}
                    aria-label="Clear search"
                    tabIndex={0}
                    role="button"
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSearchTerm('')}
                  >
                    ×
                  </span>
                )}
              
              <button className="btn btn-success" onClick={() => setModalIsOpen(true)}>Add Employee</button>
              <button className="btn btn-danger" style={{ marginLeft: 'auto'}} onClick={handleDeleteEmp}>
                Delete {selectedEmployeeIds.length ?'('+ selectedEmployeeIds.length + ')' : ''}
              </button>
            </div>
            <EmployeeTable data={employees} clients={clients} 
            refreshData={fetchEmployees} 
            selectedEmployeeIds={selectedEmployeeIds} 
            setSelectedEmployeeIds={setSelectedEmployeeIds} />
            {/* Show Modal if modalIsOpen is true */}
            {modalIsOpen && (
                <EmployeeModal
                    show={modalIsOpen}
                    onClose={handleCloseModal}
                    onSave={handleEmployeeSave}
                    clients={clients}
                />
            )}
        </div>
    );
}

export default EmployeeTracker;