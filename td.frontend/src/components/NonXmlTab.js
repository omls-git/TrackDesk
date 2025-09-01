import React, { useCallback } from 'react'
import PageTitle from './PageTitle'
import TrackTable from './TrackTable';
import { estimateWidth } from '../Utility';
import { fetchBookInCases } from '../services/API';

const NonXmlTab = (props) => {
  const { addBookInCase, nonXmlLabels } = props;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCases, setSelectedCases] = React.useState([]);
  const [nonXmlData, setNonXmlData] = React.useState([]);

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

  const columns = [
    { dataField: 'id', text: 'ID', type: 'text', editable: false, hidden:true, headerStyle: () => ({ width: '100px', minWidth: '100px' }) },
    ...Object.entries(nonXmlLabels).map(([key, type]) => ({
      dataField: key,
      text: nonXmlLabels[key].label,
      editable: true,
      headerStyle: () => ({ width: estimateWidth(nonXmlLabels[key].label), minWidth: '100px' }),
      formatter: toolTipFormatter
    }))
  ];

  // Define fetchNonXmlData function
  const fetchNonXmlData = useCallback(async() => {
    // TODO: Implement data fetching logic here
    // Example: setNonXmlData(fetchedData);
    const results = await fetchBookInCases(19);
    if(results && results.length > 0){
      const nonXMLData = results.filter(item => item.bookInType === "non-xml");
      setNonXmlData(nonXMLData);
    }
  }, []);
  React.useEffect(() => {
    fetchNonXmlData();
  }, [fetchNonXmlData]);

  return (
    <div>
      <PageTitle title="NON-XML" searchTerm={searchTerm} setSearchTerm={setSearchTerm} addBookInCase={addBookInCase} />
      <TrackTable cols={columns}
      data={nonXmlData} 
      setSelectedCaseIds={setSelectedCases}
      selectedCaseIds={selectedCases} 
      setData={setNonXmlData}
      refreshData={fetchNonXmlData}
      />
    </div>
  )
}

export default NonXmlTab