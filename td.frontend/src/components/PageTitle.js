import React from 'react'
import { useGlobalData } from '../services/GlobalContext';

const PageTitle = (props) => {
  const { searchTerm, handleSearch, addBookInCase, title, handleModal, selectedCases, onDelete, onExport } = props;  
  const {isAdmin, isManager, allowFetchMails} = useGlobalData();

  return (
    <div className="d-flex flex-wrap align-items-center my-3 gap-2">   
      {/* <div> */}
      {
        (isAdmin || isManager) && title === "xml" ?         
        <button
          className="btn btn-primary"
          onClick={handleModal}
        >
         Import File
        </button> : null
        }
        {
        allowFetchMails && title === "non-xml"?         
        <button
          className="btn btn-primary"
          onClick={handleModal}
        >
         {title === "xml" ? 'Import File' : "Fecth Emails and Assign"}
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
              onClick={handleSearch}
              className='clear-search'
              aria-label="Clear search"
              tabIndex={0}
              role="button"
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleSearch}
            >
              ×
            </span>
           )} 
        {/* </div> */}
        <div  className='d-flex flex-wrap align-items-center gap-2 ms-auto'>
          {
          isAdmin || isManager ? 
        <button className="btn btn-success" onClick={addBookInCase}>
          Book In New Case {"("+title.toUpperCase()+")"}
        </button> 
        : null}
        <button className="btn btn-secondary" onClick={onExport} >
          Export {selectedCases.length ?'('+ selectedCases.length + ')' : 'All'}
        </button> 
        {/* {isAdmin || isManager ?  */}
        <button className="btn btn-danger" onClick={onDelete}>
          Delete {selectedCases.length ?'('+ selectedCases.length + ')' : ''}
        </button> 
        {/* : null} */}
         </div>
         </div>
  )
}

export default PageTitle