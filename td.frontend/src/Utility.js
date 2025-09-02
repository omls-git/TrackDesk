import * as XLSX from 'xlsx';
const loggedUserName = localStorage.getItem("userName");

export const formattedIST = (value) => {
  const date = value ?  new Date(value) : new Date();  
  const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000)); // UTC + 5:30  
  const formattedIST = istDate.toISOString().slice(0, 19).replace("T", " ");
  return formattedIST;
}

export const parseExcelDate = (value) => {
      if (typeof value === "number") {
        const date = XLSX.SSF.parse_date_code(value);
        if (!date) return "";
        const iso = formattedIST(Date.UTC(date.y, date.m - 1, date.d)) 
        //new Date(Date.UTC(date.y, date.m - 1, date.d)).toISOString().slice(0, 19).replace("T", " ");
        return iso
      }
      if (value instanceof Date) {
        return formattedIST(value) //value.toISOString().slice(0, 19).replace("T", " ")
      }
      return null;
};

export const getDaysOpen = (row) => {
  if (row.ird_frd) {
    const today = new Date();
    const irdFrdData = new Date(row.ird_frd);
    const numberOfDaysCaseOpen = Math.floor((today - irdFrdData) / (1000 * 60 * 60 * 24));
    return numberOfDaysCaseOpen;
  }
  return null;
};

export const jsonDataFromFile = async(file) =>{
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const data = await file.arrayBuffer();
  let workbook;
  if(fileExtension === 'csv'){
    const text = new TextDecoder("utf-8").decode(data);
    workbook = XLSX.read(text, { type: "string" });
  }else{
    workbook = XLSX.read(data, { type: 'buffer' });  
  } 
  // const worksheet = workbook.Sheets["Open Cases"] || workbook.Sheets["Current Status"] || workbook.SheetNames[0];
  const sheetName = workbook.SheetNames.includes("Open Cases")
  ? "Open Cases"
  : workbook.SheetNames.includes("Current Status")
  ? "Current Status"
  : workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName]
  if(!worksheet){
    alert(`No sheet were found in the imported file. Please check the file content and try again.`);
    return
  }
  let jsonData = XLSX.utils.sheet_to_json(worksheet, {defval: "" });
  if(jsonData.length === 0){
    alert("No Cases found in selected file.")
    return
  }
  return jsonData
}

export const createdNameDate = (item) => {
  item.createdOn = formattedIST();
  item.createdBy = loggedUserName
  return item;
}

export const modifiedNameDate = (item) => {
  item.modifiedOn = formattedIST();
  item.modifiedBy = loggedUserName;
  return item;
}

export const getInitials = (name) => {
  if(name){
    let bits = name.split(' ');
    let initails = bits.reduce((acc, val) => {
      return acc + (val[0] || "");
    }, '').replace(/\W/g,'').toUpperCase();
    return initails;
  }else{
    return '';
  }
}

export const exportToCSV = (data, filename) => {
  let mappedData = data.map((item) => {return{...item,casesOpen: getDaysOpen(item)} })
  const ws = XLSX.utils.json_to_sheet(mappedData)
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cases");
  XLSX.writeFile(wb, filename);
}

export const formatToCases = (item) => {
  const formatDate = (date) => date ? formattedIST(date) : null;
  const formatedCase ={
    ...item,
    project_id: item.project_id,
    casesOpen: item.casesOpen,
    caseNumber: item.caseNumber,
    inital_fup: item.inital_fup,
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
    Country: item.Country,
    Partner: item.Partner,
    modifiedOn: formattedIST(),
    modifiedBy: localStorage.getItem("userName") || "",
    triageAssignedTo: item.triageAssignedTo,
    triageAssignedAt: formatDate(item.triageAssignedAt),
    triageStatus: item.triageStatus,
    triageStartedAt: formatDate(item.triageStartedAt),
    triageCompletedAt: formatDate(item.triageCompletedAt),
    ORD: formatDate(item.ORD),
    Source: item?.Source,
    ReportType: item?.ReportType,
    isCaseOpen: item.isCaseOpen,
    XML_Non_XML : item.XML_Non_XML,
    DestinationForReporting: item.DestinationForReporting,
    SDEAObligation: item.SDEAObligation,
    ReportingComment: item.ReportingComment,
    id: item.id
  }
  return formatedCase
}

