import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import TrackTable from '../components/TrackTable';
import ImportModal from '../components/ImportModal';
import { fetchAllCases, postCases } from '../services/API';

const clients = [{id:1,name:"Client One"}, {id:2, name:"Client Two"}, {id:3, name: "Client Three" } ]
const AllCases = () => {

  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [show, setShow] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null)
  // const [selectedClient, setSelectedClient] = useState(clients[0])
// const fileInputRef = useRef(); 

  const handleImportFile = async (file) => {
    setLoading(true);
    handleClose();
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'buffer' });  
    // console.log(`File imported: ${file.name}`);
    console.log(`Workbook:`, workbook);
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
    console.log(jsonData);
    setMasterData(jsonData);
    await postCases(jsonData, selectedClientId)
    setLoading(false);
  };

   const parseExcelDate = (value) => {
        if (typeof value === "number") {
          const date = XLSX.SSF.parse_date_code(value);
          if (!date) return "";
          const iso = new Date(Date.UTC(date.y, date.m - 1, date.d)).toISOString();
          return iso.split("T")[0];
        }
        if (value instanceof Date) {
          return value.toISOString().split("T")[0];
        }
        return "";
  };

  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const getDateColumnIndex = () => {
    if (!columns.length) return -1;
    // Try to find a column named 'Date' (case-insensitive)
    return columns.findIndex(
      (header) => typeof header === 'string' && header.toLowerCase().includes('date')
    );
  };

  const filteredData = React.useMemo(() => {
    const dateIdx = getDateColumnIndex();
    if (dateIdx === -1 || (!dateRange.from && !dateRange.to)) return masterData;
    return [
      masterData[0],
      ...masterData.slice(1).filter((row) => {
        const cell = row[dateIdx];
        if (!cell) return false;
        const cellDate = new Date(cell);
        if (isNaN(cellDate)) return false;
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;
        if (fromDate && cellDate < fromDate) return false;
        if (toDate && cellDate > toDate) return false;
        return true;
      }),
    ];
  }, [masterData, dateRange]);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const onClientChange =(e) => {
    console.log("client", e.target.value); 
    const clientId = e.target.value;
    clientId ? setSelectedClientId(e.target.value) : setSelectedClientId('')
  }

  return (
    <div className="mt-4">   

      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        <button
          className="btn btn-primary"
          onClick={() => 
            handleShow()
          }
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
        />
        <button className="btn btn-success ms-auto"
         onClick={() => fetchAllCases()}
         >Export</button>
      </div>
      {!loading && masterData.length === 0 && <div className="text-center">No data available</div>}
      {loading && <div className="text-center">Loading...</div>}
      {!loading && masterData.length > 0 && (
         <TrackTable data={masterData} cols={columns} />
      )}     
      <ImportModal show={show} onClose={handleClose} onShow={handleShow} title={"Import Master Tracker"} onFileChange={handleImportFile} selectedClient={selectedClientId}
       onSelect={onClientChange} clients={clients}/>
    </div>
  )
}

export default AllCases