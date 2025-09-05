import React from 'react'
import { useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import XmlNonXmlTab from '../components/Xml_NonXmlTab';
import { CV } from '../commonVariables/Variables';
// import { fetchByCaseNumber } from '../services/API';

const BookIn = () => {
  const [activeTab, setActiveTab] = useState('xml');
  const [labels, setLabels] = useState(CV.xmllabels);

  const handleTabSelect = (k) => {
    setActiveTab(k);
    if(k === "xml"){
      setLabels(CV.xmllabels)
    }else{
      setLabels(CV.nonXmlLabels)
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
         {labels && <XmlNonXmlTab labels={labels} tab={activeTab} />}
        </Tab>
        <Tab eventKey="non-xml" title="NON-XML">
          {labels && <XmlNonXmlTab labels={labels} tab={activeTab} />}
        </Tab>
      </Tabs>      
     
    </div>
  )
}

export default BookIn