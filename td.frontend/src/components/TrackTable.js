import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const TrackTable = (props) => {
  const { data } = props;
  
const columns = [  
    {
      dataField: 'Cases open',
      text: 'Cases Open',
      sort: true,
      width: 100,
    },
    {
      dataField: 'Case Number',
      text: 'Case Number',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'Initial/FUP/FUP to Open (FUOP)',
      text: 'Initial/FUP/FUP to Open (FUOP)',
      // sort: true,
      width: 200,
    },
    {
      dataField: 'IRD/FRD',
      text: 'IRD/FRD',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'Assigned Date (DE)',
      text: 'Assigned Date (DE)',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'DE',
      text: 'DE',
      // sort: true,
      width: 100,
    },
    {
      dataField: 'Assigned Date (QR)',
      text: 'Assigned Date (QR)',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'QR',
      text: 'QR',
      // sort: true,
      width: 100,
    },
    {
      dataField: 'Assigned Date (MR)',
      text: 'Assigned Date (MR)',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'MR',
      text: 'MR',
      // sort: true,
      width: 100,
    },
    {
      dataField: 'Case Status',
      text: 'Case Status',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'Reportability',
      text: 'Reportability',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'Seriousness',
      text: 'Seriousness',
      // sort: true,
      width: 150,
    },
    // {
    //   dataField: 'Live/backlog',
    //   text: 'Live/Backlog',
    //   sort: true,
    //   width: 150,
    // },
    {
      dataField: 'Comments',
      text: 'Comments',
      // sort: false,
      width: 200,
    }
  ];
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