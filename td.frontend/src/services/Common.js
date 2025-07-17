import { formattedIST } from "../Utility";
import { getEmployees } from "./API"

export const caseAllocation = async(cases, existingAllCases, clientId) => {
  const assignies = await getEmployees();
  const clientAssignies = assignies.filter((item) => item.projectId.toString() === clientId.toString() && !item.onLeave);

  if (clientAssignies.length === 0) {
    console.error("No assignies found for the client to assign cases", clientId);
    return [];
  }
  
  const deAssiniees = clientAssignies.filter((item) => item.level.toLowerCase() === "data entry".toLowerCase() && !item.onLeave);

   let de = [];
    deAssiniees.forEach(assigny => {
      const count = existingAllCases?.filter(item => item.de === assigny.username && !item.completedDateDE).length;
      count ? de.push({ username: assigny.username, count, maxCount: 8 }) : de.push({ username: assigny.username, count: 0, maxCount: 8 });
    });

    const qrAssignees = clientAssignies.filter((item) => item.level.toLowerCase() === "quality review".toLowerCase() && !item.onLeave);
    let qr = [];
    qrAssignees.forEach(assigny => {
      const count = existingAllCases?.filter(item => item.qr === assigny.username && !item.completedDateQR).length;
      count ? qr.push({ username: assigny.username, count, maxCount: 15 }) : qr.push({ username: assigny.username, count: 0, maxCount: 15 });
    });

    const mrAssignees = clientAssignies.filter((item) => item.level.toLowerCase() === "medical review".toLowerCase() && !item.onLeave);
    let mr = [];
    mrAssignees.forEach(assigny => {
      const count = existingAllCases?.filter(item => item.mr === assigny.username && !item.completedDateMR).length;
      count ? mr.push({ username: assigny.username, count }) : mr.push({ username: assigny.username, count: 0 });
    });

    const dataEntryCases = cases.filter(item => item["Case Status"].toLowerCase().trim() === "data entry");
    const qualityReviewCases = cases.filter(item => item["Case Status"].toLowerCase().trim() === "quality review");
    const medicalReviewCases = cases.filter(item => item["Case Status"].toLowerCase().trim() === "medical review");
    const remainingCases = cases.filter(item => !["data entry", "quality review", "medical review"].includes(item["Case Status"].toLowerCase().trim()));

    const dateEntryAssignedCases = employeesToAssign(de, dataEntryCases, "de", clientId);
    const qualityReviewAssignedCases = employeesToAssign(qr, qualityReviewCases, "qr", clientId);
    const medicalReviewAssignedCases = employeesToAssign(mr, medicalReviewCases, "mr", clientId);


    const assignedCases = [...dateEntryAssignedCases, ...qualityReviewAssignedCases, ...medicalReviewAssignedCases, ...remainingCases.map(item => mapCaseToApiFormat(item, clientId))];
    console.log(assignedCases)
    return assignedCases;

}


export const mapCaseToApiFormat = (item, id) => ({
  project_id: parseInt(id),
  casesOpen: item["Cases open"] || item["Days open"] || 0,
  caseNumber: item["Case Number"] || item["Case ID"] || "",
  initial_fup_fupToOpen: item["Initial/FUP/FUP to Open (FUOP)"] || item["Initial/FUP"] || "",
  ird_frd: item["IRD/FRD"],
  assignedDateDe: item["Assigned Date (DE)"] ? item["Assigned Date (DE)"] : null ,
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
  ORD: item["ORD"] || "",
  Country: item["Country"] || "",
  Partner: item["Partner"] || "",
  createdOn: formattedIST(),
  createdBy: localStorage.getItem("userName") || "",
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
      const currentCase = mapCaseToApiFormat(deCases[i], projectId);     
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
      const currentCase = mapCaseToApiFormat(qrCases[i], projectId);
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
      const currentCase = mapCaseToApiFormat(mrCases[i], projectId);
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

}

export const getClientAssigniesOfRole = async (role, clientId) => {
  const assignies = await getEmployees();
  const clientAssigniesOfRole = assignies.filter((item) =>!item.onLeave && item.level.toLowerCase() === role.toLowerCase() && item.projectId.toString() === clientId.toString());
  
  if (clientAssigniesOfRole.length === 0) {
    console.error("No assignies found for the client to assign cases");
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
      console.log("deCount", count);
      
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

    return [deAvailabe, qrAvailabe, mrAvailable]
}
