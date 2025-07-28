import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ImportModal = (props) => {
 const {show, onClose, title} = props;
 const [file, setFile] = useState(null); 
  const [error, setError] = useState('');
  const [warnMessage, setWarnMessage] = useState('');

  const handleConfirm = async () => {
    if (!props.selectedClient || !file) {
      setError('Please select a client and upload a file.');
      return;
    }
    setError('');
    setWarnMessage('Cases allocation is in progress. Please wait...');
    await props.onFileChange(file);
    handleClose()
    setWarnMessage('');
  };

  const handleClose =() => {
    setError('');
    props.onSelect()
    setFile(null)
    onClose();
  }


  return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="clientSelect" className="form-label">Select Client</label>
            <select
              className="form-select"
              id="clientSelect"
              value={props.selectedClient}
              onChange={props.onSelect}
            >
              <option value="">Choose a client...</option>
              {props.clients && props.clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="excelFile" className="form-label">{title}</label>
            <input
              type="file"
              className="form-control"
              id="excelFile"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>  
          {warnMessage && (
            <div className="alert alert-info" role="alert">
              {warnMessage}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default ImportModal;
