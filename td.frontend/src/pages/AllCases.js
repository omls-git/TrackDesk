import React, { useEffect, useState } from 'react'
import TrackTable from '../components/TrackTable';
import ImportModal from '../components/ImportModal';
import { deleteCases,fetchCasesByClientId, postCases } from '../services/API';
import { exportToCSV, jsonDataFromFile } from '../Utility';
import { useGlobalData } from '../services/GlobalContext';
import Skeleton from '../components/Skeleton';

const AllCases = () => {

  const { loggedUserName, users, user, allClients, currentClientId} = useGlobalData();
  const [masterData, setMasterData] = useState([]); 
  const [dupMasterData, setDupMasterData] = useState([]); 
  const [show, setShow] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(currentClientId || '');
  const [selectedCases, setSelectedCases] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdminOrManager, setIsAdminOrManager] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false)

  const handleImportFile = async (file) => {
    if (!file) return;
    let jsonData = await jsonDataFromFile(file);   
    if(jsonData.length){
    await postCases(jsonData, selectedClientId)
    await fetchAllCasesCallback();
    handleClose();
    }else{
      alert('No valid data found to import or the file is empty!');
    }    
  };

  const handleExport = () => {
    if (!masterData.length) return;
    let dataToDownload = masterData;

    if(selectedCases && selectedCases.length > 0){
      dataToDownload = dataToDownload.filter(item => selectedCases.includes(item.id));
    }
    exportToCSV(dataToDownload, `cases_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const fetchAllCasesCallback = React.useCallback(async () => {
    setLoading(true); 
    if(user){
      try {
        let cases = await fetchCasesByClientId(currentClientId);
        console.log(cases);
        
        if (cases) {
          cases = cases.filter((item) => !item.caseStatus?.toLowerCase().trim().includes('triage') && item.caseStatus?.toLowerCase().trim() !== 'bookin' && item.caseStatus);
           setMasterData(cases);
           setDupMasterData(cases);
        }       
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally{
        setLoading(false)
      }
    }else{
      setMasterData([]);
      setDupMasterData([])
      setLoading(false);
    }
    
  }, [currentClientId, user]);

  useEffect(() => {
    async function fetchClientsAndCases() {
       const employeeList = users;
        const userDetails = employeeList.find((item) => item.username === loggedUserName);
        if(userDetails?.permission.trim() === "Admin" || userDetails?.permission.trim() === "Manager"){
          setIsAdminOrManager(true)
        }
      fetchAllCasesCallback();
    }
    fetchClientsAndCases();
  }, [fetchAllCasesCallback, loggedUserName, users])  

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const onClientChange =(e) => {
    const clientId = e?.target?.value;
    clientId ? setSelectedClientId(clientId) : setSelectedClientId(currentClientId || '');
  }

  const deleteSelectedCases = async() => {
    if(!selectedCases || selectedCases.length === 0)return;
    await deleteCases(selectedCases);
    setSelectedCases([]);
    const refreshData = dupMasterData.filter(item => !selectedCases.includes(item.id));
    setMasterData(refreshData);
    setDupMasterData(refreshData);
  }

  const handleSearchChange = (e) => {
    const searchTerm = e?.target?.value?.toLowerCase();
    setSearchTerm(searchTerm);
    if (!searchTerm) {
      setMasterData(dupMasterData)
      return;
    }    
    const filteredData = dupMasterData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm)
      )
    );
    if(filteredData){
      setMasterData(filteredData);
    }
    
  };

  useEffect(() => {
    if (!dateRange.from && !dateRange.to) {
      fetchAllCasesCallback();
      return;
    }
    const filterByDate = (data) => {
      return data.filter(row => {
        // Try to find a date field (e.g., "Date", "Created", etc.)
        const dateField = Object.keys(row).find(
          key => key.toLowerCase().includes('date') || key.toLowerCase().includes('ird_frd')
        );
        if (!dateField) return true;
        const rowDate = row[dateField];
        if (!rowDate) return false;
        const rowTime = new Date(rowDate).getTime();
        const fromTime = dateRange.from ? new Date(dateRange.from).getTime() : -Infinity;
        const toTime = dateRange.to ? new Date(dateRange.to).getTime() : Infinity;
        return rowTime >= fromTime && rowTime <= toTime;
      });
    };

    fetchCasesByClientId(user?.projectId).then(data => {
      setMasterData(filterByDate(data));
    });
  }, [dateRange.from, dateRange.to, fetchAllCasesCallback, user]);
  return (
    <div className="mt-4">
      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        {
          isAdminOrManager ?         
        <button
          className="btn btn-primary"
          onClick={handleShow}
        >
          Import File
        </button>: null
        }
        {/* Date range filter */}
        <input
          type="date"
          className="form-control"
          name="from"
          value={dateRange.from}
          onChange={handleDateChange}
          style={{ maxWidth: 160 }}
          placeholder="From"
        />
        <span>to</span>
        <input
          type="date"
          className="form-control"
          name="to"
          value={dateRange.to}
          onChange={handleDateChange}
          style={{ maxWidth: 160 }}
          placeholder="To"
        />
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          style={{ maxWidth: 250 }}
          onChange={handleSearchChange}
          value={searchTerm}
        />
        <button
          className="btn btn-light"
          onClick={(e) => {
            setDateRange({ from: '', to: '' })
            handleSearchChange();
            setSearchTerm('');
          }}
        >
          Clear Filters
        </button>          
        <div className='d-flex flex-wrap align-items-center gap-2 ms-auto'>          
        <button className="btn btn-secondary ms-auto"
         onClick={handleExport}
         >Export {selectedCases.length ?'(' + selectedCases.length + ')' : 'All'}</button>
         {isAdminOrManager ? 
        <button className="btn btn-danger ms-auto"
         onClick={deleteSelectedCases}
         >Delete {selectedCases.length ?'(' + selectedCases.length + ')' : ''}</button> : null }
         </div>
      </div>
      {loading && (<Skeleton />)}
      {!loading && masterData.length === 0 && <div className="text-center">No data available</div>}
      {!loading && masterData && masterData.length > 0 && (
         <TrackTable data={masterData} cols={null} 
         setSelectedCaseIds={setSelectedCases} 
         selectedCaseIds={selectedCases} 
         clients={allClients} 
         setData={setMasterData}
         refreshData={fetchAllCasesCallback} />
      )}
      <ImportModal show={show}
       onClose={handleClose}
       onShow={handleShow}
       title={"Import Line Listing"}
       onFileChange={handleImportFile} 
       selectedClient={selectedClientId}
       onSelect={onClientChange} clients={allClients}
        />
    </div>
  )
}

export default AllCases