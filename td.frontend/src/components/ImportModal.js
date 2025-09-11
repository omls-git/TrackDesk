import React, { useState } from 'react';
import { Modal, Button, FormGroup } from 'react-bootstrap';

const ImportModal = (props) => {
 const {show, onClose, title, selectedClient, onFileChange, onSelect, clients,fetchMails } = props;
 const [file, setFile] = useState(null); 
  const [error, setError] = useState('');
  const [warnMessage, setWarnMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString())

  const handleConfirm = async () => {
    if(selectedDate && title === 'non-xml'){
      setError('');
      setWarnMessage('Cases allocation is in progress. Please wait...');
      const date = new Date(selectedDate.split('T')[0]).toISOString()
      await fetchMails(date)
      handleClose()          
      setWarnMessage('')
    } else{
      if (!selectedClient || !file) {
        setError('Please select a file.');
        return;
      }
      setError('');
      setWarnMessage('Cases allocation is in progress. Please wait...');
      await onFileChange(file);
      handleClose()
      setWarnMessage('');
    }
  };

  const handleClose =() => {
    setError('');
    onSelect()
    setFile(null)
    onClose();
  }
  
  return (
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{title  === 'non-xml' ? 'Fetch Emails and Assign' : title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {title === 'non-xml' ? 
          <FormGroup>
            <label htmlFor="date" className="form-label">Select a Date</label>
            <input
              type="date"
              id="date"
              className="form-control mb-3"
              value={selectedDate ? selectedDate.split('T')[0] : ''}
              onChange={(e) =>{ 
                if(e.target.value){
                setSelectedDate(new Date(e.target.value).toISOString())
                console.log(new Date(e.target.value).toISOString())
              }
              }}
            />
          </FormGroup> :
          <>
          {
            selectedClient ? null :
          <div className="mb-3">
            <label htmlFor="clientSelect" className="form-label">Select Client</label>
            <select
              className="form-select"
              id="clientSelect"
              value={selectedClient}
              onChange={onSelect}
            >
              <option value="">Choose a client...</option>
              {clients && clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        }
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
          </>}
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
            {title === 'non-xml' ? 'Fecth and assign' : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default ImportModal;
