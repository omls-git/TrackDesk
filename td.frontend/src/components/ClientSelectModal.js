import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useGlobalData } from '../services/GlobalContext';

function ClientSelectModal({ open, onClose, onSelect }) {
  
  const {allClients, currentClientId} = useGlobalData(); 

  return (
      <Offcanvas 
        show={open} 
        onHide={onClose} 
        placement="start" 
        style={{ width: '320px', maxWidth: '80vw' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Select a Client</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {
              allClients.map((client) => (
                <Button
                  key={client.id}
                  variant="outline-primary"
                  style={{ textAlign: 'left' }}
                  onClick={() => onSelect(client.id)}
                  className="w-100"
                  active={currentClientId.toString() === client.id.toString()}
                >
                  {client.name}
                </Button>
              ))
            }
          </div>
        </Offcanvas.Body>
      </Offcanvas>
  );
}

export default ClientSelectModal;