import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const products = [
  { id: 1, name: 'Product 1', price: 120 },
  { id: 2, name: 'Product 2', price: 80 },
  { id: 3, name: 'Product 3', price: 150 },
];



const TrackTable = (props) => {
  const { data, cols } = props;
  const columns = cols.map((col) => ({
    dataField: col,
    text: col,
    width: 200,   
    // sort: col.sort || false,
  }));
  return (
    <div className="mt-4">
      <BootstrapTable
        keyField="Case Number"
        data={data}
        columns={columns}
        bootstrap4
        striped
        hover
        condensed
      />
    </div>
  );
};

export default TrackTable;