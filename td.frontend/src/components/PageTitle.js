import React from 'react'
import { useGlobalData } from '../services/GlobalContext';
import ImportModal from './ImportModal';

const PageTitle = (props) => {
  const { searchTerm, setSearchTerm, addBookInCase, title } = props;  
  const {isAdmin, isManager, allClients, currentClientId} = useGlobalData();
  const [show, setShow] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState(currentClientId); // Add this line

  // Handle client selection change
  const onClientChange = (e) => {
    const clientId = e?.target?.value;
    clientId ? setSelectedClientId(clientId) : setSelectedClientId(currentClientId || '');
  };

  // Define handleClose function
  const handleModal = () => setShow(!show);

  // Define handleImportFile function
  const handleImportFile = (file) => {
    // TODO: implement file import logic here
    console.log('Import file:', file);
  };

  // Define handleSearch function
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="d-flex flex-wrap align-items-center my-3 gap-2">   
      {/* <div> */}
      {
        (isAdmin || isManager) && title === "XML" ?         
        <button
          className="btn btn-primary"
          onClick={handleModal}
        >
          Import File
        </button> : null
        }       
        <input
          type="text"
          placeholder="Search..."
          className="form-control"
          value={searchTerm}
          onChange={handleSearch}
          style={{ flex: 1, marginRight: '16px', maxWidth: '350px', paddingRight: '30px' }}
          />
          {searchTerm && (
            <span
              onClick={() => {setSearchTerm('')}}
              className='clear-search'
              aria-label="Clear search"
              tabIndex={0}
              role="button"
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSearchTerm('')}
            >
              ×
            </span>
           )} 
        {/* </div> */}
        <div  className='d-flex flex-wrap align-items-center gap-2 ms-auto'>
          {/* {
          isAdmin || isManager ?  */}
        <button className="btn btn-success" onClick={addBookInCase}>
          Book In New Case {"("+title+")"}
        </button> 
        {/* : null} */}
        <button className="btn btn-secondary" >
          Export 
           {/* {selectedTriageCaseIds.length ?'('+ selectedTriageCaseIds.length + ')' : ''} */}
        </button> 
        {/* {
          isAdmin || isManager ?  */}
        <button className="btn btn-danger">
          Delete 
           {/* {selectedTriageCaseIds.length ?'('+ selectedTriageCaseIds.length + ')' : ''} */}
        </button> 
        {/* : null} */}
         </div>
         <ImportModal show={show}
          onClose={handleModal}
          onShow={handleModal}
          title={"Import XML file (Intake & Triage)"}
          onFileChange={handleImportFile} 
          selectedClient={selectedClientId}
          onSelect={onClientChange}
          clients={allClients}
        />
         </div>
  )
}

export default PageTitle