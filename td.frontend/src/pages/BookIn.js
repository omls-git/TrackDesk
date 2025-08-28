import React from 'react'
import { useState } from 'react';
import AddBookInCaseModal from '../components/AddBookInCaseModal';
import { Tab, Tabs } from 'react-bootstrap';
import XmlTab from '../components/XmlTab';
import NonXmlTab from '../components/NonXmlTab';
import { nonXmlLabels, xmllabels } from '../Utility';
// import { fetchByCaseNumber } from '../services/API';

const BookIn = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('xml');
  const [labels, setLabels] = useState(xmllabels);

  const addBookInCase = async () =>{ 
    // const response = await fetchByCaseNumber('2025US08772', 13)
    // console.log(response);    
    setShowAddModal(true)
  }

  const handleTabSelect = (k) => {
    setActiveTab(k);
    if(k === "xml"){
      setLabels(xmllabels)
    }else{
      setLabels(nonXmlLabels)
    }
  };

  return (
    <div>  
     <Tabs
        activeKey={activeTab}
        onSelect={handleTabSelect}
        className="cases-tabs mt-2"
      >
        <Tab eventKey="xml" title="XML">
          <XmlTab addBookInCase={addBookInCase} xmlLabels={labels} />
        </Tab>
        <Tab eventKey="non-xml" title="NON-XML">
          <NonXmlTab addBookInCase={addBookInCase} nonXmlLabels={labels} />
        </Tab>
      </Tabs>      
      <AddBookInCaseModal show={showAddModal} onClose={() => setShowAddModal(false)} labels={labels} />
    </div>
  )
}

export default BookIn