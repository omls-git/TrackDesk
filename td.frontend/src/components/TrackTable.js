import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const TrackTable = (props) => {
  const { data } = props;
   const formateDates = (cell, row) => {
    return cell ? cell.split('T')[0] : '';
  }
const columns = [ 
  {
    dataField: 'id',
    text: 'ID',
    sort: true,
    headerStyle: () => ({ width: '80px', minWidth: '50px' }),
  }, 
  {
    dataField: 'casesOpen',
    text: 'Cases Open',
    // sort: true,
    width: 100,
    headerStyle: () => ({ width: '100px', minWidth: '100px' }),
  },
  {
    dataField: 'project_id',
    text: 'Client ID',
    // sort: true,
    width: 100,
    headerStyle: () => ({ width: '100px', minWidth: '100px' }),
  },
  {
    dataField: 'caseNumber',
    text: 'Case Number',
    // sort: true,
    width: 200,
    headerStyle: () => ({ width: '150px', minWidth: '150px' }),
  },
  {
    dataField: 'initial_fup_fupToOpen',
    text: 'Initial/FUP/FUP to Open (FUOP)',
    // sort: true,
    width: 100,
    headerStyle: () => ({ width: '130px', minWidth: '130px' }),
  },
  {
    dataField: 'ird_frd',
    text: 'IRD/FRD',
    // sort: true,
    width: 100,
    formatter: formateDates,
    headerStyle: () => ({ width: '110px', minWidth: '100px' }),
  },
  {
    dataField: 'de',
    text: 'DE',
    // sort: true,
    width: 150,
    headerStyle: () => ({ width: '150px', minWidth: '150px' }),
  },
  {
    dataField: 'assignedDateDe',
    text: 'Assigned Date (DE)',
    // sort: true,
    width: 100,
    formatter: formateDates,
    headerStyle: () => ({ width: '110px', minWidth: '100px' }),
  },
  {
    dataField: 'qr',
    text: 'QR',
    // sort: true,
    width: 100,
    headerStyle: () => ({ width: '150px', minWidth: '100px' }),
  },
  {
    dataField: 'assignedDateQr',
    text: 'Assigned Date (QR)',
    // sort: true,
    width: 100,
    formatter: formateDates,
    headerStyle: () => ({ width: '110px', minWidth: '100px' }),
  },
  {
    dataField: 'mr',
    text: 'MR',
    // sort: true,
    width: 100,
    headerStyle: () => ({ width: '150px', minWidth: '100px' }),
  },
  {
    dataField: 'assignedDateMr',
    text: 'Assigned Date (MR)',
    // sort: true,
    width: 100,
    formatter: formateDates,
    headerStyle: () => ({ width: '110px', minWidth: '100px' }),
  },
  {
    dataField: 'caseStatus',
    text: 'Case Status',
    // sort: true,
    width: 150,
    headerStyle: () => ({ width: '150px', minWidth: '150px' }),
  },
  {
    dataField: 'reportability',
    text: 'Reportability',
    // sort: true,
    width: 150,
    headerStyle: () => ({ width: '150px', minWidth: '150px' }),
  },
  {
    dataField: 'seriousness',
    text: 'Seriousness',
    // sort: true,
    width: 100,
    headerStyle: () => ({ width: '100px', minWidth: '100px' }),
  },
  {
    dataField: 'comments',
    text: 'Comments',
    // sort: false,
    width: 200,
    headerStyle: () => ({ width: '200px', minWidth: '200px' }),
  }
]; 
  
  const selectRowConfig = {
    mode: 'checkbox',
    clickToSelect: true,
    classes: 'selected-row',
    style: { backgroundColor: '#c8e6c9' },
    selected: props.selectedCaseIds || [],
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        props.setSelectedCaseIds((prevSelected) => {
          if (!prevSelected.includes(row.id)) {
            return [...prevSelected, row.id];
          }
          return prevSelected;
        });
      } else {
        props.setSelectedCaseIds((prevSelected) => {
          return prevSelected.filter((item) => item !== row.id);
        });
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      if (isSelect) {
        const allIds = rows.map(row => row.id);
        props.setSelectedCaseIds(allIds);
      } else {
        props.setSelectedCaseIds([]);
      }
    }
  };
  return (
    <div className="mt-4 text-center">
      <BootstrapTable
        keyField="id"
        data={data}
        columns={columns}
        bootstrap4
        striped
        hover
        condensed
        selectRow={selectRowConfig}
      />
    </div>
  );
};

export default TrackTable;