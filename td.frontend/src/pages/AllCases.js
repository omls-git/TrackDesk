import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx';
import TrackTable from '../components/TrackTable';
import ImportModal from '../components/ImportModal';
import { deleteCases, fetchAllCases, getClients, postCases } from '../services/API';

const AllCases = () => {

  const [masterData, setMasterData] = useState([]); 
  const [show, setShow] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [selectedCases, setSelectedCases] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);

  const handleImportFile = async (file) => {
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'buffer' });
    const worksheet = workbook.Sheets["Open Cases"];
    let jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: "" });
   
    let headers = Object.keys(jsonData[0] || {});
    setColumns(headers);
    
    // Convert Excel serial dates to JS date strings in all cells that look like dates
    const isProbablyDate = (val) =>
      typeof val === 'number' && val > 25569 && val < 60000; // Excel date serial range
    jsonData = jsonData.map(row => {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) => {
          if (isProbablyDate(value)) {
            return [key, parseExcelDate(value)];
          }
          return [key, value];
        })
      );
    });
    await postCases(jsonData, selectedClientId)
    await fetchAllCasesCallback();
    handleClose();
  };

  const handleExport = () => {
    if (!masterData.length) return;
    const ws = XLSX.utils.json_to_sheet(masterData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cases");
    XLSX.writeFile(wb, "cases_export.xlsx");
  };

  const fetchAllCasesCallback = React.useCallback(async () => {
    // setLoading(true);
    try {
      const cases = await fetchAllCases();
      setMasterData(cases);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchClientsAndCases() {
      const fetchedClients = await getClients();
      setClients(fetchedClients);
      fetchAllCasesCallback();
    }
    fetchClientsAndCases();
  }, [fetchAllCasesCallback])  

   const parseExcelDate = (value) => {
        if (typeof value === "number") {
          const date = XLSX.SSF.parse_date_code(value);
          if (!date) return "";
          const iso = new Date(Date.UTC(date.y, date.m - 1, date.d)).toISOString();
          return iso.slice(0, 19).replace("T", " ");
        }
        if (value instanceof Date) {
          return value.toISOString().slice(0, 19).replace("T", " ")
        }
        return "";
  };

  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };


  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const onClientChange =(e) => {
    const clientId = e?.target?.value;
    clientId ? setSelectedClientId(e.target.value) : setSelectedClientId('')
  }

  const deleteSelectedCases = async() => {
    await deleteCases(selectedCases);
    setSelectedCases([]);
    await fetchAllCasesCallback();
  }

  const handleSearchChange = (e) => {
    const searchTerm = e?.target?.value?.toLowerCase();
    setSearchTerm(searchTerm);
    if (!searchTerm) {
      fetchAllCasesCallback();
      return;
    }    
    const filteredData = masterData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm)
      )
    );
    setMasterData(filteredData);
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

    fetchAllCases().then(data => {
      setMasterData(filterByDate(data));
    });
  }, [dateRange.from, dateRange.to, fetchAllCasesCallback]);

  return (
    <div className="mt-4">   

      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        <button
          className="btn btn-primary"
          onClick={handleShow}
        >
          Import File
        </button>
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
          className="btn btn-secondary"
          onClick={(e) => {
            setDateRange({ from: '', to: '' })
            handleSearchChange();
            setSearchTerm('');
          }}
        >
          Clear Filters
        </button>
        <div className='d-flex flex-wrap align-items-center gap-2 ms-auto'>
        <button className="btn btn-danger ms-auto"
         onClick={deleteSelectedCases}
         >Delete {selectedCases.length ?'(' + selectedCases.length + ')' : ''}</button>
        <button className="btn btn-success ms-auto"
         onClick={handleExport}
         >Export</button>
         </div>
      </div>
      {masterData.length === 0 && <div className="text-center">No data available</div>}
      {/* {loading && <div className="text-center">Loading...</div>} */}
      {masterData.length > 0 && (
         <TrackTable data={masterData} cols={null} setSelectedCaseIds={setSelectedCases} selectedCaseIds={selectedCases} clients={clients} />
      )}
      <ImportModal show={show} onClose={handleClose} onShow={handleShow} title={"Import Master Tracker"} onFileChange={handleImportFile} selectedClient={selectedClientId}
       onSelect={onClientChange} clients={clients}/>
    </div>
  )
}

export default AllCases