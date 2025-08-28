import React from 'react'
// import { useGlobalData } from '../services/GlobalContext';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const AddBookInCaseModal = ({show, onClose, labels}) => {

  const keys = Object.keys(labels);
  // const {allClients, currentClientId} = useGlobalData();
  // const clientName = allClients && currentClientId && allClients.find(client => client.id.toString() === currentClientId?.toString())?.name;
  
  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Add Book In Case</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {
            keys.map(key => {
              // const value = caseData[key];
              // const isDate = value && !isNaN(Date.parse(value)) && typeof value === 'string' && value.length >= 8;
              return (
                <Col md={4} key={key} className="mb-3">
                  <Form.Group controlId={key}>
                    {labels[key].type === "checkbox" ? (
                      <Form.Check type="switch" label={labels[key].label} className='pt-2' />
                    ) : (
                      <>
                        <Form.Label>
                          {labels[key].label}
                        </Form.Label>
                        <Form.Control
                          type={labels[key].type}
                      // value={
                      //   isDate
                      //     ? new Date(value).toISOString().slice(0, 10)
                      //     : key === 'project_id' ? clientName : value || ''
                      // }
                    />
                    </>)}
                  </Form.Group>
                </Col>
              );
            })}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={onClose}>
          Submit
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddBookInCaseModal