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
        const iso = formattedIST(Date.UTC(date.y, date.m - 1, date.d)) //new Date(Date.UTC(date.y, date.m - 1, date.d)).toISOString().slice(0, 19).replace("T", " ");
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
    alert(`No "Open Cases" or "Current Status" sheet were found in the imported file. Please check the file content and try again.`);
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
    "authorityNumber": {type:"text", label: "Authority Number"}, //-new
    "safetyReportId": {type:"text", label: "Safety Report ID"}, //-new
    "ReportType": {type:"text", label: "Type of Report"},
    "ird_frd": {type:"date", label: "IRD/FRD"},
    "suspect_drug": {type:"text", label: "Suspect"}, //-new -- have to confirm
    "validity": {type:"text", label: "Validity"}, //-new
    "argusId": {type:"text", label: "Argus ID"}, //-new
    "comments": {type:"text", label: "Comment"},
    "literatureCitation": {type:"text", label: "Literature Citation"}, //-new
    "linkedDeactivations": {type:"text", label: "Linked Deactivations"}, //new
    "bookInAssignedTo": {type:"text", label: "Associate"},
    "bookInDate": {type:"date", label: "Bookin Date"}, //new   
    "bookInReceivedDate": {type:"text", label: "Receive Date"}, //new
    "COI": {type:"text", label: "COI"},
    "Comment2": {type:"text", label: "Comment2"},
    "manualBookIn": {type:"checkbox", label: "Manual Bookin"}, //new
    "openWorkflow": {type:"checkbox", label: "Open Workflow"}
  }

  export const nonXmlLabels = {
    "OM_ID": {type:"text", label: "OM ID"},
    "ird_frd": {type:"date", label: "IRD/FRD"},
    "case_is_from": {type:"text", label: "CASE IS FROM"},
    "subjectLine": {type:"text", label: "Subject Line"},
    "title_of_the_article": {type:"text", label: "Title of the Article"},
    "bookInAssignedTo": {type:"text", label: "Assigned To"},
    "bookInReceiptDate": {type:"date", label: "Book in Receipt Date"},
    "bookInDueDate": {type:"date", label: "Due Date"},
    "bookInCompletedDate": {type:"date", label: "Completed Date"},
    "inital_fup": {type:"text", label: "Initial/Follow-up"},
    "bookInStatus": {type:"text", label: "Book-in status"},
    "no_of_cases_created": {type:"number", label: "No. of cases created"},
    "Days Open": {type:"number", label: "Days Open"},
    "TAT_date": {type:"date", label: "TAT date"},
    "allocation_Received_on": {type:"date", label: "Allocation Received on"},
    "caseNumber": {type:"text", label: "Case ID"},
    "COI": {type:"text", label: "COI"},
    "SDEA Obligation": {type:"text", label: "SDEA Obligation"},
    "suspect_drug": {type:"text", label: "Suspect drug"},
    "event": {type:"text", label: "Event"},
    "comments": {type:"text", label: "Comment"},   
    "seriousness": {type:"text", label: "Seriousness (fatal/Life threatening)"},
    "LOE": {type:"text", label: "LOE"},
    "PQC": {type:"text", label: "PQC"},
    "openWorkflow": {type:"text", label: "Open Workflow"}
  }

export const estimateWidth = (text) => {
  const baseWidth = 10;
  const padding = 20;
  const textLength = text.length < 7 ? 10 : text.length;
  return `${textLength * baseWidth + padding}px`;
};


