// src/App.js
import React, { useState, useEffect, useCallback} from 'react';
import EmployeeModal from '../components/EmployeeModal';
import { deleteEmployees, getClients, getEmployees } from '../services/API';
import EmployeeTable from '../components/EmployeeTable';
import { useGlobalData } from '../services/GlobalContext';


function EmployeeTracker() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
   const [clients, setClients] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
   const [isAdminOrManager, setIsAdminOrManager] = useState(false);
    const {  isAdmin, isManager, currentClientId } = useGlobalData();

  const fetchEmployees = useCallback(async () => {
    try {
      let employeeList = await getEmployees();
      if(isAdmin || isManager){
        setIsAdminOrManager(true)
      }
      if(employeeList){
        employeeList = employeeList.filter((employee) => employee.projectId.toString() === currentClientId.toString())
      }
      setEmployees(employeeList);
      setAllEmployees(employeeList);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  },[currentClientId, isAdmin, isManager]);

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
      setEmployees(allEmployees);
    } else {
      const filtered = allEmployees.filter(emp =>
        Object.values(emp)
          .some(value => String(value).toLocaleLowerCase().includes(term.toLocaleLowerCase()))
      );
      
      setEmployees(filtered);
    }
  };

  const handleDeleteEmp = async() => {
    if(!selectedEmployeeIds || selectedEmployeeIds.length === 0)return;
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
                    onClick={() => {setSearchTerm('');fetchEmployees()}}
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