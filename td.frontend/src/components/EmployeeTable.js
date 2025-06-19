import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const EmployeeTrackTable = (props) => {
  const { data, clients } = props;

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
      formatter: (cell, row) => {
        if (clients && clients.length > 0) {
          const client = clients.find(c => c.id === row.projectId);
          return client ? client.name : row.projectId;
        }
        return row.projectId;
      }
    },
    {
      dataField: 'onLeave',
      text: 'On Leave',
      width: 150,
      formatter: (cell, row) => {
        return row.onLeave ? 'Yes' : 'No';
      }
    },
    {
      dataField: 'permission',
      text: 'Permission',
      width: 150,
     
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
