import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getUsers } from '../services/GraphApi';

const EmployeeModal = ({ show, onClose, onSave }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('');

  const clientOptions = ['Client 1', 'Client 2', 'Client 3'];
  const levelOptions = ['Data Entry', 'Quality Review','Medical Review'];
  const permissionOptions = ['Admin', 'Manager', 'User'];

  useEffect(() => {
    const fetchUsers = async () => {
      const graphUsers = await getUsers();
      setUsers(graphUsers);
    };

    if (show) fetchUsers();
  }, [show]);

  const handleSave = () => {
    onSave({
      user: selectedUser,
      client: selectedClient,
      level: selectedLevel,
      permission: selectedPermission
    });
    onClose();
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
          <Form.Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Choose an employee...</option>
            {users.map(user => (
              <option key={user.id} value={user.displayName}>
                {user.displayName} ({user.mail})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Client Dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Client</Form.Label>
          <Form.Select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
            <option value="">Choose a client...</option>
            {clientOptions.map(client => (
              <option key={client} value={client}>
                {client}
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
