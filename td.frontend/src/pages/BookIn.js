import React from 'react'
import { useState } from 'react';
import AddBookInCaseModal from '../components/AddBookInCaseModal';
import { Tab, Tabs } from 'react-bootstrap';
import XmlTab from '../components/XmlTab';
import NonXmlTab from '../components/NonXmlTab';
// import { fetchByCaseNumber } from '../services/API';

const BookIn = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('xml');

  const addBookInCase = async () =>{ 
    // const response = await fetchByCaseNumber('2025US08772', 13)
    // console.log(response);    
    setShowAddModal(true)
  }
  return (
    <div>  
     <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="cases-tabs mt-2"
      >
        <Tab eventKey="xml" title="XML">
          <XmlTab addBookInCase={addBookInCase} />
        </Tab>
        <Tab eventKey="non-xml" title="NON-XML">
          <NonXmlTab addBookInCase={addBookInCase} />
        </Tab>
      </Tabs>      
      <AddBookInCaseModal show={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  )
}

export default BookIn