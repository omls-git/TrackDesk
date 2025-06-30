import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { createdNameDate } from '../Utility';

const AddClientModal = ({ isOpen, onClose, onSubmit, errorMssg }) => {
  const [clientName, setClientName] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (clientName.trim()) {
      onSubmit(createdNameDate({name:clientName.trim()}))
      setClientName('');   
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Client</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="form-control"
            autoFocus
            required
          />
          {errorMssg && (
            <div className="alert alert-danger mt-1" role="alert">
              {errorMssg}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddClientModal;
