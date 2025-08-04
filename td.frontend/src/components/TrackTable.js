import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// import paginationFactory from 'react-bootstrap-table2-paginator';
import { getClientAssigniesOfRole } from '../services/Common';
import { useCallback } from 'react';
import {updateCase, updateToNext } from '../services/API';
import { useGlobalData } from '../services/GlobalContext';
import { formattedIST, getDaysOpen } from '../Utility';
import CaseDetailsModal from './CaseDetailsModal';

const TrackTable = (props) => {
  const { data, clients } = props;
  const [des, setDes] = useState([]);
  const [qrs, setQrs] = useState([]);
  const [mrs, setMrs] = useState([]);  
  const [selectedCase, setSelectedCase] = useState(null);
  const { loggedUserName, isAdmin, isManager, isUser, currentClientId, allClients } = useGlobalData();  
  const toolTipFormatter = (cell) => (
    <span title={cell} 
    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 100 }}>
      {cell}
    </span>
  )

  const fetchAssignes = useCallback(async () => {
    if (data && data.length > 0) {
      const assignies = await getClientAssigniesOfRole('data entry',currentClientId);
      setDes(assignies);
      const qrAssignies = await getClientAssigniesOfRole('quality review',currentClientId);
      setQrs(qrAssignies);
      const mrAssignies = await getClientAssigniesOfRole('medical review', currentClientId);
      setMrs(mrAssignies);
    }
  }, [data, currentClientId]);

  useEffect(() => {
    fetchAssignes();
  }, [fetchAssignes]);

  const isEditable = (cell,  row) => {
    const editable = (isManager || isAdmin) ? true : false
    return editable
  }
   const formateDates = (cell, row) => {    
    return cell ? cell.split('T')[0] : '';
  }

  const columns = [ 
    {
      dataField: 'id',
      text: 'ID',
      sort: true,
      editable: false,
      headerStyle: () => ({ width: '80px', minWidth: '50px' }),
    }, 
    {
      dataField: 'casesOpen',
      text: 'Days Open',
      // sort: true,
      width: 100,
      editable: false,
      headerStyle: () => ({ width: '100px', minWidth: '100px' }),
      formatter: (cell, row) => {
        const numberOfDaysCaseOpen = getDaysOpen(row);
        return numberOfDaysCaseOpen
      }
    },
    {
      dataField: 'project_id',
      text: 'Client ID',
      // sort: true,
      width: 100,
      editable: false,
      headerStyle: () => ({ width: '100px', minWidth: '100px' }),
      formatter: (cell, row) => {
        if (clients && clients.length > 0) {
          const client = clients.find(c => c.id === row.project_id);
          return client ? client.name : row.project_id;
        }
        return row.project_id;
      }
    },
    {
      dataField: 'caseNumber',
      text: 'Case Number',
      // sort: true,
      width: 200,
      editable: false,
      headerStyle: () => ({ width: '150px', minWidth: '150px' }),
      // formatter: (cell, row) => {
      //   return (
      //     <span 
      //       style={{ cursor: 'pointer', color: 'blue' }} 
      //       onClick={() => setSelectedCase(row)}
      //     >
      //       {cell}
      //     </span>
      //   );
      // }
    },
    {
      dataField: 'initial_fup_fupToOpen',
      text: 'Initial/FUP',
      // sort: true,
      width: 100,
      editable: false,
      headerStyle: () => ({ width: '130px', minWidth: '130px' }),
    },
    {
      dataField: 'ird_frd',
      text: 'IRD/FRD',
      // sort: true,
      width: 100,
      editable: false,
      // editor : {
      //   type: Type.DATE,
      //   dateFormat: 'YYYY-MM-DD',
      // },
      formatter: formateDates,
      headerStyle: () => ({ width: '110px', minWidth: '100px' }),
    },
    ...(currentClientId && allClients.find((client) => client.id.toString() === currentClientId)?.name?.toLowerCase() === "cipla" ? [{
      dataField: 'ORD',
      text: 'ORD',
      // sort: true,
      width: 100,
      editable: false,
      formatter: formateDates,
      headerStyle: () => ({ width: '110px', minWidth: '100px' }),
    },
    {dataField: 'Source',
      text: 'Source',
      // sort: true,
      width: 100,
      editable: false,
      headerStyle: () => ({ width: '110px', minWidth: '100px' }),
      formatter: toolTipFormatter
    }
  ] : []),
    {
      dataField: 'de',
      text: 'DE',
      // sort: true,
      width: 150,
      editable: (cell, row) => {
        return loggedUserName === row.de || isAdmin || isManager;
      },
      editor: {
        type: Type.SELECT,
        options: des?.map(item => ({
          value: item.username,
          label: item.username
        })),
      },
      headerStyle: () => ({ width: '150px', minWidth: '150px' }),
    },
    {
      dataField: 'assignedDateDe',
      text: 'Assigned Date (DE)',
      // sort: true,
      width: 100,
      editable: false,
      // editor : {
      //   type: Type.DATE,
      //   dateFormat: 'YYYY-MM-DD',
      // },
      formatter: formateDates,
      headerStyle: () => ({ width: '110px', minWidth: '100px' }),
    },
    {
      dataField: 'qr',
      text: 'QR',
      // sort: true,
      width: 100,
      editable: (cell, row) => {
        return loggedUserName === row.qr || isAdmin || isManager;
      },
      editor : {
        type: Type.SELECT,
        options: qrs?.map(item => ({
          value: item.username,
          label: item.username
        })),
      },
      headerStyle: () => ({ width: '150px', minWidth: '100px' }),
    },
    {
      dataField: 'assignedDateQr',
      text: 'Assigned Date (QR)',
      // sort: true,
      width: 100,
      editable: false,
      // editor : {
      //   type: Type.DATE,
      //   dateFormat: 'YYYY-MM-DD',
      // },
      formatter: formateDates,
      headerStyle: () => ({ width: '110px', minWidth: '100px' }),
    },
    {
      dataField: 'mr',
      text: 'MR',
      // sort: true,
      width: 100,
      // hidden: true,
      editable: (cell, row) => {
        return loggedUserName === row.mr || isAdmin || isManager;
      },
      editor : {
        type: Type.SELECT,
        options: mrs?.map(item => ({
          value: item.username,
          label: item.username
        })),
      },
      headerStyle: () => ({ width: '150px', minWidth: '100px' }),
    },
    {
      dataField: 'assignedDateMr',
      text: 'Assigned Date (MR)',
      // sort: true,
      width: 100,
      editable: false,
      // editor : {
      //   type: Type.DATE,
      //   dateFormat: 'YYYY-MM-DD',
      // },
      formatter: formateDates,
      headerStyle: () => ({ width: '110px', minWidth: '100px' }),
    },
    {
      dataField: 'caseStatus',
      text: 'Case Status',
      // sort: true,
      width: 150,
      editable: isEditable,
      editor : {
        type: Type.SELECT,
        options: [
          { value: 'Reporting', label: 'Reporting' },
          { value: 'Data Entry', label: 'Data Entry' },
          { value: 'Quality Review', label: 'Quality Review' },
          { value: 'Medical Review', label: 'Medical Review' }
        ],
      },
      headerStyle: () => ({ width: '150px', minWidth: '150px' }),
    },
    {
      dataField: 'reportability',
      text: 'Reportability',
      // sort: true,
      width: 150,
      editable: false,
      headerStyle: () => ({ width: '150px', minWidth: '150px' }),
    },
    {
      dataField: 'seriousness',
      text: 'Seriousness',
      // sort: true,
      width: 100,
      editable: false,
      headerStyle: () => ({ width: '100px', minWidth: '100px' }),
    },
    {
      dataField: 'comments',
      text: 'Comments',
      // sort: false,
      width: 200,
      editable: (cell, row) => {
        const userName = loggedUserName;
        const isAnyUser = [row.de, row.qr, row.mr].includes(userName);
        return isAnyUser || isAdmin || isManager
      },
      editor : {
        type: Type.TEXTAREA,
        rows: 3,
      },
      headerStyle: () => ({ width: '200px', minWidth: '200px' }),
    }
  ]; 

  const selectRowConfig = {
    mode: 'checkbox',
    // clickToSelect: true,
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
        columns={props.cols ?  props.cols : columns}
        bootstrap4
        striped
        hover
        condensed
        selectRow={selectRowConfig}
        cellEdit={cellEditFactory({
          mode: 'click',
          blurToSave: true,
           beforeSaveCell: async(
              oldValueIn,
              newValueIn,
              row,
              column,
              done
          ) =>{
            const oldValue = oldValueIn?.trim();
            const newValue = newValueIn?.trim();

            if (oldValue === newValue || (!oldValue && !newValue)) {
              done(true); // No change, allow saving
              return;
            }
            let updatedCase = row;

            if(column.dataField === "caseStatus"){
              updatedCase[column.dataField] = newValue.trim();
              if((newValue.toLowerCase().trim() === "quality review" && oldValue.toLowerCase().trim() === "data entry") || 
                (newValue.toLowerCase().trim() === "medical review" && oldValue.toLowerCase().trim() === "quality review") || 
                (newValue.toLowerCase().trim() === "reporting" && oldValue.toLowerCase().trim() === "medical review")){
                const caseUpdated = await updateToNext(updatedCase)
                console.log(caseUpdated)
                props.setData((prevData) =>
                prevData.map((item) => (item.id === caseUpdated.id ? { ...item, ...caseUpdated } : item))
                );              
                done(true)
                return
              }
              alert("You cannot change the case status to " + newValue + " directly from " + oldValue + ". Please update it step by step.");
              updatedCase[column.dataField] = oldValue.trim();
                props.setData((prevData) =>
                prevData.map((item) => (item.id === updatedCase.id ? { ...item, ...updatedCase } : item))
              );
              done(true)
              return;
            }

            if(column.dataField === "de" || column.dataField === "qr" || column.dataField === "mr"){
              if(newValue !== oldValue){
                updatedCase[column.dataField] = newValue.trim();                
                if(column.dataField === "de"){
                  updatedCase.assignedDateDe = formattedIST();
                  updatedCase.deStatus = "Assigned";
                } else if(column.dataField === "qr"){
                  updatedCase.assignedDateQr = formattedIST();
                  updatedCase.qrStatus = "Assigned";
                } else if(column.dataField === "mr"){
                  updatedCase.assignedDateMr = formattedIST();
                  updatedCase.mrStatus = "Assigned";
                }
                props.setData((prevData) =>
                  prevData.map((item) => (item.id === updatedCase.id ? { ...item, ...updatedCase } : item))
                );
                await updateCase(updatedCase);
                done(true);
                return;
              }
            }

            if(column.dataField === "deStatus" || column.dataField === "qrStatus" || column.dataField === "mrStatus"){
              updatedCase[column.dataField] = newValue.trim();
              if(column.dataField === "deStatus"){
                updatedCase.deStartedAt = newValue.trim() === "In Progress" ? formattedIST() : updatedCase.deStartedAt;
                if(newValue.trim() === "Completed"){
                  updatedCase.caseStatus = "Quality Review";
                   updatedCase = await updateToNext(updatedCase)
                }
              } else if(column.dataField === "qrStatus"){
                updatedCase.qrStartedAt = newValue.trim() === "In Progress" ? formattedIST() : updatedCase.qrStartedAt;
                if(newValue.trim() === "Completed"){
                  updatedCase.caseStatus = "Medical Review";
                   updatedCase = await updateToNext(updatedCase)
                }
              } else if(column.dataField === "mrStatus"){
                updatedCase.mrStartedAt = newValue.trim() === "In Progress" ? formattedIST() : updatedCase.mrStartedAt;
                if(newValue.trim() === "Completed"){
                  updatedCase.caseStatus = "Reporting";
                  updatedCase.isCaseOpen = false;
                  updatedCase = await updateToNext(updatedCase)
                }
              }
              props.setData((prevData) =>
                prevData.map((item) => (item.id === updatedCase.id ? { ...item, ...updatedCase } : item))
              );
              done(true);
              return;
            }

            updatedCase[column.dataField] = newValue.trim();
            props.setData((prevData) =>
                prevData.map((item) => (item.id === updatedCase.id ? { ...item, ...updatedCase } : item))
              );
            if(newValue !== oldValue){
              await updateCase(updatedCase);
            }            
            done(true);
          },
        })}
        // pagination={paginationFactory({
        //   sizePerPage: 30,
        //   hideSizePerPage: true,
        //   showTotal: data.length > 30,
        //   totalSize: data.length,
        //   paginationTotalRenderer: (from, to, size) => {
        //     return ("Showing " + from + " to " + to + " of " + size + " entries")
        //     }
        // })}
      /> 
       <CaseDetailsModal show={!!selectedCase} onClose={() => setSelectedCase(null)} caseData={selectedCase} />
    </div>
  );
};

export default TrackTable;