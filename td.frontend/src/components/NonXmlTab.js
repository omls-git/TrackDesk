import React from 'react'
import PageTitle from './PageTitle'
import TrackTable from './TrackTable';

const NonXmlTab = (props) => {
  const { addBookInCase } = props;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCases, setSelectedCases] = React.useState([]);
  const [nonXmlData, setNonXmlData] = React.useState([]);

  const columns = [
    { dataField: 'id', text: 'ID', type: 'text', editable: false, headerStyle: () => ({ width: '100px', minWidth: '100px' }) },
    { dataField: 'OM_ID', text: 'OM ID', type: 'text', editable: false, headerStyle: () => ({ width:"100px", minWidth: '150px' }) },
    { dataField: 'ird_frd', text: 'IRD/FRD', type: 'date', editable: false, headerStyle: () => ({width:"100px", minWidth: '120px' }) },
    { dataField: 'case_is_from', text: 'CASE IS FROM', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '140px' }) },
    { dataField: 'subjectLine', text: 'Subject line', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '140px' }) },
    { dataField: 'title_of_the_article', text: 'Title of the article', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '160px' }) },
    { dataField: 'bookInAssignedTo', text: 'Assigned to', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '120px' }) },
    { dataField: 'bookInReceiptDate', text: 'Book in Receipt date', type: 'date', editable: false, headerStyle: () => ({width:"100px", minWidth: '160px' }) },
    { dataField: 'bookInDueDate', text: 'Due date', type: 'date', editable: false, headerStyle: () => ({width:"100px", minWidth: '120px' }) },
    { dataField: 'bookInCompletedDate', text: 'Completed date', type: 'date', editable: false, headerStyle: () => ({width:"100px", minWidth: '140px' }) },
    { dataField: 'inital_fup', text: 'Initial/Follow-up', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '140px' }) },
    { dataField: 'bookInStatus', text: 'Book-in status', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '120px' }) },
    { dataField: 'no_of_cases_created', text: 'No.of cases created', type: 'number', editable: false, headerStyle: () => ({width:"100px", minWidth: '160px' }) },
    { dataField: 'daysOpen', text: 'Days Open', type: 'number', editable: false, headerStyle: () => ({width:"100px", minWidth: '100px' }) },
    { dataField: 'TAT_date', text: 'TAT date', type: 'date', editable: false, headerStyle: () => ({width:"100px", minWidth: '120px' }) },
    { dataField: 'allocation_Received_on', text: 'Allocation Received on', type: 'date', editable: false, headerStyle: () => ({width:"100px", minWidth: '180px' }) },
    { dataField: 'caseNumber', text: 'Case ID', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '100px' }) },
    { dataField: 'COI', text: 'COI', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '80px' }) },
    { dataField: 'sdeaObligation', text: 'SDEA Obligation', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '140px' }) },
    { dataField: 'suspect_drug', text: 'Suspect drug', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '120px' }) },
    { dataField: 'event', text: 'Event', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '100px' }) },
    { dataField: 'comment', text: 'Comment', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '120px' }) },
    { dataField: 'seriousness', text: 'Seriousness (fatal/Life threatining)', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '220px' }) },
    { dataField: 'LOE', text: 'LOE', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '80px' }) },
    { dataField: 'PQC', text: 'PQC', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '80px' }) },
    { dataField: 'openWorkflow', text: 'Open Workflow', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '120px' }) },
    // {dataField: 'bookInStatus', text: 'Book-in status', type: 'text', editable: false, headerStyle: () => ({width:"100px", minWidth: '120px' }) }
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