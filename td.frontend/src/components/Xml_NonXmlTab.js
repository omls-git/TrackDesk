import React, { useState } from 'react'
import PageTitle from './PageTitle'
import TrackTable from './TrackTable';
import { exportToCSV, getDaysOpen, jsonDataFromFile } from '../Utility';
import { deleteCases, fetchBookInCases, postBookInCase } from '../services/API';
import Skeleton from './Skeleton';
import DateEditor from './DateEditor';
import { Type } from 'react-bootstrap-table2-editor';
import { useGlobalData } from '../services/GlobalContext';
import ImportModal from './ImportModal';
import { getClientAssigniesOfRole } from '../services/Common';
import AddBookInCaseModal from '../components/AddBookInCaseModal';

const XmlNonXmlTab = (props) => {
  const {labels, tab } = props;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [xml_nonXmlData, setXml_nonXmlData] = React.useState([]);
  const [dupXml_nonXmlData, setDupXml_nonXmlData] = React.useState([]);
  const [selectedXmlCases, setSelectedXmlCases] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const {currentClientId, allClients, users} = useGlobalData();
  const [selectedClientId, setSelectedClientId] = React.useState(currentClientId);

  // Fetch XML data
  const fetchXmlNonXmlData = React.useCallback(async () => {
    setLoading(true);
    try {
      const results = await fetchBookInCases(currentClientId);
      if (results && results.length > 0) {
        const xml_nonXmlData = results.filter(item => item.bookInType === tab);
        setXml_nonXmlData(xml_nonXmlData);
        setDupXml_nonXmlData(xml_nonXmlData);
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
    let value = cell ? cell : ""
    if(label.label === "Days Open"){
      const numberOfDaysCaseOpen = getDaysOpen(row);
      return numberOfDaysCaseOpen      
    }    
    if(cell && label.type === 'date'){
      value = cell.includes('T') ? cell.split('T')[0] : cell.split(' ')[0];
    }
    return (
    <span title={value}
    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: label.width - 5 + 'px' }}>
       {value}
    </span>
  )}
  const handleModal = () => setShowImportModal(!showImportModal);

  const onClientChange = (e) => {
    const clientId = e?.target?.value;
    clientId ? setSelectedClientId(clientId) : setSelectedClientId(currentClientId || '');
  };

   // Define handleImportFile function
  const handleImportFile = async(file) => {
    // TODO: implement file import logic here
    if (!file) return;
    let jsonData = await jsonDataFromFile(file);
    if(jsonData && jsonData.length > 0){
    const response = await postBookInCase(jsonData, selectedClientId, tab, xml_nonXmlData);
    setDupXml_nonXmlData((prev) => [...prev, ...response]);
    setXml_nonXmlData((prev) => [...prev, ...response]);
    }else{
      alert("No data found in the file.");
    }
  };

  const getBookInAssignies = () => {
    if (!currentClientId || !users || users.length === 0) return [];
    const assignies = getClientAssigniesOfRole('book in', currentClientId, users);
    if(!assignies || assignies.length === 0) return [];
    return assignies.map(item => ({
      value: item.username,
      label: item.username
    }));
  };

  // Define columns for TrackTable
  const columns = [
    { dataField: 'id', text: 'ID', editable: false, hidden:true, headerStyle: () => ({ width: '100px', minWidth: '100px' }) },
    ...Object.entries(labels).map(([key]) => ({
      dataField: key,
      text: labels[key].label,
      editable: labels[key].label === "Days Open" ? false : true,
      editor : {
        type: labels[key].type === "textarea" ? Type.TEXTAREA : labels[key].type === "checkbox" || key === 'bookInAssignedTo' ? Type.SELECT : Type.TEXT,
        rows: labels[key].type === "textarea" ? 3 : undefined,
        options: labels[key].type === "checkbox" ? labels[key].options : key === 'bookInAssignedTo' ? getBookInAssignies() : undefined
      },
      headerStyle: () => ({ width: labels[key].width+'px', minWidth: '100px' }),
      ...(labels[key].type === 'date' ? { editorRenderer: (editorProps, value) => <DateEditor { ...editorProps } value={ value } /> } : {}),
      formatter: (cell, row) => toolTipFormatter(cell, row, labels[key])
    })),
    {
      dataField: 'bookInWorkStatus', 
      text: 'Status', 
      editable: true,
      editor: {
        type: Type.SELECT,
        options: [
            { value: 'Assigned', label: 'Assigned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' }
          ]
      },
      headerStyle: () => ({ width: '100px', minWidth: '100px' })
    }
    // Add more columns as needed
  ];

  const handleDelete = async() => {
    if(!selectedXmlCases || selectedXmlCases.length === 0)return;
    await deleteCases(selectedXmlCases);
    setSelectedXmlCases([]);
    const refreshData = dupXml_nonXmlData.filter(item => !selectedXmlCases.includes(item.id));
    setXml_nonXmlData(refreshData);
    setDupXml_nonXmlData(refreshData);
  };

  const handleExport = () => {
    if (!xml_nonXmlData.length) return;
    let dataToDownload = xml_nonXmlData;

    if(selectedXmlCases && selectedXmlCases.length > 0){
      dataToDownload = dataToDownload.filter(item => selectedXmlCases.includes(item.id));
    }
    exportToCSV(dataToDownload, `${tab.toUpperCase()}_intake_cases_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleSubmitBokInCase = async(formData)=>{
     const res = await postBookInCase(formData, currentClientId, tab, []);    
    if(res){
      const appendData = [res]
      setXml_nonXmlData(prev => [...prev, ...appendData]);
      setDupXml_nonXmlData(prev => [...prev, ...appendData]);
      alert('Data saved successfully!')
      setShowAddModal(false);
    }else{
      alert('Failed to save the data');
    }
  }
  const addBookInCase = () => {
    setShowAddModal(!showAddModal);
  };

  return (
    <div>
      <PageTitle title={tab} 
      searchTerm={searchTerm} 
      setSearchTerm={setSearchTerm} 
      addBookInCase={addBookInCase} 
      handleModal={handleModal}
      selectedCases={selectedXmlCases}
      onDelete={handleDelete}
      onExport={handleExport}
      />
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
      
         <ImportModal show={showImportModal}
          onClose={handleModal}
          onShow={handleModal}
          title={"Import XML file (Intake & Triage)"}
          onFileChange={handleImportFile} 
          selectedClient={selectedClientId}
          onSelect={onClientChange}
          clients={allClients}
        />
         <AddBookInCaseModal show={showAddModal} onClose={() => setShowAddModal(false)} labels={labels} tab={tab} onSubmit={handleSubmitBokInCase} />
    </div>
  )
}

export default XmlNonXmlTab;