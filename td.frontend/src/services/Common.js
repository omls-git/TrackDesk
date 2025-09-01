import { formattedIST, parseExcelDate } from "../Utility";

export const caseAllocation = (cases, existingAllCases, assignies, clientId) => {
  const clientAssignies = assignies.filter((item) => item.projectId.toString() === clientId.toString() && !item.onLeave);

  if (clientAssignies.length === 0) {
    console.error("No assignies found for the client to assign cases", clientId);
    return [];
  }
  console.log(cases);
  
  let mappedCases;  
  const hasCaseStatus = cases.some(obj => 'caseStatus' in obj);
  if(hasCaseStatus){
    mappedCases = cases
  }else {
    mappedCases = cases.map(item => mapCaseToApiFormat(item, clientId));
  } 
  console.log(mappedCases);
  

   const [deAvailabe, qrAvailabe, mrAvailable, triageesAvailable] = userAssignedCasesCount(clientAssignies, existingAllCases);
   console.log(deAvailabe, qrAvailabe, mrAvailable, triageesAvailable, "available assignies");
   

    const dataEntryCases = mappedCases.filter(item => item.caseStatus.toLowerCase().trim() === "data entry");
    const qualityReviewCases = mappedCases.filter(item => item.caseStatus.toLowerCase().trim() === "quality review");
    const medicalReviewCases = mappedCases.filter(item => item.caseStatus.toLowerCase().trim() === "medical review");
    const triageCases = mappedCases.filter(item => item.caseStatus.toLowerCase().trim().includes('triage'));
    const remainingCases = mappedCases.filter(item => !["data entry", "quality review", "medical review", "triage", "intake & triage"].includes(item.caseStatus.toLowerCase().trim()));

    const dateEntryAssignedCases = employeesToAssign(deAvailabe, dataEntryCases, "de", clientId);
    const qualityReviewAssignedCases = employeesToAssign(qrAvailabe, qualityReviewCases, "qr", clientId);
    const medicalReviewAssignedCases = employeesToAssign(mrAvailable, medicalReviewCases, "mr", clientId);
    const triageAssignedCases = employeesToAssign(triageesAvailable, triageCases, "triage", clientId)
    
    const assignedCases = [...dateEntryAssignedCases, ...qualityReviewAssignedCases, ...medicalReviewAssignedCases, ...triageAssignedCases, ...remainingCases];
    
    return assignedCases;
}


export const mapCaseToApiFormat = (item, id) => ({
  project_id: parseInt(id),
  casesOpen: item["Cases open"] || item["Days open"] || 0,
  caseNumber: item["Case Number"] || item["Case ID"] || item["Case Num"] || "",
  inital_fup: item["Initial/FUP/FUP to Open (FUOP)"] || item["Initial/FUP"] || "",
  ird_frd: item["IRD/FRD"] || parseExcelDate(item["Case Followup Receipt Date"]) || parseExcelDate(item["Case Initial Receipt Date"]) || null,
  assignedDateDe: item["Assigned Date (DE)"] ? item["Assigned Date (DE)"] : null,
  completedDateDE: null,
  de: item["DE"] || "",
  assignedDateQr: item["Assigned Date (QR)"] ? item["Assigned Date (QR)"] : null,
  completedDateQR: null,
  qr: item["QR"] || "",
  assignedDateMr: item["Assigned Date (MR)"] ? item["Assigned Date (MR)"] : null,
  completedDateMr: null,
  mr: item["MR"] || "",
  caseStatus: item["Case Status"] || "",
  reportability: item["Reportability"] || "",
  seriousness: item["Seriousness"] || "",
  live_backlog: item["Live/backlog"] || "",
  comments: item["Comments"] || item["Comments_1"] || "",
  isCaseOpen: true,
  DestinationForReporting: item["Destination for Reporting"] || item["Destination for reporting"] || "",
  ReportingComment: item["Reporting Comment"] || "",
  SDEAObligation: item["SDEA Obligation"] || item["SDEA obligation"] || "",
  Source: item["Source"] || "",
  ReportType: item["Report Type"] || item["Report type"] || "",
  XML_Non_XML: item["XML/Non-XML"] || "",
  ORD: item["ORD"] || null,
  Country: item["Country"] || "",
  Partner: item["Partner"] || "",
  createdOn: formattedIST(),
  createdBy: localStorage.getItem("userName") || "",
  authorityNumber: item["Authority Number"] || "",
  safetyReportId: item["Safety Report ID"] || "",
  validity: item["Validity"] || "",
  argusId: item["Argus ID"] || "",
  literatureCitation: item["Literature Citation"] || "",
  linkedDeactivations: item["Linked Deactivations"] || "",
  bookInDate: item["Book In Date"] ? parseExcelDate(item["Book In Date"]) : null,
  bookInReceivedDate: item["Book In Received Date"] || "",
  manualBookIn: item["Manual Book In"] === "true" || item["Manual Book In"] === true ? true : false,
  bookInAssignedDate: item["Book In Assigned Date"] ? parseExcelDate(item["Book In Assigned Date"]) : null,
  bookInStartedAt: item["Book In Started At"] ? parseExcelDate(item["Book In Started At"]) : null,
  bookInCompletedAt: item["Book In Completed At"] ? parseExcelDate(item["Book In Completed At"]) : null,
  bookInWorkStatus: item["Book In Work Status"] || "",
  bookInType: item["Book In Type"] || "",
  OM_ID: item["OM_ID"] || "",
  case_is_from: item["case_is_from"] || "",
  subjectLine: item["subjectLine"] || "",
  title_of_the_article: item["title_of_the_article"] || "",
  bookInAssignedTo: item["bookInAssignedTo"] || "",
  bookInReceiptDate: item["bookInReceiptDate"] ? parseExcelDate(item["bookInReceiptDate"]) : null,
  bookInDueDate: item["bookInDueDate"] ? parseExcelDate(item["bookInDueDate"]) : null,
  bookInCompletedDate: item["bookInCompletedDate"] ? parseExcelDate(item["bookInCompletedDate"]) : null,
  bookInStatus: item["bookInStatus"] || "",
  no_of_cases_created: item["no_of_cases_created"] || 0,
  TAT_date: item["TAT_date"] ? parseExcelDate(item["TAT_date"]) : null,
  allocation_Received_on: item["allocation_Received_on"] ? parseExcelDate(item["allocation_Received_on"]) : null,
  COI: item["COI"] || "",
  suspect_drug: item["suspect_drug"] || "",
  event: item["event"] || "",
  LOE: item["LOE"] || "",
  PQC: item["PQC"] || "",
  openWorkflow: item["openWorkflow"] || "",
});

export const employeesToAssign = (assignees, cases, role, projectId) => {

  if (assignees.length === 0) {
    console.error(`No assignies found for the role: ${role.toUpperCase()}`);
    return;
  }

  if(role === "de"){
    const deCases = cases;
    let deAssignedCases = [];
    let deIndex = 0;
    for(let i=0; i < deCases.length; i++){
      const currentCase = deCases[i]
        // Find next assignee with available capacity
        let assigned = false;
        let attempts = 0;
        while (!assigned && attempts < 8) {
          const assignee = assignees[deIndex];
          if (assignee.count < assignee.maxCount) {
            deAssignedCases.push({
              ...currentCase,
              de: assignee.username,
              deStatus: "Assigned",
              assignedDateDe: formattedIST(),
              assignedDateMr: currentCase.assignedDateMr ? formattedIST(currentCase.assignedDateMr) : null,
              assignedDateQr: currentCase.assignedDateQr ? formattedIST(currentCase.assignedDateQr) : null
            });
            assignee.count++;
            assigned = true;
          }
          deIndex = (deIndex + 1) % assignees.length;
          attempts++;
        }
        // If all are at maxCount, assign round-robin anyway
        if (!assigned) {
          deAssignedCases.push({
            ...currentCase,
            de: "",
            assignedDateDe: null,
            assignedDateMr: currentCase.assignedDateMr ? formattedIST(currentCase.assignedDateMr) : null,
            assignedDateQr: currentCase.assignedDateQr ? formattedIST(currentCase.assignedDateQr) : null
          });
          deIndex = (deIndex + 1) % assignees.length;
        }     
    }
    return deAssignedCases;
  }

  if(role === "qr"){
    const qrCases = cases;
    let qrAssignedCases = [];
    let qrIndex = 0;
    for (let i = 0; i < qrCases.length; i++) {
      const currentCase = qrCases[i];
      let assigned = false;
      let attempts = 0;
      while (!assigned && attempts < 15) {
        const assignee = assignees[qrIndex];
        if( assignee.count < assignee.maxCount) {
          qrAssignedCases.push({
            ...currentCase,
            qr: assignee.username,
            qrStatus: "Assigned",
            assignedDateQr: formattedIST(),
            assignedDateDe : currentCase.assignedDateDe ? formattedIST(currentCase.assignedDateDe) : null,
            assignedDateMr : currentCase.assignedDateMr ? formattedIST(currentCase.assignedDateMr) : null
          });
          assignee.count++;
          assigned = true;
        }
        qrIndex = (qrIndex + 1) % assignees.length;
        attempts++;

      }
      if(!assigned){
        qrAssignedCases.push({
          ...currentCase,
          qr: "",
          assignedDateQr: null,
          assignedDateDe : currentCase.assignedDateDe ? formattedIST(currentCase.assignedDateDe) : null,
          assignedDateMr : currentCase.assignedDateMr ? formattedIST(currentCase.assignedDateMr) : null,
        });
        qrIndex = (qrIndex + 1) % assignees.length;
      }
      
    }
    return qrAssignedCases;
  }

  if(role === "mr"){
    const mrCases = cases;
    let mrAssignedCases = [];
    let mrCount = 0;
    for (let i = 0; i < mrCases.length; i++) {
      const currentCase = mrCases[i];
      mrAssignedCases.push({
        ...currentCase,
        mr: assignees[mrCount].username,
        mrStatus: "Assigned",
        assignedDateMr: formattedIST(),
        assignedDateDe : currentCase.assignedDateDe ? formattedIST(currentCase.assignedDateDe) : null,
        assignedDateQr: currentCase.assignedDateQr ? formattedIST(currentCase.assignedDateQr) : null
      });
      mrCount++;
      if (mrCount >= assignees.length) {
        mrCount = 0;
      }
    }
    return mrAssignedCases;
  }

  if(role === "triage"){
    const triageCases = cases;
    let triageAssignedCases = [];
    let triageIndex = 0;
    for (let i = 0; i < triageCases.length; i++) {
      const currentCase = triageCases[i];
      let assigned = false;
      let attempts = 0;
      while (!assigned && attempts < 40) {
        const assignee = assignees[triageIndex];
        if( assignee.count < assignee.maxCount) {
          triageAssignedCases.push({
            ...currentCase,
            triageAssignedTo: assignee.username,
            triageStatus: "Assigned",
            triageAssignedAt: formattedIST(),
          });
          assignee.count++;
          assigned = true;
        }
        triageIndex = (triageIndex + 1) % assignees.length;
        attempts++;

      }
      if(!assigned){
        triageAssignedCases.push({
          ...currentCase,
          triageAssignedTo: '',
          triageStatus: '',
          triageAssignedAt : null,
        });
        triageIndex = (triageIndex + 1) % assignees.length;
      }
      
    }
    return triageAssignedCases;
  
  }

}

