import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Type } from 'react-bootstrap-table2-editor';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { updateEmployee } from '../services/API';
import { useGlobalData } from '../services/GlobalContext';

const EmployeeTable = (props) => {
  const { data, clients } = props;
  const { isManager, isAdmin } = useGlobalData();
  const isEditable = (cell,  row) => {
      const editable = (isManager|| isAdmin) ? true : false
      // console.log(isManager(row.project_id) , isAdmin(row.project_id))
      return editable
    }

  const columns = [
    {
      dataField: 'username',
      text: 'Name',
      width: 150,
      editable: false,
    },
    {
      dataField: 'level',
      text: 'Role',
      width: 150,
      editable: isEditable,
      editor : {
        type: Type.SELECT,
        options: [
          { value: 'None', label: 'None' },
          { value: 'Data Entry', label: 'Data Entry' },
          { value: 'Quality Review', label: 'Quality Review' },
          { value: 'Medical Review', label: 'Medical Review' }
        ],
      },
    },
    {
      dataField: 'projectId',
      text: 'Client',
      width: 150,
      editable: isEditable,
      editor: {
        type: Type.SELECT,
        options: clients?.map((client) => ({
          value : client.id,
          label : client.name,
        }))
      },
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
      editable: true,
      editor: {
        type: Type.SELECT,
        options: [
          { value: 0, label: "No"},
          { value: 1, label: 'Yes' }
        ]
      },
      formatter: (cell, row) => {
        return row.onLeave ? 'Yes' : 'No';
      }
    },
    {
      dataField: 'assignTriage',
      text: 'Assign Triage',
      width: 150,
      editable: true,
      editor: {
        type: Type.SELECT,
        options: [
          { value: 0, label: "No"},
          { value: 1, label: 'Yes' }
        ]
      },
      formatter: (cell, row) => {
        return row.assignTriage ? 'Yes' : 'No';
      }
    },
    ...(isAdmin || isManager ? [{
      dataField: 'permission',
      text: 'Permission',
      width: 150,
      editable: true,
      editor: {
        type: Type.SELECT,
        options: [
          { value: 'Admin', label: 'Admin' },
          { value: 'Manager', label: 'Manager' },
          { value: 'User', label: 'User' }
        ]
      }     
    }] : [])   
  ];

   const selectRowConfig = {
    mode: 'checkbox',
    classes: 'selected-row',
    style: { backgroundColor: '#c8e6c9' },
    selected: props.selectedEmployeeIds || [],
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        props.setSelectedEmployeeIds((prevSelected) => {
          if (!prevSelected.includes(row.id)) {
            return [...prevSelected, row.id];
          }
          return prevSelected;
        });
      } else {
        props.setSelectedEmployeeIds((prevSelected) => {
          return prevSelected.filter((item) => item !== row.id);
        });
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      if (isSelect) {
        const allIds = rows.map(row => row.id);
        props.setSelectedEmployeeIds(allIds);
      } else {
        props.setSelectedEmployeeIds([]);
      }
    }
  };

  return (
    <div className="mt-4 text-center">
      <BootstrapTable
        keyField="id"
        data={data}
        columns={columns.map(col => ({
          ...col,
          headerAlign: col.dataField === 'id' ? 'center' : 'left',
          align: col.dataField === 'id' ? 'center' : 'left'
        }))}
        bootstrap4
        striped
        hover
        condensed
        selectRow={selectRowConfig}
        cellEdit={cellEditFactory({
          mode: 'click',
          blurToSave: true,
          beforeSaveCell: (
            oldValueIn,
            newValueIn,
            row,
            column,
            done
          ) => {
            const oldValue = oldValueIn;
            const newValue = newValueIn;
            if (oldValue === newValue || (!oldValue && !newValue)) {
              done(true); // No change, allow saving
              return;
            }
            let updatedEmp = row;
            if (column.dataField === 'onLeave') {
              updatedEmp[column.dataField] = newValue === "1" ? true : false
            } else {
              updatedEmp[column.dataField] = newValue;
            }

            if (newValue !== oldValue) {
              updateEmployee(updatedEmp).then(() => {
                props.refreshData()
              })
            }
            done(true);
          },
        })}
      />
    </div>
  );
};

export default EmployeeTable;
