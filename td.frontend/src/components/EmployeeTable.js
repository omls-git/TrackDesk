import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const EmployeeTrackTable = (props) => {
  const { data } = props;

  const columns = [
    {
      dataField: 'username',
      text: 'Name',
      width: 150,
    },
    {
      dataField: 'level',
      text: 'Level',
      width: 150,
    },
    {
      dataField: 'projectId',
      text: 'Client',
      width: 150,
    },
    {
      dataField: 'onLeave',
      text: 'On Leave',
      width: 150,
    },
    {
      dataField: 'permission',
      text: 'Permission',
      width: 150,
     
    },
    {
      dataField: 'isAdmin',
      text: 'Is Admin',
      width: 100,
      
    }
  ];

  return (
    <div className="mt-4">
      <BootstrapTable
        keyField="id"
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

export default EmployeeTrackTable;
