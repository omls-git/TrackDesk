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

export const postCases = async (cases) => {
  const body = cases.map((item) => mapCaseToApiFormat(item));
  console.log("boddddddddddy", body)
  try {
    const response = await axios.post(`${API_URL}/cases`, body);
    return response.data;
  } catch (error) {
    console.error("Error posting the cases:", error);
    throw error
  }
}
const mapCaseToApiFormat = (item) => ({
  project_id: 2,
  casesOpen: item["Cases open"],
  caseNumber: item["Case Number"],
  initial_fup_fupToOpen: item["Initial/FUP/FUP to Open (FUOP)"],
  ird_frd: item["IRD/FRD"] ? new Date(item["IRD/FRD"]).toISOString() : null,
  assignedDateDe: item["Assigned Date (DE)"] ? new Date(item["Assigned Date (DE)"]).toISOString() : null,
  completedDateDE: null,
  de: item["DE"] || "",
  assignedDateQr: item["Assigned Date (QR)"] ? new Date(item["Assigned Date (QR)"]).toISOString() : null,
  completedDateQR: null,
  qr: item["QR"] || "",
  assignedDateMr: item["Assigned Date (MR)"] ? new Date(item["Assigned Date (MR)"]).toISOString() : null,
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