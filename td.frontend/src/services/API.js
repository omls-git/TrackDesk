import axios from 'axios';
import { caseAllocation, userAssignedCasesCount } from './Common';
import { formattedIST, modifiedNameDate } from '../Utility';

const API_URL = 'http://localhost:5000/api';

export const fetchAllCases = async () => {
  try {
    const response = await axios.get(`${API_URL}/cases`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all cases:', error);
    // throw error;
  }
};

export const fetchAllOpenCases = async (isOpen) => {
  try {
    const response = await axios.get(`${API_URL}/cases`, {params:{data: isOpen}});
    return response.data;
  } catch (error) {
    console.error('Error fetching all open cases:', error);
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

export const fetchCasesByClientId = async (project_id) => {
  try {
    const response = await axios.get(`${API_URL}/cases/by-project/${project_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all cases of ',project_id, error);
    // throw error;
  }
};

export const postCases = async (cases, clientId) => {
  const sortCasesByPriority = cases.sort((a, b) => b["Cases open"] - a["Cases open"]);

  const allCases = await fetchCasesByClientId(clientId);

  const selectedClientAllCases = allCases?.filter((item) => item.project_id.toString() === clientId.toString());

  const assignedCases = await caseAllocation(sortCasesByPriority, selectedClientAllCases, clientId);
console.log(assignedCases);

  // const clients = await getClients();

  // const selectedClient = clients.find((item) => item.id.toString() === clientId.toString());

//   assignedCases.map(async (item) => {
//   const caseNumber = item.caseNumber;
//   if(caseNumber){
//       const existingCase = selectedClientAllCases?.find((item) => item.caseNumber === caseNumber)
//       // console.log("Existed case", res.data)
//       if(existingCase){        
//         console.log(`case already exists in ${clientId} with`, caseNumber );
//       }else{
//         try {
//           const body = item; 
//           const res = await axios.post(`${API_URL}/cases/`, body)
//           return res
//         } catch (error) {
//           console.error('error', error);
//         }
//       }
//   }
//  })
}

export const getEmployees = async () => {
  try {
    const response = await axios.get(`${API_URL}/employee`);
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
  try {
    const response = await axios.delete(`${API_URL}/cases`, {
      data: caseIds, // Use the data property for DELETE requests with a body
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
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
  const formatDate = (date) => date ? formattedIST(date) : null;
  const updatedCase = {
    project_id: item.project_id,
    casesOpen: item.casesOpen,
    caseNumber: item.caseNumber,
    initial_fup_fupToOpen: item.initial_fup_fupToOpen,
    ird_frd: formatDate(item.ird_frd),
    assignedDateDe: formatDate(item.assignedDateDe),
    completedDateDE: formatDate(item.completedDateDE),
    de: item.de,
    deStatus: item.deStatus,
    deStartedAt: formatDate(item.deStartedAt),
    assignedDateQr: formatDate(item.assignedDateQr),
    completedDateQR: formatDate(item.completedDateQR),
    qr: item.qr,
    qrStartedAt: formatDate(item.qrStartedAt),
    qrStatus: item.qrStatus,
    assignedDateMr: formatDate(item.assignedDateMr),
    completedDateMr: formatDate(item.completedDateMr),
    mr: item.mr,
    mrStatus: item.mrStatus,
    mrStartedAt: formatDate(item.mrStartedAt),
    caseStatus: item.caseStatus,
    reportability: item.reportability,
    seriousness: item.seriousness,
    live_backlog: item.live_backlog,
    comments: item.comments,
    Country : item.Country,
    Partner: item.Partner,
    modifiedOn: formattedIST(),
    modifiedBy: localStorage.getItem("userName") || "",
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

export const updateEmployee = async(employee) => {
try {
    const response = await axios.put(`${API_URL}/employee/${employee.id}`, employee);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    // throw error;
  }
}

export const deleteEmployees = async(ids) => {
  const deleteIds = {"ids": ids}

  try {
    const response = await axios.delete(`${API_URL}/employee`, {
      data: deleteIds,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response
  } catch (error) {
    console.error("Error deleting Employee(s) ", error)
  }
}


export const updateToNext = async (updatedCase) => {
  const assignies = await getEmployees();
  const clientAssignies = assignies.filter((item) => item.projectId.toString() === updatedCase.project_id.toString() && !item.onLeave);
  const allOpenCases = await fetchAllOpenCases(true);
  let isUpdated = true;
  // console.log(clientAssignies, clientId, assignies)
  const selectedClientOpenCases = allOpenCases.filter(
    (item) => item.project_id.toString() === updatedCase.project_id.toString());
    // console.log(selectedClientOpenCases)
  const [deAvailabe, qrAvailabe, mrAvailable] = userAssignedCasesCount(clientAssignies, selectedClientOpenCases);
  console.log(deAvailabe, qrAvailabe, mrAvailable)

    if(updatedCase.caseStatus.toLowerCase().trim() === "data entry"){
      const nextAvailableUserName = deAvailabe.sort((a,b) => a.count - b.count)[0]
      if(nextAvailableUserName.maxCount > nextAvailableUserName.count){
        updatedCase.de = nextAvailableUserName.username;
        updatedCase.assignedDateDe = formattedIST()
        updatedCase.deStatus = "Assigned";
        updatedCase.isCaseOpen = true
        modifiedNameDate(updatedCase)
      }else{
        isUpdated = false
      }
    }
     if(updatedCase.caseStatus.toLowerCase().trim() === "quality review"){
      const nextAvailableUserName = qrAvailabe.sort((a,b) => a.count - b.count)[0]
      if(nextAvailableUserName.maxCount > nextAvailableUserName.count){
      updatedCase.qr = nextAvailableUserName.username
      updatedCase.assignedDateQr = formattedIST()
      updatedCase.completedDateDE = formattedIST()      
      updatedCase.isCaseOpen = true
      updatedCase.qrStatus = "Assigned";
      modifiedNameDate(updatedCase)
      }else{
        isUpdated = false
      }
    }
    if(updatedCase.caseStatus.toLowerCase().trim() === "medical review"){
      const nextAvailableUserName = mrAvailable.sort((a,b) => a.count - b.count)[0]?.username
      updatedCase.mr = nextAvailableUserName
      updatedCase.assignedDateMr = formattedIST()
      updatedCase.completedDateQR = formattedIST()
      updatedCase.isCaseOpen = true
      updatedCase.mrStatus = "Assigned";
      modifiedNameDate(updatedCase)
    }
   
    if(updatedCase.caseStatus.toLowerCase().trim() === "reporting"){
      updatedCase.completedDateMr = formattedIST()
      updatedCase.isCaseOpen = false      
      modifiedNameDate(updatedCase)
    }

    isUpdated && await updateCase(updatedCase)
    return updatedCase;
}

export const addClient = async(client) => {
 try {
    const res = await axios.post(`${API_URL}/clients/`, client);
    return res.data;
  } catch (error) {
    console.error('Error posting client:', error);
    throw error.response; // Always good to throw it for error handling on frontend
  }
}

export const deleteClients = async (clientIds) =>{
  const client_Ids = {"ids": clientIds};

  try {
    const res = await axios.delete(`${API_URL}/clients/`, {
      data: client_Ids,
      headers:{
        'Content-Type' : 'application/json'
      }
    })
    return res;
  } catch (error) {
    console.error("Error deleting client(s)", error);
  }
}
