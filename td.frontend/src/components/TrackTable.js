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
      text: 'Case ID',
      // sort: true,
      width: 100,
    }, 
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
      width: 100,
    },
    {
      dataField: 'ird_frd',
      text: 'IRD/FRD',
      // sort: true,
      width: 100,
      formatter: formateDates
    },
    {
      dataField: 'de',
      text: 'DE',
      // sort: true,
      width: 150,
    },
    {
      dataField: 'assignedDateDe',
      text: 'Assigned Date (DE)',
      // sort: true,
      width: 100,
      formatter: formateDates
    },
    {
      dataField: 'qr',
      text: 'QR',
      // sort: true,
      width: 100,
    },
    {
      dataField: 'assignedDateQr',
      text: 'Assigned Date (QR)',
      // sort: true,
      width: 100,
      formatter: formateDates
    },
    {
      dataField: 'mr',
      text: 'MR',
      // sort: true,
      width: 100,
    },
    {
      dataField: 'assignedDateMr',
      text: 'Assigned Date (MR)',
      // sort: true,
      width: 100,
      formatter: formateDates
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
      width: 100,
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
  
  const selectRowConfig = {
    mode: 'checkbox',
    clickToSelect: true,
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
    <div className="mt-4">
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