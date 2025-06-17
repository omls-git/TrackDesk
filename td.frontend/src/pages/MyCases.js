import React, { useEffect, useState } from 'react'
import TrackTable from '../components/TrackTable'
import { fetchAllCases } from '../services/API'
import { useMsal } from '@azure/msal-react'

const MyCases = () => {
  const [myCases, setMyCases] = useState([])
  const [selectedMyCases, setSelectedMyCases] = useState([]);
  const { accounts } = useMsal();
  useEffect(() => {
    const userName = accounts.length > 0 ? accounts[0].name : '';
    async function fetchData() {
      const allCases = await fetchAllCases();
      const myCases = allCases.filter(caseItem => [caseItem.de, caseItem.qr, caseItem.mr].includes(userName) && (caseItem.completedDateDE === null || caseItem.completedDateDE === '' || caseItem.completedDateQR === null || caseItem.completedDateQR === '' || caseItem.completedDateMr === null || caseItem.completedDateMr === ''));
      setMyCases(myCases);
    }
    fetchData();
  }, [accounts]);

  return (
    <div className='mt-2'>
      <h4>My Cases</h4>
      {myCases.length > 0 ? (<TrackTable data={myCases} cols={null} setSelectedCaseIds={setSelectedMyCases} selectedCaseIds={selectedMyCases} />
      ) : (
        <h4 className="text-center mb-4">No Cases Assigned</h4>
      )}
      
    </div>
  )
}

export default MyCases