export const xmllabels = {
    "authorityNumber": {type:"text", label: "Authority Number", width: "200"}, //-new
    "safetyReportId": {type:"text", label: "Safety Report ID", width: "200"}, //-new
    "ReportType": {type:"text", label: "Type of Report", width: "130"},
    "ird_frd": {type:"date", label: "IRD/FRD", width: "130"},
    "suspect_drug": {type:"text", label: "Suspect", width: "140"}, //-new -- have to confirm
    "validity": {type:"text", label: "Validity", width: "120"}, //-new
    "argusId": {type:"text", label: "Argus ID", width: "140"}, //-new
    "comments": {type:"textarea", label: "Comment", width: "200"},
    "literatureCitation": {type:"textarea", label: "Literature Citation", width: "200"}, //-new
    "linkedDeactivations": {type:"text", label: "Linked Deactivations", width: "130"}, //new
    "bookInAssignedTo": {type:"text", label: "Associate", width: "150"},
    "bookInDate": {type:"date", label: "Bookin Date", width: "130"}, //new
    "bookInReceivedDate": {type:"date", label: "Receive Date", width: "130"}, //new
    "COI": {type:"text", label: "COI", width: "150"},
    "comment2": {type:"textarea", label: "Comment2", width: "200"},
    "manualBookIn": {type:"checkbox", label: "Manual Bookin", width:"100", options: [{ value: true, label: "Yes" }, { value: false, label: "No" }]}, //new
    "openWorkflow": {type:"checkbox", label: "Open Workflow", width:"100", options: [{ value: true, label: "Yes" }, { value: false, label: "No" }]}
  }

  export const nonXmlLabels = {
    "OM_ID": {type:"text", label: "OM ID", width: "100"},
    "ird_frd": {type:"date", label: "IRD/FRD", width: "130"},
    "case_is_from": {type:"text", label: "CASE IS FROM", width: "100"},
    "subjectLine": {type:"textarea", label: "Subject Line", width: "200"},
    "title_of_the_article": { type:"textarea", label: "Title of the Article", width: "200"},
    "bookInAssignedTo": {type:"text", label: "Assigned To", width: "150"},
    "bookInReceiptDate": {type:"date", label: "Book in Receipt Date", width: "130"},
    "bookInDueDate": {type:"date", label: "Due Date", width: "130"},
    "bookInCompletedDate": {type:"date", label: "Completed Date", width: "130"},
    "inital_fup": {type:"text", label: "Initial/Follow-up", width: "130"},
    "bookInStatus": {type:"text", label: "Book-in status", width: "130"},
    "no_of_cases_created": {type:"number", label: "No. of cases created", width: "100"},
    "casesOpen": {type:"number", label: "Days Open", width: "100", hide:true},
    "TAT_date": {type:"date", label: "TAT date", width: "130"},
    "allocation_Received_on": {type:"date", label: "Allocation Received on", width: "130"},
    "caseNumber": {type:"text", label: "Case ID", width: "150"},
    "COI": {type:"text", label: "COI", width: "150"},
    "SDEA Obligation": {type:"text", label: "SDEA Obligation", width: "200"},
    "suspect_drug": {type:"text", label: "Suspect drug", width: "150"},
    "event": {type:"textarea", label: "Event", width: "200"},
    "comments": {type:"textarea", label: "Comment", width: "200"},
    "seriousness": {type:"text", label: "Seriousness (fatal/Life threatening)", width: "150"},
    "LOE": {type:"checkbox", label: "LOE", width: "80", options: [{ value: true, label: "Yes" }, { value: false, label: "No" }]},
    "PQC": {type:"checkbox", label: "PQC", width: "80",options: [{ value: true, label: "Yes" }, { value: false, label: "No" }]},
    "openWorkflow": { type: "checkbox", label: "Open Workflow", width: "100", options: [{ value: true, label: "Yes" }, { value: false, label: "No" }]}
  }

export const inital_fupOptions = [{value: "initial", label: "Initial"}, {value: "Follow-up", label: "Follow-up"}, {value: "Follow-up open", label: "Follow-up Open"}];

export const seriousnessOptions = [
  // {value: "fatal", label: "Fatal"}, 
  // {value: "life_threatening", label: "Life Threatening"}, 
  {value: "Serious", label: "Serious"}, 
  {value: "Non-serious", label: "Non-Serious"}];

export const reportabilityOptions = [
  {value: "5-day", label: "5-Day Reportable"},
  {value: "90-day", label: "90-Day Reportable"},
  {value: "Non-reportable", label: "Non-Reportable"}
];

export const caseStatusOptions = [
  {value: "Triage", label: "Triage"},
  { value: 'Data Entry', label: 'Data Entry' },
  { value: 'Quality Review', label: 'Quality Review' },
  { value: 'Medical Review', label: 'Medical Review' },
  { value: 'Reporting', label: 'Reporting' },
  { value: 'Case Archival', label: 'Case Archival' }
];

export const caseStatusOptionsCipla = [
  {value: "Intake & Triage", label: "Intake & Triage"},
  { value: 'Data Entry', label: 'Data Entry' },
  { value: 'Quality Review', label: 'Quality Review' },
  { value: 'Medical Review', label: 'Medical Review' },
  { value: 'Reporting', label: 'Reporting' },
  { value: 'Case Archival', label: 'Case Archival' }
];
export const reportTypeOptions = [
  { value: "Spontaneous", label: "Spontaneous" },
  { value: "True Spontaneous", label: "True Spontaneous" },
  { value: "Spontaneous Literature", label: "Spontaneous Literature" },
  { value: "Regulatory Authority", label: "Regulatory Authority" }
];

export const live_backlogOptions = [{ value: "Live case", label: "Live case"},{value: "Backlog case", label: "Backlog case"}];