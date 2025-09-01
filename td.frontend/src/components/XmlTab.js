import React from 'react'
import PageTitle from './PageTitle'
import TrackTable from './TrackTable';
import { estimateWidth } from '../Utility';
import { fetchBookInCases } from '../services/API';

const XmlTab = (props) => {
  const { addBookInCase, xmlLabels } = props;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [xmlData, setXmlData] = React.useState([]);
  const [selectedXmlCases, setSelectedXmlCases] = React.useState([]);


  // Fetch XML data
  const fetchXmlData = async () => {
    // Fetch your XML data here and update state
    const results = await fetchBookInCases(19);
    if(results && results.length > 0){
      const xmlData = results.filter(item => item.bookInType === "xml");
      setXmlData(xmlData);
    }
  };

  React.useEffect(() => { 
    fetchXmlData();
  }, []);

   const toolTipFormatter = (cell) => {    
    let value = cell ? cell.toString() : "undefined"
    if(cell && typeof cell !== 'boolean' &&  cell.includes('T') ){
      value = cell.split('T')[0]
    }
    return (    
    <span title={value}
    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 150 }}>
       {value}
    </span>
  )}

  // Define columns for TrackTable
  const columns = [
    { dataField: 'id', text: 'ID', type: 'text', editable: false, hidden:true, headerStyle: () => ({ width: '100px', minWidth: '100px' }) },
    ...Object.entries(xmlLabels).map(([key]) => ({
      dataField: key,
      text: xmlLabels[key].label,
      editable: true,
      headerStyle: () => ({ width: estimateWidth(xmlLabels[key].label), minWidth: '100px' }),
      formatter: toolTipFormatter
    }))
    // Add more columns as needed
  ];

  return (
    <div>
      <PageTitle title="XML" searchTerm={searchTerm} setSearchTerm={setSearchTerm} addBookInCase={addBookInCase} />
      <TrackTable cols={columns}
      data={xmlData} 
      setSelectedCaseIds={setSelectedXmlCases}
      selectedCaseIds={selectedXmlCases} 
      setData={setXmlData}
      refreshData={fetchXmlData}
      />
    </div>
  )
}

export default XmlTab