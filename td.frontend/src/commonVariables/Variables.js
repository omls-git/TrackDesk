export const CV = {
xmllabels : {
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
},
nonXmlLabels : {
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
},
inital_fupOptions : [
  {value: "initial", label: "Initial"}, 
  {value: "Follow-up", label: "Follow-up"}, 
  {value: "Follow-up open", label: "Follow-up Open"},
  {value:'Amendment',label:"Amendment"}],
seriousnessOptions : [
  // {value: "fatal", label: "Fatal"}, 
  // {value: "life_threatening", label: "Life Threatening"}, 
  {value: "Serious", label: "Serious"}, 
  {value: "Non-serious", label: "Non-Serious"}
],
  reportabilityOptions : [
  {value: "5-day", label: "5-Day Reportable"},
  {value: "90-day", label: "90-Day Reportable"},
  {value: "Non-reportable", label: "Non-Reportable"}
], 
caseStatusOptions : [
  {value: "Triage", label: "Triage"},
  { value: 'Data Entry', label: 'Data Entry' },
  { value: 'Quality Review', label: 'Quality Review' },
  { value: 'Medical Review', label: 'Medical Review' },
  { value: 'Reporting', label: 'Reporting' },
  { value: 'Case Archival', label: 'Case Archival' }
],
caseStatusOptionsCipla : [
  {value: "Intake & Triage", label: "Intake & Triage"},
  { value: 'Data Entry', label: 'Data Entry' },
  { value: 'Quality Review', label: 'Quality Review' },
  { value: 'Medical Review', label: 'Medical Review' },
  { value: 'Reporting', label: 'Reporting' },
  { value: 'Case Archival', label: 'Case Archival' }
], 
reportTypeOptions : [
  { value: "Spontaneous", label: "Spontaneous" },
  { value: "True Spontaneous", label: "True Spontaneous" },
  { value: "Spontaneous Literature", label: "Spontaneous Literature" },
  { value: "Regulatory Authority", label: "Regulatory Authority" }
], 
live_backlogOptions : [
  { value: "Live case", label: "Live case"},
  {value: "Backlog case", label: "Backlog case"}
],
destinationForReportingOptions : [
  { value: "EMA", label: "EMA" },
  { value: "MHRA", label: "MHRA" },
  { value: "Kosovo", label: "Kosovo" },
  { value: "EMA & MHRA", label: "EMA & MHRA" },
  { value: "EMA & Kosovo", label: "EMA & Kosovo" },
  { value: "MHRA & Kosovo", label: "MHRA & Kosovo" },
  { value: "EMA, MHRA & Kosovo", label: "EMA, MHRA & Kosovo" },
  { value: "Not Applicable (Non-Reportable)", label: "Not Applicable (Non-Reportable)" }
],
reporatability: [
  { value: "7-day Reportable", label: "7-Day Reportable" },
  { value: "15-day Reportable", label: "15-Day Reportable" },
  { value: "90-day Reportable", label: "90-Day Reportable" },
  { value: "Non-reportable", label: "Non-Reportable" }
],
eventSeriousnessOptions: [
  { value: "Death", label: "Death" },
  { value: "Life Threatening", label: "Life Threatening" },
  { value: "Hospitalized", label: "Hospitalized" },
  { value: "Disability", label: "Disability" },
  { value: "Intervention Required", label: "Intervention Required" },
  { value: "Medically Significant", label: "Medically Significant" },
  { value: "Congenital Anomaly", label: "Congenital Anomaly" },
  { value: "Other", label: "Other" }
],
partnerAsOptions : [
  {value: "Crescent as MAH" ,label: "Crescent as MAH"},
  {value: "Crescent as Distributor" ,label: "Crescent as Distributor"}
],
rolesOptionsCipla : [
  { value: 'None', label: 'None' },
  { value: 'Data Entry', label: 'Data Entry' },
  { value: 'Quality Review', label: 'Quality Review' },
  { value: 'Medical Review', label: 'Medical Review' },
  {value: 'Reporting', label: 'Reporting' },
  { value: 'Book In/XML', label: 'Book In/XML' },
  { value: 'Book In/Non-XML', label: 'Book In/Non-XML' }
],
rolesOptions : [
  { value: 'None', label: 'None' },
  { value: 'Data Entry', label: 'Data Entry' },
  { value: 'Quality Review', label: 'Quality Review' },
  { value: 'Medical Review', label: 'Medical Review' },
  {value: 'Reporting', label: 'Reporting' }
]
};