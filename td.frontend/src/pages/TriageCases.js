import React, { useEffect, useState } from 'react'
import Skeleton from '../components/Skeleton'
import TrackTable from '../components/TrackTable'
import { useGlobalData } from '../services/GlobalContext';
import { deleteCases, fetchCasesByClientId } from '../services/API';
import { Type } from 'react-bootstrap-table2-editor';
import { getClientAssigniesOfRole } from '../services/Common';
import { getDaysOpen } from '../Utility';
import DateEditor from '../components/DateEditor';
import { CV } from '../commonVariables/Variables';

const TriageCases = ({triageTab = false}) => {
  const [loading, setLoading] = useState(false);
  const [triageCases, setTriageCases] = useState([]);
  const [filteredTriageCases, setFilteredTriageCases] = useState([]);
  const [selectedTriageCaseIds, setSelectedTriageCaseIds] = useState([])
  const [triagees, setTriagees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { loggedUserName, allClients, currentClientId, isAdmin, isManager, users, isCipla } = useGlobalData();

   const fetchData = React.useCallback(async () => {
      setLoading(true)
      try {
        if(currentClientId){
          const allCases = await fetchCasesByClientId(currentClientId);
          if(allCases && allCases.length){
            const keys = Object.keys(allCases[0])
          console.log(keys);
            if(triageTab){
              const myTriageCases = allCases.filter(caseItem => caseItem.triageAssignedTo === loggedUserName 
              && !caseItem.triageCompletedAt);
              setFilteredTriageCases(myTriageCases)
              setTriageCases(myTriageCases)
            }else{              
              const triageCases = allCases.filter(caseItem => caseItem.caseStatus?.toLowerCase().trim().includes('triage'));
              setFilteredTriageCases(triageCases)
              setTriageCases(triageCases)
            }
          }
          if(users && users.length){
            const triageAssignies = getClientAssigniesOfRole('triage', currentClientId, users);
            setTriagees(triageAssignies)
          }        
        }        
      } catch (error) {
        console.error(error)
      } finally {
          setLoading(false)
      }
    }, [currentClientId, loggedUserName, triageTab, users]);

    useEffect(() => {
      fetchData()
    },[fetchData])

    const formateDates = (cell, row) => {    
      return cell ? cell.split('T')[0] : '';
    };
    const toolTipFormatter =(cell) => (
    <span title={cell} 
    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 100 }}>
      {cell}
    </span>
  );
  console.log( currentClientId, isCipla);
  
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
        sort: true,
        width: 100,
        editable: false,
        headerStyle: () => ({ width: '100px', minWidth: '100px' }),
        formatter: (cell, row) => {
          const numberOfDaysCaseOpen = getDaysOpen(row);
          return numberOfDaysCaseOpen
        },
      },
      {
        dataField: 'inital_fup',
        text: 'Initial/FUP/ Amendment',
        width: 100,
        editable: true,
        editor : {
          type: Type.SELECT,
          options: CV.inital_fupOptions
        },
        headerStyle: () => ({ width: '150px', minWidth: '130px' }),
      },
      {
        dataField: 'ird_frd',
        text: 'IRD/FRD',
        width: 100,
        editable: true,
        editor : {
          type: Type.DATE,
          dateFormat: 'YYYY-MM-DD',
        },
        editorRenderer: (editorProps, value) => <DateEditor { ...editorProps } value={ value } />,
        formatter: formateDates,
        headerStyle: () => ({ width: '110px', minWidth: '100px' })
      },      
      {
        dataField: 'ReportType',
        text: 'Report Type',
        width: 100,
        editable: true,
        editor : {
          type: Type.SELECT,
          options: CV.reportTypeOptions
        },
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),
        formatter: toolTipFormatter
      },
      {
        dataField: 'ORD',
        text: 'ORD',
        width: 100,
        editable: true,
        hidden : currentClientId && !isCipla,
        editor : {
          type: Type.DATE,
          dateFormat: 'YYYY-MM-DD',
        },
        editorRenderer: (editorProps, value) => <DateEditor { ...editorProps } value={ value } />,
        formatter: formateDates,
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),
      },
      {
        dataField: 'Source',
        text: 'Source',
        width: 100,
        editable: true,
        // hidden : currentClientId && !isCipla,
        editor : {
          type: Type.TEXTAREA,
          rows: 3,
        },
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),
        formatter: toolTipFormatter
      },
      {
        dataField: 'Country',
        text: 'Country',
        width: 100,
        editable: true,
        // hidden : currentClientId && isCipla,
        editor : {
          type: Type.TEXT,
          rows: 3,
        },
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),
        formatter: toolTipFormatter
      },
      {
        dataField: 'DestinationForReporting',
        text: 'Destination for Reporting',
        width: 100,
        editable: true,
        editor : {
          type: Type.SELECT,
          options: CV.destinationForReportingOptions,
        },
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),
        formatter: toolTipFormatter
      },
      {dataField: 'SDEAObligation',
        text: 'SDEA Obligation',
        width: 100,
        editable: true,
        editor : {
          type: Type.TEXT
        },
        headerStyle: () => ({ width: '110px', minWidth: '100px' }),
        formatter: toolTipFormatter
      },
      {dataField: 'Partner',
        text: 'Partner',
        width: 100,
        editable: true,
        editor : {
          type: Type.TEXT
        },
        headerStyle: () => ({ width: '150px', minWidth: '100px' }),
        formatter: toolTipFormatter
      },
      {dataField: 'Partner_as_MAH_Distributor',
        text: 'Partner as MAH/Distributor',
        width: 100,
        editable: true,
        editor : {
          type: Type.SELECT,
          options: CV.partnerAsOptions
        },
        headerStyle: () => ({ width: '170px', minWidth: '100px' }),
        // formatter: toolTipFormatter
      },
      {dataField: 'ReportingComment',
        text: 'Reporting Comment',
        width: 100,
        editable: true,
        editor : {
          type: Type.TEXT,
          rows: 3,
        },
        headerStyle: () => ({ width: '150px', minWidth: '100px' }),
        formatter: toolTipFormatter
      },
      {
        dataField: 'caseStatus',
        text: 'Case Status',
        width: 150,
        editable: (cell, row) => {
          // const editable = (isManager || isAdmin) ? true : false;
          return false;
        },
        editor : {
          type: Type.SELECT,
          options: isCipla ? CV.caseStatusOptionsCipla : CV.caseStatusOptions
        },
        headerStyle: () => ({ width: '150px', minWidth: '150px' }),
      },
      {
        dataField: 'reportability',
        text: 'Reportability',
        width: 150,
        editable: true,
        editor : {
          type: Type.SELECT,
          options: CV.reporatability
        },
        headerStyle: () => ({ width: '150px', minWidth: '150px' }),
      },
      {
        dataField: 'seriousness',
        text: 'Seriousness',
        width: 100,
        editable: true,
        editor : {
          type: Type.SELECT,
          options: CV.seriousnessOptions
        },
        headerStyle: () => ({ width: '150px', minWidth: '150px' }),
      },
      {
        dataField: 'eventSeriousness',
        text: 'Event Seriousness',
        width: 100,
        editable: true,
        editor : {
          type: Type.SELECT,
          options: CV.eventSeriousnessOptions
        },
        headerStyle: () => ({ width: '150px', minWidth: '150px' }),
      },
      {dataField: 'live_backlog',
        text: 'Live/Backlog',
        width: 100,
        editable: true,
        editor : {
          type: Type.SELECT,
          options: CV.live_backlogOptions
        },
        headerStyle: () => ({ width: '130px', minWidth: '100px' }),
        formatter: toolTipFormatter
      },
      {
        dataField: 'comments',
        text: 'Comments',
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
      },
      {
        dataField: 'triageAssignedTo',
        text: 'Triage Assigned To',
        width: 200,
        editable: isAdmin || isManager,
        editor : {
          type: Type.SELECT,
          options: triagees?.map(item => ({
            value: item.username,
            label: item.username
          })),
        },
        headerStyle: () => ({ width: '150px', minWidth: '150px' }),
      },
      {
        dataField: 'triageStatus',
        text: 'Status',
        width: 150,
        editable: (cell, row) => {
          const userName = loggedUserName;
          const isUser = row.triageAssignedTo === userName;
          return isUser || isAdmin || isManager
        },
        editor : {
          type: Type.SELECT,
          options: [
            { value: 'Assigned', label: 'Assigned' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' }
          ],
        },
        headerStyle: () => ({ width: '100px', minWidth: '100px' }),
      }
    ]
  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredTriageCases(triageCases);
    } else {
      const filtered = triageCases.filter(triageCase => triageCase.caseNumber.toLocaleLowerCase().includes(term.toLocaleLowerCase()));      
      setFilteredTriageCases(filtered);
    }
  };

  const handleDelete = async () => {
    if(!selectedTriageCaseIds || selectedTriageCaseIds.length === 0)return;
    await deleteCases(selectedTriageCaseIds);
    setSelectedTriageCaseIds([]);
    const refreshData = triageCases.filter(item => !selectedTriageCaseIds.includes(item.id));
    setFilteredTriageCases(refreshData);
    setTriageCases(refreshData);
  }
  return (
    <div>
      {
        !triageTab ?
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' }}>              
        <input
          type="text"
          placeholder="Search Case Number..."
            className="form-control"
          value={searchTerm}
          onChange={handleSearch}
          style={{ flex: 1, marginRight: '16px', maxWidth: '300px', paddingRight: '30px' }}
          />
          {searchTerm && (
            <span
              onClick={() => {setSearchTerm('');fetchData()}}
              style={{
                position: 'relative',
                right: '40px',
                cursor: 'pointer',
                color: '#aaa',
                fontWeight: 'bold',
                fontSize: '20px',
                zIndex: 2,
                userSelect: 'none'
              }}
              aria-label="Clear search"
              tabIndex={0}
              role="button"
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSearchTerm('')}
            >
              ×
            </span>
          )}
        {
          isAdmin || isManager ? 
        <button className="btn btn-danger" style={{ marginLeft: 'auto'}} onClick={handleDelete}>
          Delete {selectedTriageCaseIds.length ?'('+ selectedTriageCaseIds.length + ')' : ''}
        </button> : null
        }
      </div>: null
      }
      {loading && <Skeleton />}
          {triageCases.length > 0 && !loading ? (
            <TrackTable
              data={filteredTriageCases}
              cols={columns}
              setSelectedCaseIds={setSelectedTriageCaseIds}
              selectedCaseIds={selectedTriageCaseIds}
              clients={allClients}
              setData={setTriageCases}
              refreshData={fetchData}
            />
          ) : null}
          {!loading && triageCases.length === 0 && (
            <h4 className="text-center mb-4">No Cases Assigned</h4>
          )}
    </div>
  )
}

export default TriageCases