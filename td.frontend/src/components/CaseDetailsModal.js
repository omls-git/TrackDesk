import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { useGlobalData } from '../services/GlobalContext';

const CaseDetailsModal = ({ show, onClose, caseData }) =>{

  const keys = Object.keys(caseData || {});
 const {allClients} = useGlobalData();
 const clientName = allClients.find(client => client.id.toString() === caseData?.project_id?.toString())?.name || 'Unknown Client';
  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Case Details :- {caseData?.caseNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {
            keys.map(key => {
              if (key === 'createdAt' || key === 'updatedAt' || key === 'assignedToId' || key === 'createdBy' || key === 'createdOn' || key === 'updatedBy' || key === 'modifiedBy' || key === 'modifiedOn' || key === 'id'
              ) return null; // Skip id and caseNumber
              const value = caseData[key];
              const isDate = value && !isNaN(Date.parse(value)) && typeof value === 'string' && value.length >= 8;
              return (
                <Col md={4} key={key} className="mb-3">
                  <Form.Group controlId={key}>
                    <Form.Label>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Form.Label>
                    <Form.Control
                      type={isDate ? "date" : "text"}
                      value={
                        isDate
                          ? new Date(value).toISOString().slice(0, 10)
                          : key === 'project_id' ? clientName : value || ''
                      }
                      readOnly
                    />
                  </Form.Group>
                </Col>
              );
            })}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CaseDetailsModal;