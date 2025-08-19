import React from 'react'
import { useGlobalData } from '../services/GlobalContext';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const AddBookInCaseModal = ({show, onClose}) => {
  const labels = 
  {
    // "SL.No": "",
    "OM ID": "text",
    "IRD/FRD": "date",
    "CASE IS FROM": "text",
    "Subject line": "text",
    "Title of the article": "text",
    "Assigned to": "text",
    "Book in Receipt date": "date",
    "Due date": "date",
    "Completed date": "date",
    "Initial/Follow-up": "text",
    "Book-in status": "text",
    "No.of cases created": "number",
    "Days Open": "number",
    "TAT date": "date",
    "Allocation Received on": "date",
    "Case ID": "text",
    "COI": "text",
    "SDEA Obligation": "text",
    "Suspect drug": "text",
    "Event": "text",
    "Comment": "text",
    "Seriousness (fatal/Life threatining)": "text",
    "LOE": "text",
    "PQC": "text",
    "Open Workflow": "text"
  }

  const keys = Object.keys(labels);
  const {allClients, currentClientId} = useGlobalData();
  const clientName = allClients && currentClientId && allClients.find(client => client.id.toString() === currentClientId?.toString())?.name;
  console.log(clientName);
  
  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Add Book In Case</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {
            keys.map(key => {
              if (key === 'createdAt' || key === 'updatedAt' || key === 'assignedToId' || key === 'createdBy' || key === 'createdOn' || key === 'updatedBy' || key === 'modifiedBy' || key === 'modifiedOn' || key === 'id'
              ) return null; // Skip id and caseNumber
              // const value = caseData[key];
              // const isDate = value && !isNaN(Date.parse(value)) && typeof value === 'string' && value.length >= 8;
              return (
                <Col md={4} key={key} className="mb-3">
                  <Form.Group controlId={key}>
                    <Form.Label>
                      {key}
                    </Form.Label>
                    <Form.Control
                      type={labels[key]}
                      // value={
                      //   isDate
                      //     ? new Date(value).toISOString().slice(0, 10)
                      //     : key === 'project_id' ? clientName : value || ''
                      // }
                    />
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