import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchAllCases = async () => {
  try {
    const response = await axios.get(`${API_URL}/cases`);
    console.log("response", response)
    return response.data;
  } catch (error) {
    console.error('Error fetching all cases:', error);
    throw error;
  }
};

export const fetchCaseById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/cases/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all cases:', error);
    throw error;
  }
};

export const postCases = async (cases, clientId) => {
  const sortCasesByPriority = cases.sort((a, b) => b["Cases open"] - a["Cases open"]);
  const allCases = await fetchAllCases();
  const selectedClientCases = allCases.filter((item) => item.project_id.toString() === clientId);
  console.log(selectedClientCases);
  
 sortCasesByPriority.map(async (item) => {
  const caseNumber = item["Case Number"];
  if(caseNumber){
      const existingCase = selectedClientCases.find((item) => item.caseNumber === caseNumber)
      // console.log("Existed case", res.data)
      if(existingCase){
        
        console.log("case already exists");
        
      }else{
        try {
          const body = mapCaseToApiFormat(item, clientId);
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
const mapCaseToApiFormat = (item, id) => ({
  project_id: parseInt(id),
  casesOpen: item["Cases open"],
  caseNumber: item["Case Number"],
  initial_fup_fupToOpen: item["Initial/FUP/FUP to Open (FUOP)"],
  ird_frd: item["IRD/FRD"] + "ss",
  assignedDateDe: item["Assigned Date (DE)"],
  completedDateDE: null,
  de: item["DE"] || "",
  assignedDateQr: item["Assigned Date (QR)"],
  completedDateQR: null,
  qr: item["QR"] || "",
  assignedDateMr: item["Assigned Date (MR)"],
  completedDateMr: null,
  mr: item["MR"] || "",
  caseStatus: item["Case Status"] || "",
  reportability: item["Reportability"] || "",
  seriousness: item["Seriousness"] || "",
  live_backlog: item["Live/backlog"] || "",
  comments: item["Comments"] || "",
  isCaseOpen: true,
  DestinationForReporting: item["Destination for Reporting"] || "",
  ReportingComment: item["Reporting Comment"] || "",
  SDEAObligation: item["SDEA Obligation"] || "",
  Source: item["Source"] || "",
  ReportType: item["Report Type"] || "",
  XML_Non_XML: item["XML/Non-XML"] || ""
});