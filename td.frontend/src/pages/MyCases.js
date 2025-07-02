import React, { useEffect, useState } from 'react'
import TrackTable from '../components/TrackTable'
import { fetchCasesByClientId } from '../services/API'
import { useGlobalData } from '../services/GlobalContext'
import Skeleton from '../components/Skeleton'

const MyCases = () => {
  const [myCases, setMyCases] = useState([])
  const [selectedMyCases, setSelectedMyCases] = useState([]);
  const { loggedUserName, user, allClients } = useGlobalData();
  const [loading, setLoading] = useState(false);
  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      if(user){
        const allCases = await fetchCasesByClientId(user?.projectId);
        if(allCases){
          const myCases = allCases.filter(caseItem => [caseItem.de, caseItem.qr, caseItem.mr].includes(loggedUserName) && (caseItem.completedDateDE === null || caseItem.completedDateDE === '' || caseItem.completedDateQR === null || caseItem.completedDateQR === '' || caseItem.completedDateMr === null || caseItem.completedDateMr === ''));
          setMyCases(myCases);
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setInterval(() => {
        setLoading(false)
      }, 1000);
      
    }    
  }, [user, loggedUserName]);

  useEffect(() => {
    fetchData();    
  }, [fetchData]);
  return (
    <div className='mt-2'>
      <h4>My Cases</h4>
      {loading && <Skeleton />}
      {myCases.length > 0 && !loading ? (
        <TrackTable data={myCases} cols={null}
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