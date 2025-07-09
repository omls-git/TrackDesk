import React, { useEffect, useState } from 'react';
import { Accordion, Button, Modal } from 'react-bootstrap';
import { useGlobalData } from '../services/GlobalContext';
import { addClient, deleteClients, getClients } from '../services/API';
import AddClientModal from '../components/AddClientModal';

const Admin = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clients, setClients] = useState([]);  
    const [modalOpen, setModalOpen] = useState(false);
    const [errMssg, setErrMssg] = useState('');

  const handleShowModal = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };
  const {users} = useGlobalData()

    const fecthAllClients = React.useCallback(async () => {
      const allClients = await getClients();
      if(allClients){
        const clients = allClients.map((client) => (
          {id : client.id, 
            name:client.name,
            employees: users && users.length ? users.filter(item => item.projectId.toString() === client.id.toString()) : [],
            isActive: client.isActive
          }))
        setClients(clients.sort((a,b) => a.id-b.id))
      }
    }, [users]);

    useEffect(() => {   
      fecthAllClients()
    }, [fecthAllClients])

      const handleDelete = async(id) => {
        if(id){
          await deleteClients([id])
          await fecthAllClients()
        }
      }
    
       const handleClose =() => {
        setModalOpen(false);
        setErrMssg('')
       }
    
       const saveClient = async(client) => {
        try {
          await addClient(client)
          handleClose();
          await fecthAllClients();
          alert(`Client with ${client.name} is added successfully`)
          setErrMssg('')
        } catch (error) {
          console.error(error);
          if(error.data === "Validation error"){
            setErrMssg(`Client with ${client.name} already exists`)
          }else{
             alert(`Failed to add client.`)
          }
        }    
       }

  return (
    <div className='mt-2'>
      <div className="mb-3 d-flex justify-content-between">
      <h4>Clients</h4>      
        <button className="btn btn-success" onClick={() => setModalOpen(true)}>Add Client</button>
      </div>
      <Accordion defaultActiveKey="0">
        {clients.map((client, idx) => (
          <Accordion.Item eventKey={idx.toString()} key={client.id}>
            <Accordion.Header >{client.name} </Accordion.Header>
            <Accordion.Body>
              <p><strong>Client ID:</strong> {client.id}</p>
              <p><strong>Is Active:</strong> {client.isActive ? "Yes" : "No"}</p>
              <p><strong>Employees Count:</strong> {client.employees.length}</p><div className="d-flex gap-2 mt-3">
                <Button variant="primary" onClick={() => handleShowModal(client)}>View Details</Button>
                <Button variant="danger" onClick={() => handleDelete(client.id)}>Delete</Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Client Details - {selectedClient?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedClient && (
            <>
              <p><strong>Client ID:</strong> {selectedClient.id}</p>
              <p><strong>Is Active:</strong> {selectedClient.isActive ? "Yes" : "No"}</p>
              <p><strong>Employees:</strong></p>
              <ol>
                {selectedClient.employees.map((emp, index) => (
                  <li key={index}>{emp.username}</li>
                ))}
              </ol>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {
        modalOpen ? <AddClientModal isOpen={modalOpen} onClose={handleClose} onSubmit={saveClient} errorMssg ={errMssg} /> : null
      }
    </div>
  );
};

export default Admin;
