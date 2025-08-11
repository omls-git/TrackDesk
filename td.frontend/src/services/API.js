import axios from 'axios';
import { caseAllocation, userAssignedCasesCount } from './Common';
import { formattedIST, formatToCases, getDaysOpen, modifiedNameDate } from '../Utility';

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

export const fetchClientOpenCases = async (isOpen,projectId) => {
  try {
    const response = await axios.get(`${API_URL}/cases`, {params:{data: isOpen, project_id : projectId}});
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

export const postCases = async (dataFromLL, clientId) => {
  let importedTriageCases = dataFromLL.filter((item) => item["Case Status"].toLowerCase().trim().includes('triage'))
  let deQrMrCases = dataFromLL.filter(item => ["data entry", "quality review", "medical review"].includes(item["Case Status"].toLowerCase().trim()))

  const allOpenCases = await fetchClientOpenCases(true, clientId);
  let allOpenCasesMapDays = allOpenCases.map((ongoingCase) => {return{...ongoingCase, casesOpen: getDaysOpen(ongoingCase)}})
  const assignies = await getEmployees();
     
  if(importedTriageCases && importedTriageCases.length){//only new triage cases are assigned and created, existing unassigned triage cases also to be assigned and updated
    const existingTriageCases = allOpenCasesMapDays?.filter((item) => item.caseStatus.toLowerCase().trim().includes('triage'));
    const assignedTriageCases = caseAllocation(importedTriageCases, existingTriageCases, assignies, clientId);
    
    if(assignedTriageCases && assignedTriageCases.length){
      let newTriageCases = []
      for (let i = 0; i < assignedTriageCases.length; i++) {
        const triageCase = assignedTriageCases[i];
        const activeTriageCase = allOpenCasesMapDays.find((item) => item.caseNumber === triageCase.caseNumber)
        if(activeTriageCase){
          activeTriageCase.caseStatus = triageCase.caseStatus         
          await updateCase(activeTriageCase)
        }else{
          newTriageCases.push(triageCase)
        }
      }
      if(newTriageCases && newTriageCases.length){        
        try {
          await axios.post(`${API_URL}/cases/`, newTriageCases)        
        } catch (error) {
          console.error('error', error);
          alert("Failed to asign cases.")
        }
      }
    }
  }

  if(deQrMrCases && deQrMrCases.length){ //all open cases in workflow are asigned and updated with status as well as assignee
    const activeWorkFlowCases = allOpenCasesMapDays?.filter((item) => 
      ["data entry", "quality review", "medical review"].includes(item.caseStatus.toLowerCase().trim()))
    
    if(activeWorkFlowCases && activeWorkFlowCases.length){//vlookup
      let openCasesWithUpdatedStatus = activeWorkFlowCases.map((activeCase) => {
        let caseFromLL = deQrMrCases?.find((item) => findIsActiveCase(item, activeCase))
        if(findIsActiveCase(caseFromLL, activeCase)){
          activeCase.caseStatus = caseFromLL["Case Status"]
          console.log("active case from ll",activeCase.caseNumber, activeCase.caseStatus, caseFromLL);          
          return activeCase
        }else{
          return activeCase
        }
      })

      let unAssignedCases = openCasesWithUpdatedStatus.filter(
        (unAssignedCase) => (unAssignedCase.caseStatus.toLowerCase().trim() === "data entry" && !unAssignedCase.de) 
        || (unAssignedCase.caseStatus.toLowerCase().trim() === "quality review" && !unAssignedCase.qr) 
        || (unAssignedCase.caseStatus.toLowerCase().trim() === "medical review" && !unAssignedCase.mr))
      .sort((a, b) => a.casesOpen - b.casesOpen);

      if(unAssignedCases && unAssignedCases.length){ 
        const assignUnAssignedCases = caseAllocation(unAssignedCases, openCasesWithUpdatedStatus, assignies, clientId)
        .filter((unAssignedCase) => (unAssignedCase.caseStatus.toLowerCase().trim() === "data entry" && !unAssignedCase.de) 
        || (unAssignedCase.caseStatus.toLowerCase().trim() === "quality review" && !unAssignedCase.qr) 
        || (unAssignedCase.caseStatus.toLowerCase().trim() === "medical review" && !unAssignedCase.mr))
        if(assignUnAssignedCases && assignUnAssignedCases.length){
          await updateCase(assignUnAssignedCases);
        }
      }

      let assignedCases = openCasesWithUpdatedStatus.filter(
        (unAssignedCase) => (unAssignedCase.caseStatus.toLowerCase().trim() === "data entry" && unAssignedCase.de) 
        || (unAssignedCase.caseStatus.toLowerCase().trim() === "quality review" && unAssignedCase.qr) 
        || (unAssignedCase.caseStatus.toLowerCase().trim() === "medical review" && unAssignedCase.mr));

      if (assignedCases && assignedCases.length){
        for (let i = 0; i < assignedCases.length; i++) {
        const workFlowCase = assignedCases[i];
        let LLWorkFlowCase = deQrMrCases?.find((item) => findIsActiveCase(item, workFlowCase))
        if(LLWorkFlowCase){
           workFlowCase.caseStatus = LLWorkFlowCase["Case Status"]
          await updateCase(workFlowCase)
        }
      }

      }

    }
    
  }

}

const findIsActiveCase = (llCase, activeCase) => {
  if(llCase && activeCase){
    let llCaseNumber = llCase["Case Number"] || llCase["Case ID"] || llCase["Case Num"] || ""
    let isActive = llCaseNumber.toLowerCase().trim() === activeCase.caseNumber.toLowerCase().trim()
    return isActive
  }else{
    return false
  }  
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
  let formattedItems;
  let id;
  if(Array.isArray(item)){
    formattedItems = item.map(value => formatToCases(value));
    id = 'bulk-update'
  }else{
    formattedItems = formatToCases(item)
    id = item.id
  }
  try {
    const response = await axios.put(`${API_URL}/cases/${id}`, formattedItems);
    return response.data;
  } catch (error) {
    console.error('Error updating cases:', error);
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
  const [deAvailabe, qrAvailabe, mrAvailable, triageesAvailable] = userAssignedCasesCount(clientAssignies, selectedClientOpenCases);
  console.log(deAvailabe, qrAvailabe, mrAvailable, triageesAvailable)

   if(updatedCase.caseStatus.toLowerCase().trim().includes('triage')){
      const nextAvailableUserName = triageesAvailable.sort((a,b) => a.count - b.count)[0]
      if(nextAvailableUserName.maxCount > nextAvailableUserName.count){
      updatedCase.triageAssignedTo = nextAvailableUserName.username
      updatedCase.triageAssignedAt = formattedIST()    
      updatedCase.isCaseOpen = true
      updatedCase.triageStatus = "Assigned";
      modifiedNameDate(updatedCase)
      }else{
        isUpdated = false
      }
    }

    if(updatedCase.caseStatus.toLowerCase().trim() === "data entry"){
      const nextAvailableUserName = deAvailabe.sort((a,b) => a.count - b.count)[0]
      if(nextAvailableUserName.maxCount > nextAvailableUserName.count){
        updatedCase.de = nextAvailableUserName.username;
        updatedCase.assignedDateDe = formattedIST()
        updatedCase.deStatus = "Assigned";
        updatedCase.isCaseOpen = true
        updatedCase.triageCompletedAt = formattedIST()
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


