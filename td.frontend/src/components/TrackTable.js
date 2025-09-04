import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getClientAssigniesOfRole } from '../services/Common';
import {updateCase, updateToNext } from '../services/API';
import { useGlobalData } from '../services/GlobalContext';
import { caseStatusOptions, caseStatusOptionsCipla, formattedIST, getDaysOpen } from '../Utility';
import CaseDetailsModal from './CaseDetailsModal';

const TrackTable = (props) => {
  const { data } = props;
  const [des, setDes] = useState([]);
  const [qrs, setQrs] = useState([]);
  const [mrs, setMrs] = useState([]);
  // const [bookInAssignies, setBookInAssignies] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const { loggedUserName, isAdmin, isManager, users, currentClientId, allClients, user, isCipla } = useGlobalData();  

  const toolTipFormatter = (cell) => (
    <span title={cell} 
    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 150 }}>
      {cell}
    </span>
  )

  useEffect(() => {
     if (data && data.length > 0 && currentClientId && users && users.length > 0) {      
      const assignies = getClientAssigniesOfRole('data entry',currentClientId, users);
      setDes(assignies);
      const qrAssignies = getClientAssigniesOfRole('quality review',currentClientId, users);
      setQrs(qrAssignies);
      const mrAssignies = getClientAssigniesOfRole('medical review', currentClientId, users);
      setMrs(mrAssignies);
      // const bookInAssigniess = getClientAssigniesOfRole('book in', currentClientId, users);
      // setBookInAssignies(bookInAssigniess);
    }
  }, [currentClientId, data, users]);

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
      hidden:true,
      headerStyle: () => ({ width: '80px', minWidth: '50px' }),
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
      dataField: 'inital_fup',
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
    ...(currentClientId && isCipla? [
      {
        dataField: 'ReportType',
        text: 'Report Type',
        // sort: true,
        width: 100,
        editable: false,
        headerStyle: () => ({ width: '160px', minWidth: '150px' }),
        formatter: toolTipFormatter
      },
      {
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
      headerStyle: () => ({ width: '160px', minWidth: '100px' }),
      formatter: toolTipFormatter
    },
    {
    dataField: 'Country',
    text: 'Country',
    // sort: true,
    width: 100,
    editable: false,
    headerStyle: () => ({ width: '120px', minWidth: '100px' }),
    formatter: toolTipFormatter
  },
  {
    dataField: 'DestinationForReporting',
    text: 'Destination for Reporting',
    width: 100,
    editable: false,
    editor : {
      type: Type.TEXT,
      rows: 3,
    },
    headerStyle: () => ({ width: '160px', minWidth: '100px' }),
    formatter: toolTipFormatter
  },
  {dataField: 'SDEAObligation',
    text: 'SDEA Obligation',
    width: 100,
    editable: false,
    editor : {
      type: Type.TEXT,
      rows: 3,
    },
    headerStyle: () => ({ width: '160px', minWidth: '100px' }),
    formatter: toolTipFormatter
  },
  {dataField: 'Partner',
    text: 'Partner',
    width: 100,
    editable: false,
    editor : {
      type: Type.TEXT,
      rows: 3,
    },
    headerStyle: () => ({ width: '150px', minWidth: '100px' }),
    formatter: toolTipFormatter
  },
  {dataField: 'ReportingComment',
    text: 'Reporting Comment',
    width: 100,
    editable: false,
    editor : {
      type: Type.TEXT,
      rows: 3,
    },
    headerStyle: () => ({ width: '160px', minWidth: '100px' }),
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
      editable: isEditable || user?.assignTriage ? true : false,
      editor : {
        type: Type.SELECT,
        options: isCipla ? caseStatusOptionsCipla : caseStatusOptions
      },
      headerStyle: () => ({ width: '160px', minWidth: '150px' }),
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
      formatter: toolTipFormatter
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
  const pageSize = 50;
  return (
    <div className="mt-4 text-center table-responsive">
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
            const oldValue = typeof oldValueIn === 'boolean' || typeof oldValueIn === 'number' ? oldValueIn : oldValueIn?.trim();
            const newValue = typeof newValueIn === 'boolean' || typeof newValueIn === 'number' ? newValueIn : newValueIn?.trim();

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

            if(column.dataField === "deStatus" || column.dataField === "qrStatus" || column.dataField === "mrStatus" || column.dataField === 'triageStatus' || column.dataField === 'bookInWorkStatus'){
              updatedCase[column.dataField] = newValue.trim();
              if(column.dataField === "deStatus"){
                updatedCase.deStartedAt = newValue.trim() === "In Progress" ? formattedIST() : updatedCase.deStartedAt;
                if(newValue.trim() === "Completed"){
                  updatedCase.caseStatus = "Quality Review";
                }
              } else if(column.dataField === "qrStatus"){
                updatedCase.qrStartedAt = newValue.trim() === "In Progress" ? formattedIST() : updatedCase.qrStartedAt;
                if(newValue.trim() === "Completed"){
                  updatedCase.caseStatus = "Medical Review";
                }
              } else if(column.dataField === "mrStatus"){
                updatedCase.mrStartedAt = newValue.trim() === "In Progress" ? formattedIST() : updatedCase.mrStartedAt;
                if(newValue.trim() === "Completed"){
                  updatedCase.caseStatus = "Reporting";
                  updatedCase.isCaseOpen = false;
                }
              } else if(column.dataField === "triageStatus"){
                updatedCase.triageStartedAt = newValue.trim() === "In Progress" ? formattedIST() : updatedCase.triageStartedAt;
                if(newValue.trim() === "Completed"){
                  updatedCase.caseStatus = "Data Entry";
                  updatedCase.isCaseOpen = true;
                } else if(column.dataField === "bookInWorkStatus" ){
                  if(newValue.trim() === "Assigned"){
                    updatedCase.bookInStartedAt = null;
                    updatedCase.bookInCompletedAt = null;
                  }
                  if(newValue.trim() === "In Progress"){
                    updatedCase.bookInStartedAt = formattedIST();
                    updatedCase.bookInWorkCompletedAt = null;
                  }
                  if(newValue.trim() === "Completed"){
                    updatedCase.bookInCompletedAt = formattedIST();
                  }
                }
              }            
            }

            if(newValue && newValue.trim() === "Completed"){
              updatedCase = await updateToNext(updatedCase)
              props.setData((prevData) =>
                prevData.map((item) => (item.id === updatedCase.id ? { ...item, ...updatedCase } : item))
              );
              done(true)
              return;
            }
            if(column.dataField === "ird_frd"){
              updatedCase.casesOpen = getDaysOpen(updatedCase)
            }

            updatedCase[column.dataField] = typeof newValue === "string" ? newValue.trim() : newValue

            props.setData((prevData) =>
                prevData.map((item) => (item.id === updatedCase.id ? { ...item, ...updatedCase } : item))
              );
            
            if(newValue !== oldValue){              
              await updateCase(updatedCase);
            }            
            done(true);
          },
        })}
        pagination={ 
          data?.length > pageSize ? paginationFactory({
          sizePerPage: pageSize,
          hideSizePerPage: true,
          showTotal: data?.length > pageSize,
          hidePageListOnlyOnePage: true,
          paginationTotalRenderer: (from,  to, size) => {
            return ("Showing " + from + " to " + to + " of " + size + " entries")
            }
        }) : undefined}
      /> 
       <CaseDetailsModal show={!!selectedCase} onClose={() => setSelectedCase(null)} caseData={selectedCase} />
    </div>
  );
};

export default TrackTable;