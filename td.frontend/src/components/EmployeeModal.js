import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// import { getUsers } from '../services/GraphApi';

const EmployeeModal = ({ show, onClose, onSave }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      // const graphUsers = await getUsers();
      // setUsers(graphUsers);
    };

    if (show) fetchUsers();
  }, [show]);

  const handleSave = () => {
    onSave({ user: selectedUser });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
