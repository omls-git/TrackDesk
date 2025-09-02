import React from 'react'
import { useState } from 'react';
import AddBookInCaseModal from '../components/AddBookInCaseModal';
import { Tab, Tabs } from 'react-bootstrap';
import XmlNonXmlTab from '../components/Xml_NonXmlTab';
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
         {labels && <XmlNonXmlTab addBookInCase={addBookInCase} labels={labels} tab={activeTab} />}
        </Tab>
        <Tab eventKey="non-xml" title="NON-XML">
          {labels && <XmlNonXmlTab addBookInCase={addBookInCase} labels={labels} tab={activeTab} />}
        </Tab>
      </Tabs>      
      <AddBookInCaseModal show={showAddModal} onClose={() => setShowAddModal(false)} labels={labels} tab={activeTab} />
    </div>
  )
}

export default BookIn