export const getClientAssigniesOfRole = (role, clientId, assignies) => {
  let clientAssigniesOfRole;
  if(role === "triage"){
    clientAssigniesOfRole = assignies.filter((item) => 
    !item.onLeave 
    && item.assignTriage
    && item.projectId.toString() === clientId.toString());
  }else {
    clientAssigniesOfRole = assignies.filter((item) => 
    !item.onLeave 
    && item.level.toLowerCase() === role.toLowerCase() 
    && item.projectId.toString() === clientId.toString());
  }
  
  if (clientAssigniesOfRole.length === 0) {
    console.error("No assignies found for the client to assign cases", role);
    return [];
  }

  return clientAssigniesOfRole;
}



export const userAssignedCasesCount = (clientAssignies, existingAllCases) => {
  
  const deAssiniees = clientAssignies.filter((item) => item.level.toLowerCase() === "data entry".toLowerCase() && !item.onLeave);
 
   let deAvailabe = [];
   const today = new Date()
    deAssiniees.forEach(assigny => {
      const count = existingAllCases?.filter(item => item.de === assigny.username && !item.completedDateDE && item.assignedDateDe?.split("T")[0] === today.toISOString().split("T")[0]).length;
      
      count ? deAvailabe.push({ username: assigny.username, count, maxCount: 8 }) : deAvailabe.push({ username: assigny.username, count: 0, maxCount: 8 });
    });

    const qrAssignees = clientAssignies.filter((item) => item.level.toLowerCase() === "quality review".toLowerCase() && !item.onLeave);
    let qrAvailabe = [];
    qrAssignees.forEach(assigny => {
      const count = existingAllCases?.filter(item => item.qr === assigny.username && !item.completedDateQR && item.assignedDateQr?.split("T")[0] === today.toISOString().split("T")[0]).length;
      count ? qrAvailabe.push({ username: assigny.username, count, maxCount: 15 }) : qrAvailabe.push({ username: assigny.username, count: 0, maxCount: 15 });
    });

    const mrAssignees = clientAssignies.filter((item) => item.level.toLowerCase() === "medical review".toLowerCase() && !item.onLeave);
    let mrAvailable = [];
    mrAssignees.forEach(assigny => {
      const count = existingAllCases?.filter(item => item.mr === assigny.username && !item.completedDateMR && item.assignedDateMr?.split("T")[0] === today.toISOString().split("T")[0]).length;
      count ? mrAvailable.push({ username: assigny.username, count }) : mrAvailable.push({ username: assigny.username, count: 0 });
    });

     const triageAssignees = clientAssignies.filter((item) => item.assignTriage && !item.onLeave);
    
    let triageesAvailable = [];
    triageAssignees.forEach(assigny => {
      const count = existingAllCases?.filter(item => 
        item.triageAssignedTo === assigny.username 
        && !item.triageCompletedAt 
        && item.triageAssignedAt?.split("T")[0] === today.toISOString().split("T")[0]).length;
      count ? triageesAvailable.push({ username: assigny.username, count, maxCount: 40 }) : triageesAvailable.push({ username: assigny.username, count: 0, maxCount: 40 });
    });

    return [deAvailabe, qrAvailabe, mrAvailable, triageesAvailable]
}
