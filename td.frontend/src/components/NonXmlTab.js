import React from 'react'
import PageTitle from './PageTitle'
import TrackTable from './TrackTable';
import { estimateWidth } from '../Utility';

const NonXmlTab = (props) => {
  const { addBookInCase, nonXmlLabels } = props;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCases, setSelectedCases] = React.useState([]);
  const [nonXmlData, setNonXmlData] = React.useState([]);

  const columns = [
    { dataField: 'id', text: 'ID', type: 'text', editable: false, hidden:true, headerStyle: () => ({ width: '100px', minWidth: '100px' }) },
    ...Object.entries(nonXmlLabels).map(([key, type]) => ({
      dataField: key,
      text: nonXmlLabels[key].label,
      editable: true,
      headerStyle: () => ({ width: estimateWidth(nonXmlLabels[key].label), minWidth: '100px' })
    }))
  ];

  // Define fetchNonXmlData function
  const fetchNonXmlData = () => {
    // TODO: Implement data fetching logic here
    // Example: setNonXmlData(fetchedData);
  }

  return (
    <div>
      <PageTitle title="NON-XML" searchTerm={searchTerm} setSearchTerm={setSearchTerm} addBookInCase={addBookInCase} />
      <TrackTable cols={columns}
      data={nonXmlData} 
      setSelectedCaseIds={setSelectedCases}
      selectedCaseIds={selectedCases} 
      setData={setNonXmlData}
      refreshData={fetchNonXmlData}
      />
    </div>
  )
}

export default NonXmlTab