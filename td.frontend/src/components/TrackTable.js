import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const TrackTable = (props) => {
  const { data } = props;
  
const columns = [  
    {
      dataField: 'casesOpen',
      text: 'Cases Open',
      sort: true,
      width: 100,
    },
    {
      dataField: 'caseNumber',
      text: 'Case Number',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'initial_fup_fupToOpen',
      text: 'Initial/FUP/FUP to Open (FUOP)',
      // sort: true,
      width: 200,
    },
    {
      dataField: 'ird_frd',
      text: 'IRD/FRD',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'assignedDateDe',
      text: 'Assigned Date (DE)',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'de',
      text: 'DE',
      // sort: true,
      width: 100,
    },
    {
      dataField: 'assignedDateQe',
      text: 'Assigned Date (QR)',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'qr',
      text: 'QR',
      // sort: true,
      width: 100,
    },
    {
      dataField: 'assignedDateMr',
      text: 'Assigned Date (MR)',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'mr',
      text: 'MR',
      // sort: true,
      width: 100,
    },
    {
      dataField: 'caseStatus',
      text: 'Case Status',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'reportability',
      text: 'Reportability',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'seriousness',
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
      dataField: 'comments',
      text: 'Comments',
      // sort: false,
      width: 200,
    }
  ];
  return (
    <div className="mt-4">
      <BootstrapTable
        keyField="caseNumber"
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