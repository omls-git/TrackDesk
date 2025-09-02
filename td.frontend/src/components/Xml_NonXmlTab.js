import React from 'react'
import PageTitle from './PageTitle'
import TrackTable from './TrackTable';
import { getDaysOpen } from '../Utility';
import { fetchBookInCases } from '../services/API';
import Skeleton from './Skeleton';
import DateEditor from './DateEditor';
import { Type } from 'react-bootstrap-table2-editor';
import { useGlobalData } from '../services/GlobalContext';

const XmlNonXmlTab = (props) => {
  const { addBookInCase, labels, tab } = props;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [xml_nonXmlData, setXml_nonXmlData] = React.useState([]);
  const [selectedXmlCases, setSelectedXmlCases] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const {currentClientId} = useGlobalData();

  // Fetch XML data
  const fetchXmlNonXmlData = React.useCallback(async () => {
    setLoading(true);
    try {
      const results = await fetchBookInCases(currentClientId);
      if (results && results.length > 0) {
        const xml_nonXmlData = results.filter(item => item.bookInType === tab);
        setXml_nonXmlData(xml_nonXmlData);
      }
    } catch (error) {
      console.error("Error fetching XML data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentClientId, tab]);

  React.useEffect(() => { 
    fetchXmlNonXmlData();
  }, [fetchXmlNonXmlData]);

   const toolTipFormatter = (cell, row, label) => {
    if(label.type === "checkbox"){
      
      return cell && (cell === 'true' || cell !== 'false') ? "Yes" : "No"
    }
    let value = cell ? cell.toString() : ""
    if(label.label === "Days Open"){
      const numberOfDaysCaseOpen = getDaysOpen(row);
      return numberOfDaysCaseOpen      
    }   
    
    if(cell && typeof cell !== 'boolean' &&  typeof cell !== 'number' && cell.includes('T') ){
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
    ...Object.entries(labels).map(([key]) => ({
      dataField: key,
      text: labels[key].label,
      editable: labels[key].label === "Days Open" ? false : true,
      editor : {
        type: labels[key].type === "textarea" ? Type.TEXTAREA : labels[key].type === "checkbox" ? Type.SELECT : Type.TEXT,
        rows: labels[key].type === "textarea" ? 3 : undefined,
        options: labels[key].type === "checkbox" ? labels[key].options : undefined
      },
      headerStyle: () => ({ width: labels[key].width+'px', minWidth: '100px' }),
      ...(labels[key].type === 'date' ? { editorRenderer: (editorProps, value) => <DateEditor { ...editorProps } value={ value } /> } : {}),
      formatter: (cell, row) => toolTipFormatter(cell, row, labels[key])
    }))
    // Add more columns as needed
  ];

  return (
    <div>
      <PageTitle title={tab} searchTerm={searchTerm} setSearchTerm={setSearchTerm} addBookInCase={addBookInCase} />
      { loading ? <Skeleton /> : null}
      {
        xml_nonXmlData && xml_nonXmlData.length > 0 && !loading ?
        <TrackTable cols={columns}
        data={xml_nonXmlData} 
        setSelectedCaseIds={setSelectedXmlCases}
        selectedCaseIds={selectedXmlCases} 
        setData={setXml_nonXmlData}
        refreshData={fetchXmlNonXmlData}
        /> : null
      }
      {!loading && xml_nonXmlData.length === 0 && (
        <h4 className="text-center mb-4">No Cases Assigned/Found</h4>
      )}
    </div>
  )
}

export default XmlNonXmlTab;