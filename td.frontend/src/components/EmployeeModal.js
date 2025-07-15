import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { getUsers } from '../services/GraphApi';
import { postEmployee } from '../services/API';
import { useGlobalData } from '../services/GlobalContext';

const EmployeeModal = ({ show, onClose, clients }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { loggedUserName, currentClientId } = useGlobalData();
  const [selectedClientId, setSelectedClientId] = useState(currentClientId || '');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('');

  const clientOptions = clients;
  const levelOptions = ['Data Entry', 'Quality Review', 'Medical Review'];
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
      permission: selectedPermission,
      createdBy: loggedUserName
    };

    try {
      await postEmployee(employeeData);
      onClose();
      alert('Employee saved successfully!');      
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee.');
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
          <Form.Label>Search Employee</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedUser(null); // Reset selected user if typing again
            }}
            autoComplete="off"
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
        </Form.Group>

        {/* Client Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Client</Form.Label>
          <Form.Select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
            <option value="">Choose a client...</option>
            {clientOptions.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Level Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Level</Form.Label>
          <Form.Select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
            <option value="">Choose a level...</option>
            {levelOptions.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Permission Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Permission</Form.Label>
          <Form.Select value={selectedPermission} onChange={(e) => setSelectedPermission(e.target.value)}>
            <option value="">Choose a permission...</option>
            {permissionOptions.map(permission => (
              <option key={permission} value={permission}>
                {permission}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeModal;
