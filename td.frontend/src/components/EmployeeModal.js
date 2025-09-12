import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { getUsers } from '../services/GraphApi';
import { postEmployee } from '../services/API';
import { useGlobalData } from '../services/GlobalContext';
import { CV } from '../commonVariables/Variables';

const EmployeeModal = ({ show, onClose, clients }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { loggedUserName, currentClientId, isAdmin, isCipla } = useGlobalData();
  const [selectedClientId, setSelectedClientId] = useState(currentClientId || '');
  const [selectedLevel, setSelectedLevel] = useState('None');
  const [selectedPermission, setSelectedPermission] = useState('User');
  const [asignTriage, setAsignTriage] = useState(false)

  const clientOptions = clients;
  const levelOptions = isCipla ? CV.rolesOptionsCipla.map(option => option.value) : CV.rolesOptions.map(option => option.value);
  const permissionOptions = ['Admin', 'Manager', 'User'];

  useEffect(() => {
    const fetchUsers = async () => {
      const graphUsers = await getUsers();
      setUsers(graphUsers);
      setFilteredUsers(graphUsers);
    };

    if (show) fetchUsers();
  }, [show]);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filtered = users.filter(user =>
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, users]);

  const handleSave = async () => {
    if (!selectedUser) {
      alert('Please select an employee.');
      return;
    }

    const employeeData = {
      username: selectedUser.displayName,
      email: selectedUser.mail,
      projectId: selectedClientId,
      level: selectedLevel,
      assignTriage: asignTriage,
      permission: selectedPermission,
      createdBy: loggedUserName
    };
    
    try {
      await postEmployee(employeeData);
      onClose();
      alert('Employee saved successfully!');      
    } catch (error) {
      console.error('Error saving employee:', error);
      if(error.status === 409){
        const client = clients.find(c => c.id.toString() === selectedClientId.toString())
        alert(`${employeeData?.username} is already associated with ${client.name}!`);
      }else{
      alert('Failed to save employee.');
      }      
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.displayName); // Show the selected user's name in the input
    setFilteredUsers([]); // Hide suggestions after selection
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* People Picker */}
        <Form.Group className="mb-3">
          <Form.Label>Search Employee <span style={{color: 'red'}}>*</span></Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedUser(null); // Reset selected user if typing again
            }}
            autoComplete="off"
            required
            isInvalid={!selectedUser && searchQuery !== ''}
          />
          {/* Suggestions List */}
          {searchQuery && filteredUsers.length > 0 && !selectedUser && (
            <ListGroup style={{ maxHeight: '150px', overflowY: 'auto', cursor: 'pointer' }}>
              {filteredUsers.map(user => (
                <ListGroup.Item key={user.id} onClick={() => handleUserSelect(user)}>
                  {user.displayName}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <Form.Control.Feedback type="invalid">
            Please select an employee.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Client Dropdown */}
        {
          isAdmin ?
        <Form.Group className="mb-3">
          <Form.Label>Client <span style={{color: 'red'}}>*</span></Form.Label>
          <Form.Select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            required
            isInvalid={selectedClientId === ''}
          >
            <option value="">Choose a client...</option>
            {clientOptions.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please select a client.
          </Form.Control.Feedback>
        </Form.Group> : null
        }
        <Form.Group className="mb-3">
          <Form.Label>Role <span style={{color: 'red'}}>*</span></Form.Label>
          <Form.Select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            required
            isInvalid={selectedLevel === ''}
          >
            <option value="">Choose a role...</option>
            {levelOptions.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please select a role.
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Permission <span style={{color: 'red'}}>*</span></Form.Label>
          <Form.Select
            value={selectedPermission}
            onChange={(e) => setSelectedPermission(e.target.value)}
            required
            isInvalid={selectedPermission === ''}
          >
            <option value="">Choose a permission...</option>
            {permissionOptions.map(permission => (
              <option key={permission} value={permission}>
                {permission}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please select a permission.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3 bg-light p-2 border rounded">
          <Form.Check
            type="switch"
            id="checkbox-triage"
            label="Assign Triage cases"
            checked={asignTriage}
            onChange={() => setAsignTriage(!asignTriage)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={
            !selectedUser ||
            !selectedClientId ||
            !selectedLevel ||
            !selectedPermission
          }
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeModal;
