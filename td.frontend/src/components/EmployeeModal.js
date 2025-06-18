import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getUsers } from '../services/GraphApi';
import { postEmployee } from '../services/API';

const EmployeeModal = ({ show, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('');

  const clientOptions = [
    { id: 1, name: "Client One" },
    { id: 2, name: "Client Two" },
    { id: 3, name: "Client Three" }
  ];
  const levelOptions = ['Data Entry', 'Quality Review', 'Medical Review'];
  const permissionOptions = ['Admin', 'Manager', 'User'];

  useEffect(() => {
    const fetchUsers = async () => {
      const graphUsers = await getUsers();
      setUsers(graphUsers);
    };

    if (show) fetchUsers();
  }, [show]);

  const handleSave = async () => {
    const selectedUser = users.find(user => user.id === selectedUserId);
    const employeeData = {
      username: selectedUser.displayName,
      email: selectedUser.mail,
      projectId: selectedClientId,
      level: selectedLevel,
      permission: selectedPermission
    };

    try {
      await postEmployee(employeeData);
      alert('Employee saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee.');
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Employee Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Select Employee</Form.Label>
          <Form.Select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">Choose an employee...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.displayName} 
                {/* ({user.mail}) */}
              </option>
            ))}
          </Form.Select>
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
