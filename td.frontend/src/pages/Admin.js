import React, { useEffect, useState } from 'react'
import { addClient, deleteClients, getClients } from '../services/API';
import BootstrapTable from 'react-bootstrap-table-next';
import AddClientModal from '../components/AddClientModal';

const Admin = () => {

  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([])
  const [modalOpen, setModalOpen] = useState(false);
  const [errMssg, setErrMssg] = useState('');
  const fecthAllClients = async() =>{
    const allClients = await getClients();
    if(allClients){
      setClients(allClients.sort((a,b) => a.id-b.id))
    }
  }
  useEffect(() => {   
    fecthAllClients()
  },[])

  const columns = [
      {
        dataField: 'id',
        text: 'Client ID',
        width: 150,
        editable: false,
        headerStyle: () => ({ width: '200px', minWidth: '100px'}),
      },
      {
        dataField: 'name',
        text: 'Client Name',
        width: 150,
        // headerStyle: () => ({ width: '200px', minWidth: '100px' }),
        editable: false,
        // editor : {
        //   type: Type.SELECT,
        //   options: [
        //     { value: 'Data Entry', label: 'Data Entry' },
        //     { value: 'Quality Review', label: 'Quality Review' },
        //     { value: 'Medical Review', label: 'Medical Review' }
        //   ],
        // },
      },
      // {
      //   dataField: 'employees',
      //   text: 'Employees',
      //   width: 150,
      //   editable: false,
      //   // headerStyle: () => ({ width: '200px', minWidth: '100px'}),
      //   formatter : (cell, row) => {
      //       const employees = users?.filter(item => item.projectId.toString() === row.id.toString());
      //       const concatedEmployees = employees && employees.length > 0
      //       ? employees.map(emp => emp.username).join(', ')
      //       : '';
      //       return concatedEmployees;
      //   }
      // },
      {
        dataField: 'isActive',
        text: 'Is Active',
        width: 150,
        editable: false,
        headerStyle: () => ({ width: '150px', minWidth: '100px'}),
        formatter: (cell, row) => {
          return row.isActive ? "Yes" : "No"
        }
      },
  ]

   const selectRowConfig = {
    mode: 'checkbox',
    classes: 'selected-row',
    style: { backgroundColor: '#c8e6c9' },
    selected: selectedClients || [],
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setSelectedClients((prevSelected) => {
          if (!prevSelected.includes(row.id)) {
            return [...prevSelected, row.id];
          }
          return prevSelected;
        });
      } else {
        setSelectedClients((prevSelected) => {
          return prevSelected.filter((item) => item !== row.id);
        });
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      console.log(rows)
      if (isSelect) {        
        const allIds = rows.map(row => row.id);
        setSelectedClients(allIds);
      } else {
        setSelectedClients([]);
      }
    }
  };

  const handleDeleteClients = async() => {
    if(selectedClients && selectedClients.length > 0){
        await deleteClients(selectedClients)
        await fecthAllClients()
        setSelectedClients([])
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
      if(error.data.code === "ER_DUP_ENTRY"){
        setErrMssg(`Client with ${client.name} already exists`)
      }else{
         alert(`Failed to add client.`)
      }
    }    
   }

  return (
    <div className='mt-2'>
      <h4>Clients</h4>
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={() => setModalOpen(true)}>Add Client</button>
        <button className="btn btn-danger" onClick={handleDeleteClients}>Delete {selectedClients && selectedClients.length > 0 ? '(' + selectedClients.length + ")": ''}</button>
      </div>
      <BootstrapTable 
      keyField='id'
      data={clients}
      columns={columns}
      className="w-auto"
      bootstrap4
      striped
      hover
      selectRow={selectRowConfig}
      />
      {
        modalOpen ? <AddClientModal isOpen={modalOpen} onClose={handleClose} onSubmit={saveClient} errorMssg ={errMssg} /> : null
      }
    </div>
  )
}

export default Admin