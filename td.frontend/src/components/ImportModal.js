import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const ImportModal = (props) => {
 const {show, onClose, OnShow, title} = props;
 const [file, setFile] = useState(null);
  const clients = [{id:1,name:"Client One"}, {id:2, name:"Client Two"}, {id:3, name: "Client Three" } ]
  return (
    <>
      {/* <Button variant="primary" onClick={OnShow}>
        Open Modal
      </Button> */}

      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="clientSelect" className="form-label">Select Client</label>
            <select
              className="form-select"
              id="clientSelect"
              value={props.selectedClient}
              onChange={props.onClientChange}
            >
              <option value="">Choose a client...</option>
              {clients && clients.map(client => (
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
              accept=".xlsx, .xls"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => props.onFileChange(file)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImportModal;
