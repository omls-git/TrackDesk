import React, { useRef, useState } from 'react'
import * as XLSX from 'xlsx';

const AllCases = () => {

  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });  
    console.log(`File imported: ${file.name}`);
    console.log(`Workbook:`, workbook);
    // const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets["Open Cases"];
    // console.log(`Processing sheet: ${sheetName}`);
    let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: true, defval: "" });
    console.log(jsonData); // Process the data as needed
    
    // Convert Excel serial dates to JS date strings in all cells that look like dates
    const isProbablyDate = (val) =>
      typeof val === 'number' && val > 25569 && val < 60000; // Excel date serial range

    // Find all columns whose header includes 'date' (case-insensitive)
    const dateColIdxs = jsonData[0]
      ? jsonData[0]
        .map((header, idx) =>
        ((typeof header === 'string' && header.toLowerCase().includes('date')) || header.includes('IRD/FRD')) ? idx : -1
        )
        .filter(idx => idx !== -1)
      : [];

    // Convert Excel serial dates to JS date strings for all date columns
    if (dateColIdxs.length > 0) {
      jsonData = jsonData.map((row, idx) => {
      if (idx === 0) return row;
      dateColIdxs.forEach(colIdx => {
        const cell = row[colIdx];
        if (isProbablyDate(cell)) {
        const jsDate = XLSX.SSF.parse_date_code(cell);
        if (jsDate) {
          // Add one day to fix the Excel date offset
          const dateObj = new Date(jsDate.y, jsDate.m-1, jsDate.d);
          // Format as "MMM-dd-yyyy"
          const month = dateObj.toLocaleString('en-US', { month: 'short' });
          const day = String(dateObj.getDate()).padStart(2, '0');
          const year = dateObj.getFullYear();
          row[colIdx] = `${month}-${day}-${year}`;
        }
        }
      });
      return row;
      });
    }

    setJsonData(jsonData);
  };

  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const getDateColumnIndex = () => {
    if (!jsonData.length) return -1;
    // Try to find a column named 'Date' (case-insensitive)
    return jsonData[0].findIndex(
      (header) => typeof header === 'string' && header.toLowerCase().includes('date')
    );
  };

  const filteredData = React.useMemo(() => {
    const dateIdx = getDateColumnIndex();
    if (dateIdx === -1 || (!dateRange.from && !dateRange.to)) return jsonData;
    return [
      jsonData[0],
      ...jsonData.slice(1).filter((row) => {
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
  }, [jsonData, dateRange]);
  return (
    <div className="mt-4">   

      <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={async (event) => {
            setLoading(true);
            await handleImportFile(event);
            setLoading(false);
          }}
        />
        <button
          className="btn btn-primary"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
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
        <button className="btn btn-success ms-auto">Export</button>
      </div>
      {loading && <div className="text-center">Loading...</div>}
      {!loading && jsonData.length > 0 && (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              {jsonData[0].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loading && jsonData.length === 0 && <div className="text-center">No data available</div>}
    </div>
  )
}

export default AllCases