import React from 'react'
import PageTitle from './PageTitle'

const XmlTab = (props) => {
  const { addBookInCase } = props;
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div>
      <PageTitle title="XML" searchTerm={searchTerm} setSearchTerm={setSearchTerm} addBookInCase={addBookInCase} />
      <div>XML Tab</div>
    </div>
  )
}

export default XmlTab