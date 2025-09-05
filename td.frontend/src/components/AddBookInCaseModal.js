import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

const AddBookInCaseModal = ({show, onClose, labels, tab, onSubmit}) => {

  const keys = Object.keys(labels);
  const [formData, setFormData] = React.useState({"XML_Non_XML": tab});

  const handleChange = (key, value, dataType) => { 
    setFormData(prev => ({ ...prev, [key]: value }));    
  };

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
                labels[key].hide ? null :
                <Col md={4} key={key} className="mb-3">
                  <Form.Group controlId={key}>
                    {labels[key].type === "checkbox" ? (
                      <Form.Check type="switch" label={labels[key].label} className='pt-2' onChange={(e) => handleChange(key, e.target.checked, labels[key].type)} />
                    ) : (
                      <>
                        <Form.Label>
                          {labels[key].label}
                        </Form.Label>
                        <Form.Control
                          as={labels[key].type === 'textarea' ? 'textarea' : 'input'}
                          rows={labels[key].type === 'textarea' ? 1 : undefined}
                          type={labels[key].type}
                          value={formData[key] || ''}
                          onChange={(e) => handleChange(key, e.target.value, labels[key].type)}
                        />
                    </>)}
                  </Form.Group>
                </Col>
              );
            })}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => onSubmit(formData)}>
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