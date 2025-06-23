import axios from 'axios';
import { caseAllocation } from './Common';

const API_URL = 'http://localhost:5000/api';

export const fetchAllCases = async () => {
  try {
    const response = await axios.get(`${API_URL}/cases`);
    // console.log("response", response)
    return response.data;
  } catch (error) {
    console.error('Error fetching all cases:', error);
    // throw error;
  }
};

export const fetchCaseById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/cases/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all cases:', error);
    // throw error;
  }
};

export const postCases = async (cases, clientId) => {
  const sortCasesByPriority = cases.sort((a, b) => b["Cases open"] - a["Cases open"]);
  const allCases = await fetchAllCases();
  const selectedClientAllCases = allCases.filter((item) => item.project_id.toString() === clientId);
  console.log(selectedClientAllCases);
  const assignedCases = await caseAllocation(sortCasesByPriority, selectedClientAllCases, clientId);
  console.log("assignedCases", assignedCases);
  const clients = await getClients();
  const selectedClient = clients.find((item) => item.id.toString() === clientId.toString());
  assignedCases.map(async (item) => {
  const caseNumber = item.caseNumber;
  if(caseNumber){
      const existingCase = selectedClientAllCases.find((item) => item.caseNumber === caseNumber)
      // console.log("Existed case", res.data)
      if(existingCase){        
        console.log("case already exists with", caseNumber );
      }else{
        try {
          const body = item; // mapCaseToApiFormat(item, clientId);
          console.log("body", body)
          const res = await axios.post(`${API_URL}/cases/`, body)
          console.log("response post", res);
          //  alert(`Cases assigned successfully to Client: ${selectedClient.name}`);
          return res
        } catch (error) {
          console.error('error', error);
        }
      }
  }
 })
}

export const getEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/employee`);
    console.log("response get employees", response);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    // throw error;
  }
};

export const deleteCases = async (ids) => {
  let caseIds;
  if (!ids || ids.length === 0) {
    console.error('No case IDs provided for deletion');
    return;
  }
  if (Array.isArray(ids) && ids.length === 1) {
    caseIds = {"id" : ids[0]}; // Ensure ids is an array
  } else {
    caseIds = {"ids" : ids}; // Convert to the expected format
  }
  console.log("caseIds", caseIds);
  try {
    const response = await axios.delete(`${API_URL}/cases`, {
      data: caseIds, // Use the data property for DELETE requests with a body
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("response delete", response);
    // return response.data;
  } catch (error) {
    console.error('Error deleting cases:', error);
    // throw error;
  }
}

export const postEmployee = async (employee) => {
  try {
    const res = await axios.post(`${API_URL}/employee/addEmployee`, employee);
    return res.data;
  } catch (error) {
    console.error('Error posting employee:', error);
    throw error; // Always good to throw it for error handling on frontend
  }
};

export const getClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    // throw error;
  }
}

export const updateCase = async (item) => {
  console.log("item to update", item);
  // Format all date fields in item to 'YYYY-MM-DD HH:mm:ss' if they exist
  const formatDate = (date) =>
    date ? new Date(date).toISOString().slice(0, 19).replace("T", " ") : null;

  const updatedCase = {
    project_id: item.project_id,
    casesOpen: item.casesOpen,
    caseNumber: item.caseNumber,
    initial_fup_fupToOpen: item.initial_fup_fupToOpen,
    ird_frd: formatDate(item.ird_frd),
    assignedDateDe: formatDate(item.assignedDateDe),
    completedDateDE: formatDate(item.completedDateDE),
    de: item.de,
    assignedDateQr: formatDate(item.assignedDateQr),
    completedDateQR: formatDate(item.completedDateQR),
    qr: item.qr,
    assignedDateMr: formatDate(item.assignedDateMr),
    completedDateMr: formatDate(item.completedDateMr),
    mr: item.mr,
    caseStatus: item.caseStatus,
    reportability: item.reportability,
    seriousness: item.seriousness,
    live_backlog: item.live_backlog,
    comments: item.comments,
    isCaseOpen: item.isCaseOpen
  }
  try {
    const response = await axios.put(`${API_URL}/cases/${item.id}`, updatedCase);
    return response.data;
  } catch (error) {
    console.error('Error updating cases:', error);
    // throw error;
  }
}