import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useGlobalData } from '../services/GlobalContext';
import { useEffect, useState } from 'react';

function ClientSelectModal({ open, onClose, onSelect }) {
  
  const [clients, setClients] = useState([]);
  const {allClients, currentClientId, isAdmin, users} = useGlobalData();

  useEffect(() => {
    let filteredUser = users?.filter((user) => user.username === localStorage.getItem('userName'));    
    if (!isAdmin && filteredUser && filteredUser.length > 1) {
      let clients = [...new Set(filteredUser.map((user) => user.projectId))];
      clients = allClients.filter((client) => clients.includes(client.id));      
      setClients(clients);
    } else if (isAdmin) {
      allClients && allClients.length > 0 && setClients(allClients);
    }
  }, [allClients, isAdmin, users]);
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
            { clients && clients.length > 0 ?
              clients.map((client) => (
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
              )) : null
            }
          </div>
        </Offcanvas.Body>
      </Offcanvas>
  );
}

export default ClientSelectModal;