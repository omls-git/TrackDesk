import React from 'react'
import { useState } from 'react';
import AddBookInCaseModal from '../components/AddBookInCaseModal';

const BookIn = () => {
   const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' }}>              
        <input
          type="text"
          placeholder="Search..."
            className="form-control"
          value={searchTerm}
          // onChange={handleSearch}
          style={{ flex: 1, marginRight: '16px', maxWidth: '300px', paddingRight: '30px' }}
          />
          {searchTerm && (
            <span
              // onClick={() => {setSearchTerm('');fetchData()}}
              style={{
                position: 'relative',
                right: '40px',
                cursor: 'pointer',
                color: '#aaa',
                fontWeight: 'bold',
                fontSize: '20px',
                zIndex: 2,
                userSelect: 'none'
              }}
              aria-label="Clear search"
              tabIndex={0}
              role="button"
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSearchTerm('')}
            >
              ×
            </span>
           )} 
          <div>
          {/* {
          isAdmin || isManager ?  */}
        <button className="btn btn-success" style={{ marginRight: '10px'}} onClick={() => setShowAddModal(true)}>
          Book In New Case
        </button> 
        {/* : null} */}
        {/* {
          isAdmin || isManager ?  */}
        <button className="btn btn-danger" style={{ marginLeft: 'auto'}} >
          Delete 
           {/* {selectedTriageCaseIds.length ?'('+ selectedTriageCaseIds.length + ')' : ''} */}
        </button> 
        {/* : null} */}
         </div>
         <AddBookInCaseModal show={showAddModal} onClose={() => setShowAddModal(false)} />
      </div>
  )
}

export default BookIn