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
  const assignedCases = caseAllocation(sortCasesByPriority, selectedClientAllCases, clientId);
  console.log("assignedCases", assignedCases);

  assignedCases.map(async (item) => {
  const caseNumber = item["Case Number"];
  if(caseNumber){
      const existingCase = selectedClientAllCases.find((item) => item.caseNumber === caseNumber)
      // console.log("Existed case", res.data)
      if(existingCase){        
        console.log("case already exists");        
      }else{
        try {
          const body = item; // mapCaseToApiFormat(item, clientId);
          console.log("body", body)
          const res = await axios.post(`${API_URL}/cases/`, body)
          console.log("response post", res);
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