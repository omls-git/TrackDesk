// src/App.js
import React, { useState, useEffect, useCallback} from 'react';
import EmployeeModal from '../components/EmployeeModal';
import { deleteEmployees, getClients, getEmployees } from '../services/API';
import EmployeeTable from '../components/EmployeeTable';
import { useGlobalData } from '../services/GlobalContext';


function EmployeeTracker() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
   const [clients, setClients] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
   const [isAdminOrManager, setIsAdminOrManager] = useState(false);
    const { loggedUserName } = useGlobalData();

  const fetchEmployees = useCallback(async () => {
    try {
      const employeeList = await getEmployees();
      const userDetails = employeeList.find((item) => item.username === loggedUserName);
      if(userDetails?.permission.trim() === "Admin" || userDetails?.permission.trim() === "Manager"){
        setIsAdminOrManager(true)
      }
      setEmployees(employeeList);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  },[loggedUserName]);

  useEffect(() => {    
     async function fetchClients() {
      const fetchedClients = await getClients();
      setClients(fetchedClients);
      fetchEmployees();
    }
    fetchClients();
  }, [fetchEmployees]);

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
              {
                isAdminOrManager ? 
              <button className="btn btn-success" onClick={() => setModalIsOpen(true)}>Add Employee</button> : null
              }
              {
                isAdminOrManager ? 
              <button className="btn btn-danger" style={{ marginLeft: 'auto'}} onClick={handleDeleteEmp}>
                Delete {selectedEmployeeIds.length ?'('+ selectedEmployeeIds.length + ')' : ''}
              </button> : null
              }
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