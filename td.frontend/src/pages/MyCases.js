import React, { useCallback, useEffect, useState } from 'react'
import TrackTable from '../components/TrackTable'
import { fetchCasesByClientId } from '../services/API'
import { useGlobalData } from '../services/GlobalContext'
import Skeleton from '../components/Skeleton'
import { getDaysOpen } from '../Utility'
import { Type } from 'react-bootstrap-table2-editor'
import { getClientAssigniesOfRole } from '../services/Common'

const MyCases = () => {
  const [myCases, setMyCases] = useState([])
  const [selectedMyCases, setSelectedMyCases] = useState([]);
  const { loggedUserName, allClients, currentClientId,isAdmin, isManager, users,user } = useGlobalData();
  const [loading, setLoading] = useState(false);
  const [des, setDes] = useState([]);
  const [qrs, setQrs] = useState([]);
  const [mrs, setMrs] = useState([]);
  const toolTipFormatter = (cell) => (
    <span title={cell} 
    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 100 }}>
      {cell}
    </span>
  )

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      if(currentClientId){
        const allCases = await fetchCasesByClientId(currentClientId);
        if(allCases){
          if(user && user.level === 'Data Entry'){
            const myCases = allCases.filter(caseItem => caseItem.de === loggedUserName 
              && (caseItem.completedDateDE === null || caseItem.completedDateDE === ''));
            setMyCases(myCases);
          } else if(user && user.level === 'Quality Review'){
            const myCases = allCases.filter(caseItem => caseItem.qr === loggedUserName && (caseItem.completedDateQR === null || caseItem.completedDateQR === ''));
            setMyCases(myCases);
          } else if(user && user.level === 'Medical Review'){
            const myCases = allCases.filter(caseItem => caseItem.mr === loggedUserName
            && (caseItem.completedDateMr === null || caseItem.completedDateMr === ''));
            setMyCases(myCases);
          }
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setInterval(() => {
        setLoading(false)
      }, 1000);
      
    }
  }, [currentClientId, loggedUserName, user]);

  const fetchAssignes = useCallback(async () => {
        const assignies = await getClientAssigniesOfRole('data entry',currentClientId);
        setDes(assignies);
        const qrAssignies = await getClientAssigniesOfRole('quality review',currentClientId);
        setQrs(qrAssignies);
        const mrAssignies = await getClientAssigniesOfRole('medical review', currentClientId);
        setMrs(mrAssignies);
    }, [currentClientId]);

  useEffect(() => {
    fetchData();
    fetchAssignes();

  }, [fetchData, fetchAssignes, users, loggedUserName, currentClientId]);

  // const isEditable = (cell,  row) => {
  //   const editable = (isManager || isAdmin) ? true : false
  //   return editable
  // }
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
          if (allClients && allClients.length > 0) {
            const client = allClients.find(client => client.id === row.project_id);
            return client ? client.name : row.project_id;
          }
          return row.project_id;
        }
      },
      {
        dataField: 'caseNumber',
        text: 'Case Number(ID)',
        // sort: true,
        width: 200,
        editable: false,
        headerStyle: () => ({ width: '150px', minWidth: '150px' }),
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
    ...(user && user.level === 'Data Entry' ? [
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
        dataField: 'deStatus',
        text: 'DE Status',
        width: 100,
        editable: (cell, row) => {
          return loggedUserName === row.de || isAdmin || isManager;
        },
        editor : {
          type: Type.SELECT,
          options: [
            { value: 'Assigned', label: 'Assigned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
          ],
        },
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),
      }
    ] : []),
      ...(user && user.level === 'Quality Review' ? [
      {
        dataField: 'qr',
        text: 'QR',
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
        width: 100,
        editable: false,
        formatter: formateDates,
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),
      },
      {
        dataField: 'qrStatus',
        text: 'QR Status',
        width: 100,
        editable: (cell, row) => {
          return loggedUserName === row.qr || isAdmin || isManager;
        },
        editor : {
          type: Type.SELECT,
          options: [
            { value: 'Assigned', label: 'Assigned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
          ],
        },
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),        
      }
    ] : []),
      ...(user && user.level === 'Medical Review' ? [
      {
        dataField: 'mr',
        text: 'MR',
        width: 100,
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
        width: 100,
        editable: false,
        formatter: formateDates,
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),
      },
      {
        dataField: 'mrStatus',
        text: 'MR Status',
        width: 100,
        editable: (cell, row) => {
          return loggedUserName === row.mr || isAdmin || isManager;
        },
        editor : {
          type: Type.SELECT,
          options: [
            { value: 'Assigned', label: 'Assigned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
          ],
        },
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),
      }
    ] : []),
      {
        dataField: 'caseStatus',
        text: 'Case Status',
        // sort: true,
        width: 150,
        editable: false,
        // editor : {
        //   type: Type.SELECT,
        //   options: [
        //     { value: 'Reporting', label: 'Reporting' },
        //     { value: 'Data Entry', label: 'Data Entry' },
        //     { value: 'Quality Review', label: 'Quality Review' },
        //     { value: 'Medical Review', label: 'Medical Review' }
        //   ],
        // },
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
  return (
    <div className='mt-2'>
      <h4>My Cases</h4>
      {loading && <Skeleton />}
      {myCases.length > 0 && !loading ? (
        <TrackTable data={myCases} cols={columns}
        setSelectedCaseIds={setSelectedMyCases} 
        selectedCaseIds={selectedMyCases}
        clients={allClients}
        setData={setMyCases}
        refreshData={fetchData} />
      ) : null}
      {!loading && myCases.length === 0 &&  <h4 className="text-center mb-4">No Cases Assigned</h4>}
    </div>
  )
}

export default MyCases