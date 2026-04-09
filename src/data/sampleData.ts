export const mandals = [
  "Bhongir", "Choutuppal", "Alair", "Motakondur", "Bibinagar",
  "Yadagirigutta", "Raigir", "Pochampally", "Mothkur", "Bommalaramaram",
  "Valigonda", "Turkapally", "Narayanapur", "Atmakur (M)", "Rajapet"
];

export const caseTypes = [
  "Civil", "Criminal", "Revenue", "Land Dispute", "Service Matter",
  "Consumer Matter", "Tribunal Matter", "Writ Petition", "Other"
];

export const courtNames = [
  "District Court, Bhongir",
  "Principal District Court",
  "Telangana High Court",
  "Revenue Tribunal",
  "Civil Court",
  "Consumer Forum",
  "Revenue Court, Bhongir",
  "Revenue Court, Alair"
];

export const departments = [
  "Revenue Department", "Collectorate Legal Cell", "Land Records",
  "Tahsildar Office", "Survey & Settlement", "Municipal Administration",
  "General Administration", "Finance", "Planning", "IT"
];

export const priorities = ["High", "Medium", "Low", "Time-Sensitive", "Court-Critical"];

export const collectorateInvolvementTypes = [
  "Collectorate as Respondent", "Collectorate as Co-Respondent",
  "Department Involved", "Monitoring Only"
];

export const natureOfCaseOptions = [
  "Land Ownership Dispute", "Encroachment Matter", "Mutation / Revenue Record Issue",
  "Service / Administrative Matter", "Compensation / Acquisition Matter", "Compliance Matter"
];

export const complianceStatuses = ["Not Applicable", "Pending", "Partially Complied", "Complied"];

export const HC_STATUS_URL = "https://hcservices.ecourts.gov.in/ecourtindiaHC/cases/case_no.php?state_cd=29&dist_cd=1&court_code=1&stateNm=Telangana";

export interface CaseRecord {
  id: string;
  caseNumber: string;
  title: string;
  court: string;
  courtType: string;
  caseType: string;
  petitioner: string;
  respondent: string;
  coRespondents: string[];
  department: string;
  mandal: string;
  filingDate: string;
  filingYear: string;
  assignedOfficer: string;
  priority: string;
  status: string;
  lastHearing: string;
  nextHearing: string;
  advocate: string;
  advocateContact: string;
  subject: string;
  remarks: string;
  tags: string[];
  collectorateInvolvement: string;
  natureOfCase: string;
  landDisputeFlag: boolean;
  orderPassed: boolean;
  orderSummary: string;
  complianceRequired: boolean;
  complianceStatus: string;
  complianceDueDate: string;
  complianceCompletedDate: string;
  lastUpdated: string;
}

export const cases: CaseRecord[] = [
  {
    id: "LCMS/YBG/2024/001", caseNumber: "WP(C) 14523/2024", title: "Land Acquisition - Survey No. 145, Bhongir",
    court: "Telangana High Court", courtType: "High Court", caseType: "Land Dispute",
    petitioner: "Ramesh Kumar Reddy", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Tahsildar, Bhongir", "Revenue Divisional Officer, Bhongir"],
    department: "Revenue Department", mandal: "Bhongir", filingDate: "2024-01-15", filingYear: "2024",
    assignedOfficer: "K. Srinivas Rao", priority: "High", status: "Ongoing",
    lastHearing: "2024-03-10", nextHearing: "2024-04-15",
    advocate: "Adv. P. Venkatesh", advocateContact: "9876543210",
    subject: "Challenge to land acquisition notification under RFCTLARR Act for Survey No. 145, Bhongir Mandal",
    remarks: "Counter affidavit filed. Awaiting next hearing.", tags: ["Land", "Revenue", "Urgent"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Compensation / Acquisition Matter",
    landDisputeFlag: true, orderPassed: true, orderSummary: "Interim stay on acquisition proceedings granted",
    complianceRequired: true, complianceStatus: "Pending", complianceDueDate: "2024-04-30",
    complianceCompletedDate: "", lastUpdated: "2024-04-05"
  },
  {
    id: "LCMS/YBG/2024/002", caseNumber: "OS 234/2024", title: "Service Matter - Suspension of Clerk",
    court: "District Court, Bhongir", courtType: "District Court", caseType: "Service Matter",
    petitioner: "M. Lakshmi Devi", respondent: "Collector & DM, YBG",
    coRespondents: ["District Personnel Officer, YBG"],
    department: "General Administration", mandal: "Bhongir", filingDate: "2024-02-20", filingYear: "2024",
    assignedOfficer: "S. Padma Kumari", priority: "Medium", status: "Hearing Scheduled",
    lastHearing: "2024-03-25", nextHearing: "2024-04-08",
    advocate: "Adv. R. Suresh Babu", advocateContact: "9123456780",
    subject: "Challenge to suspension order of ministerial staff in Collectorate",
    remarks: "Written statement to be filed.", tags: ["Service", "HR"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Service / Administrative Matter",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2024-04-06"
  },
  {
    id: "LCMS/YBG/2024/003", caseNumber: "CCC 89/2024", title: "Consumer Complaint - Water Supply",
    court: "Consumer Forum", courtType: "Consumer Forum", caseType: "Consumer Matter",
    petitioner: "Nagarjuna Welfare Association", respondent: "HMWSSB & District Administration",
    coRespondents: ["Municipal Commissioner, Raigir", "Executive Engineer, HMWSSB"],
    department: "Municipal Administration", mandal: "Raigir", filingDate: "2024-03-01", filingYear: "2024",
    assignedOfficer: "D. Rajender", priority: "Low", status: "Fresh",
    lastHearing: "-", nextHearing: "2024-04-20",
    advocate: "Adv. G. Srinivasa Rao", advocateContact: "9988776655",
    subject: "Complaint regarding irregular water supply in Raigir Municipality",
    remarks: "Case recently filed. To assign junior officer.", tags: ["Municipal", "Consumer"],
    collectorateInvolvement: "Department Involved", natureOfCase: "Service / Administrative Matter",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2024-04-03"
  },
  {
    id: "LCMS/YBG/2024/004", caseNumber: "WP 7892/2023", title: "Encroachment Removal - Govt Land, Pochampally",
    court: "Telangana High Court", courtType: "High Court", caseType: "Revenue",
    petitioner: "Telangana State Govt", respondent: "Various Encroachers",
    coRespondents: ["Pochampally Gram Panchayat", "MRO, Pochampally"],
    department: "Revenue Department", mandal: "Pochampally", filingDate: "2023-11-10", filingYear: "2023",
    assignedOfficer: "K. Srinivas Rao", priority: "High", status: "Counter Pending",
    lastHearing: "2024-02-28", nextHearing: "2024-04-12",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Action against illegal encroachments on government land in Pochampally",
    remarks: "Counter pending from respondents. Urgent follow-up needed.", tags: ["Revenue", "Encroachment"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Encroachment Matter",
    landDisputeFlag: true, orderPassed: true, orderSummary: "Status quo ordered on encroached land",
    complianceRequired: true, complianceStatus: "Partially Complied", complianceDueDate: "2024-04-15",
    complianceCompletedDate: "", lastUpdated: "2024-04-07"
  },
  {
    id: "LCMS/YBG/2024/005", caseNumber: "TA 456/2023", title: "Tribunal Appeal - PRC Arrears",
    court: "Revenue Tribunal", courtType: "Tribunal", caseType: "Tribunal Matter",
    petitioner: "B. Venkateswarlu & Others", respondent: "State of Telangana",
    coRespondents: ["Principal Secretary, Finance Dept.", "District Treasury Officer, YBG"],
    department: "Finance", mandal: "Yadagirigutta", filingDate: "2023-08-15", filingYear: "2023",
    assignedOfficer: "S. Padma Kumari", priority: "Medium", status: "Appealed",
    lastHearing: "2024-01-20", nextHearing: "2024-05-10",
    advocate: "Adv. M. Bharath Kumar", advocateContact: "9012345678",
    subject: "PRC arrears claim by Group-D employees of Collectorate",
    remarks: "Appeal filed by petitioners. Review pending.", tags: ["Finance", "PRC"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Service / Administrative Matter",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Tribunal directed payment of arrears in 3 months",
    complianceRequired: true, complianceStatus: "Pending", complianceDueDate: "2024-06-20",
    complianceCompletedDate: "", lastUpdated: "2024-03-28"
  },
  {
    id: "LCMS/YBG/2023/010", caseNumber: "WP 2345/2022", title: "RoR Correction - Alair Mandal",
    court: "Telangana High Court", courtType: "High Court", caseType: "Civil",
    petitioner: "Smt. Sarojini Devi", respondent: "Tahsildar, Alair",
    coRespondents: ["Sub-Registrar, Alair"],
    department: "Land Records", mandal: "Alair", filingDate: "2022-06-18", filingYear: "2022",
    assignedOfficer: "D. Rajender", priority: "Low", status: "Closed",
    lastHearing: "2023-12-15", nextHearing: "-",
    advocate: "Adv. K. Ramakrishna", advocateContact: "9567890123",
    subject: "Correction of Record of Rights in Alair Mandal land records",
    remarks: "Case disposed. Orders complied.", tags: ["Revenue", "Land Records"],
    collectorateInvolvement: "Department Involved", natureOfCase: "Mutation / Revenue Record Issue",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Directed correction of RoR entries within 60 days",
    complianceRequired: true, complianceStatus: "Complied", complianceDueDate: "2024-02-15",
    complianceCompletedDate: "2024-01-28", lastUpdated: "2024-01-28"
  },
  {
    id: "LCMS/YBG/2024/006", caseNumber: "CC 102/2024", title: "Criminal Case - Illegal Sand Mining, Mothkur",
    court: "District Court, Bhongir", courtType: "District Court", caseType: "Criminal",
    petitioner: "State of Telangana", respondent: "K. Mahesh & Others",
    coRespondents: ["Sarpanch, Mothkur GP"],
    department: "Revenue Department", mandal: "Mothkur", filingDate: "2024-03-25", filingYear: "2024",
    assignedOfficer: "K. Srinivas Rao", priority: "High", status: "Fresh",
    lastHearing: "-", nextHearing: "2024-04-28",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Illegal sand mining in Mothkur mandal river bed areas",
    remarks: "FIR registered. Court notice issued.", tags: ["Criminal", "Mining"],
    collectorateInvolvement: "Department Involved", natureOfCase: "Encroachment Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2024-04-07"
  },
  {
    id: "LCMS/YBG/2024/007", caseNumber: "LP 45/2024", title: "Land Petition - Boundary Dispute, Choutuppal",
    court: "Revenue Court, Bhongir", courtType: "Revenue Court", caseType: "Land Dispute",
    petitioner: "G. Suresh Reddy", respondent: "MRO, Choutuppal",
    coRespondents: ["Village Revenue Officer, Choutuppal"],
    department: "Revenue Department", mandal: "Choutuppal", filingDate: "2024-04-01", filingYear: "2024",
    assignedOfficer: "D. Rajender", priority: "Medium", status: "Fresh",
    lastHearing: "-", nextHearing: "2024-04-22",
    advocate: "Adv. T. Narasimha", advocateContact: "9345678901",
    subject: "Dispute over patta land boundaries in Choutuppal mandal",
    remarks: "Recently filed. Preliminary hearing pending.", tags: ["Land", "Revenue"],
    collectorateInvolvement: "Monitoring Only", natureOfCase: "Land Ownership Dispute",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2024-04-07"
  },
  {
    id: "LCMS/YBG/2024/008", caseNumber: "WP(C) 16789/2024", title: "Writ Petition - Mutation Delay, Bibinagar",
    court: "Telangana High Court", courtType: "High Court", caseType: "Writ Petition",
    petitioner: "A. Narayana Swamy", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Tahsildar, Bibinagar", "Survey Department"],
    department: "Land Records", mandal: "Bibinagar", filingDate: "2024-03-15", filingYear: "2024",
    assignedOfficer: "K. Srinivas Rao", priority: "Court-Critical", status: "Hearing Scheduled",
    lastHearing: "2024-04-02", nextHearing: "2024-04-09",
    advocate: "Adv. S. Rani", advocateContact: "9234567890",
    subject: "Delay in processing mutation application for agricultural land in Bibinagar",
    remarks: "HC directed to complete mutation within 4 weeks.", tags: ["Mutation", "Urgent"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Mutation / Revenue Record Issue",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Directed completion of mutation within 4 weeks",
    complianceRequired: true, complianceStatus: "Pending", complianceDueDate: "2024-05-02",
    complianceCompletedDate: "", lastUpdated: "2024-04-07"
  },
  {
    id: "LCMS/YBG/2024/009", caseNumber: "OS 567/2024", title: "Compensation Claim - Road Widening, Alair",
    court: "District Court, Bhongir", courtType: "District Court", caseType: "Civil",
    petitioner: "P. Venkat Reddy & Ors.", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Joint Collector Office", "Revenue Divisional Officer"],
    department: "Revenue Department", mandal: "Alair", filingDate: "2024-02-10", filingYear: "2024",
    assignedOfficer: "S. Padma Kumari", priority: "High", status: "Ongoing",
    lastHearing: "2024-03-20", nextHearing: "2024-04-18",
    advocate: "Adv. K. Ramakrishna", advocateContact: "9567890123",
    subject: "Inadequate compensation for land acquired for NH road widening near Alair",
    remarks: "Govt valuation report submitted. Counter arguments pending.", tags: ["Compensation", "Land"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Compensation / Acquisition Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2024-04-04"
  },
  {
    id: "LCMS/YBG/2024/010", caseNumber: "WP 8901/2023", title: "Encroachment on Assigned Land - Yadagirigutta",
    court: "Telangana High Court", courtType: "High Court", caseType: "Land Dispute",
    petitioner: "B. Sai Kumar", respondent: "Gram Panchayat, Yadagirigutta",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri", "MRO, Yadagirigutta"],
    department: "Revenue Department", mandal: "Yadagirigutta", filingDate: "2023-09-20", filingYear: "2023",
    assignedOfficer: "D. Rajender", priority: "Time-Sensitive", status: "Under Review",
    lastHearing: "2024-03-05", nextHearing: "2024-04-25",
    advocate: "Adv. M. Srinivas", advocateContact: "9456789012",
    subject: "Encroachment on assigned land by local body near temple area",
    remarks: "Survey report awaited. Revenue inspection ordered.", tags: ["Encroachment", "Assigned Land"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Encroachment Matter",
    landDisputeFlag: true, orderPassed: true, orderSummary: "Directed revenue survey within 30 days",
    complianceRequired: true, complianceStatus: "Partially Complied", complianceDueDate: "2024-04-05",
    complianceCompletedDate: "", lastUpdated: "2024-04-06"
  },
  {
    id: "LCMS/YBG/2024/011", caseNumber: "RA 112/2024", title: "Revenue Appeal - Patta Cancellation, Motakondur",
    court: "Revenue Court, Bhongir", courtType: "Revenue Court", caseType: "Revenue",
    petitioner: "L. Ramaiah", respondent: "Tahsildar, Motakondur",
    coRespondents: ["Revenue Divisional Officer"],
    department: "Tahsildar Office", mandal: "Motakondur", filingDate: "2024-01-30", filingYear: "2024",
    assignedOfficer: "S. Padma Kumari", priority: "Medium", status: "Ongoing",
    lastHearing: "2024-03-18", nextHearing: "2024-04-30",
    advocate: "Adv. D. Krishna", advocateContact: "9678901234",
    subject: "Appeal against patta cancellation order by Tahsildar, Motakondur",
    remarks: "Revenue enquiry pending.", tags: ["Revenue", "Patta"],
    collectorateInvolvement: "Monitoring Only", natureOfCase: "Mutation / Revenue Record Issue",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2024-03-25"
  },
  {
    id: "LCMS/YBG/2024/012", caseNumber: "WP(C) 19234/2024", title: "Writ Petition - Demolition Stay, Raigir",
    court: "Telangana High Court", courtType: "High Court", caseType: "Writ Petition",
    petitioner: "Raigir Town Residents' Association", respondent: "Municipal Commissioner, Raigir",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri", "Joint Collector Office"],
    department: "Municipal Administration", mandal: "Raigir", filingDate: "2024-03-28", filingYear: "2024",
    assignedOfficer: "K. Srinivas Rao", priority: "Court-Critical", status: "Hearing Scheduled",
    lastHearing: "2024-04-03", nextHearing: "2024-04-10",
    advocate: "Adv. N. Srinivas Reddy", advocateContact: "9789012345",
    subject: "Stay petition against demolition of unauthorized constructions in Raigir town",
    remarks: "Interim stay granted. Compliance report due.", tags: ["Municipal", "Demolition", "Stay"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Encroachment Matter",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Interim stay on demolition for 4 weeks",
    complianceRequired: true, complianceStatus: "Complied", complianceDueDate: "2024-04-10",
    complianceCompletedDate: "2024-04-05", lastUpdated: "2024-04-07"
  },
  {
    id: "LCMS/YBG/2024/013", caseNumber: "CC 45/2023", title: "Consumer Complaint - Power Disconnection",
    court: "Consumer Forum", courtType: "Consumer Forum", caseType: "Consumer Matter",
    petitioner: "T. Anjaiah", respondent: "TSSPDCL",
    coRespondents: ["Collector & DM, YBG"],
    department: "General Administration", mandal: "Choutuppal", filingDate: "2023-10-05", filingYear: "2023",
    assignedOfficer: "D. Rajender", priority: "Low", status: "Closed",
    lastHearing: "2024-02-10", nextHearing: "-",
    advocate: "Adv. G. Srinivasa Rao", advocateContact: "9988776655",
    subject: "Wrongful disconnection of electricity supply in Choutuppal",
    remarks: "Matter settled. Reconnection done.", tags: ["Consumer", "Power"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Service / Administrative Matter",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Directed reconnection and compensation of Rs.10,000",
    complianceRequired: true, complianceStatus: "Complied", complianceDueDate: "2024-03-10",
    complianceCompletedDate: "2024-02-28", lastUpdated: "2024-02-28"
  },
  {
    id: "LCMS/YBG/2024/014", caseNumber: "LP 78/2024", title: "Land Dispute - Private Party vs Govt, Bommalaramaram",
    court: "Civil Court", courtType: "Civil Court", caseType: "Land Dispute",
    petitioner: "Private Land Owner", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Survey Department", "Tahsildar, Bommalaramaram"],
    department: "Survey & Settlement", mandal: "Bommalaramaram", filingDate: "2024-04-03", filingYear: "2024",
    assignedOfficer: "K. Srinivas Rao", priority: "High", status: "Fresh",
    lastHearing: "-", nextHearing: "2024-04-25",
    advocate: "Adv. P. Venkatesh", advocateContact: "9876543210",
    subject: "Dispute over government land boundaries overlapping private patta in Bommalaramaram",
    remarks: "Newly filed. Survey report requested.", tags: ["Land", "Survey", "Sensitive"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Land Ownership Dispute",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2024-04-07"
  },
  {
    id: "LCMS/YBG/2024/015", caseNumber: "WP 4567/2022", title: "Service Matter - Seniority Dispute",
    court: "Telangana High Court", courtType: "High Court", caseType: "Service Matter",
    petitioner: "R. Suresh & Others", respondent: "State of Telangana",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri"],
    department: "General Administration", mandal: "Bhongir", filingDate: "2022-03-10", filingYear: "2022",
    assignedOfficer: "S. Padma Kumari", priority: "Medium", status: "Ongoing",
    lastHearing: "2024-01-15", nextHearing: "2024-05-20",
    advocate: "Adv. M. Bharath Kumar", advocateContact: "9012345678",
    subject: "Seniority fixation dispute among ministerial staff of Collectorate",
    remarks: "Arguments ongoing. Long-pending matter.", tags: ["Service", "Seniority"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Service / Administrative Matter",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2024-01-15"
  },
  {
    id: "LCMS/YBG/2024/016", caseNumber: "OS 890/2024", title: "Compensation - Acquisition for Govt Building, Valigonda",
    court: "Principal District Court", courtType: "District Court", caseType: "Civil",
    petitioner: "M. Ramesh Goud", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Joint Collector Office", "Revenue Divisional Officer"],
    department: "Revenue Department", mandal: "Valigonda", filingDate: "2024-03-05", filingYear: "2024",
    assignedOfficer: "D. Rajender", priority: "Time-Sensitive", status: "Ongoing",
    lastHearing: "2024-03-30", nextHearing: "2024-04-16",
    advocate: "Adv. T. Narasimha", advocateContact: "9345678901",
    subject: "Enhanced compensation for land acquired for government building in Valigonda",
    remarks: "Valuation disputed. Expert opinion sought.", tags: ["Compensation", "Acquisition"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Compensation / Acquisition Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2024-04-06"
  },
  {
    id: "LCMS/YBG/2024/017", caseNumber: "CC 201/2024", title: "Criminal - Unauthorized Layout, Turkapally",
    court: "District Court, Bhongir", courtType: "District Court", caseType: "Criminal",
    petitioner: "State of Telangana", respondent: "N. Raju & Others",
    coRespondents: ["Gram Panchayat, Turkapally"],
    department: "Revenue Department", mandal: "Turkapally", filingDate: "2024-04-05", filingYear: "2024",
    assignedOfficer: "K. Srinivas Rao", priority: "High", status: "Fresh",
    lastHearing: "-", nextHearing: "2024-05-05",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Unauthorized layout development on government land in Turkapally",
    remarks: "Case registered. Notice issued to accused.", tags: ["Criminal", "Layout", "Unauthorized"],
    collectorateInvolvement: "Department Involved", natureOfCase: "Encroachment Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2024-04-07"
  },
];

export const appeals = [
  { id: "APL/YBG/2024/001", parentCaseId: "LCMS/YBG/2024/001", appealNumber: "WA 234/2024", court: "Division Bench, HC Telangana", filingDate: "2024-03-20", grounds: "Error in single bench order regarding land valuation methodology", stage: "Admission", assignedOfficer: "K. Srinivas Rao", nextHearing: "2024-04-25", outcome: "Pending", remarks: "Writ appeal admitted. Stay granted.", attachments: 2 },
  { id: "APL/YBG/2024/002", parentCaseId: "LCMS/YBG/2024/005", appealNumber: "RA 78/2024", court: "Principal Bench, TAT", filingDate: "2024-02-10", grounds: "Review of arrears computation by single member bench", stage: "Arguments", assignedOfficer: "S. Padma Kumari", nextHearing: "2024-05-15", outcome: "Pending", remarks: "Arguments stage. Govt side to present.", attachments: 1 },
];

export const hearings = [
  { id: "HRG/001", caseId: "LCMS/YBG/2024/001", caseTitle: "Land Acquisition - Survey No. 145", court: "Telangana High Court", date: "2024-04-15", time: "10:30 AM", type: "Regular Hearing", officer: "K. Srinivas Rao", status: "Scheduled", outcome: "", remarks: "Counter affidavit to be presented", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/002", caseId: "LCMS/YBG/2024/002", caseTitle: "Service Matter - Suspension", court: "District Court, Bhongir", date: "2024-04-08", time: "11:00 AM", type: "Arguments", officer: "S. Padma Kumari", status: "Scheduled", outcome: "", remarks: "Written statement deadline", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/003", caseId: "LCMS/YBG/2024/004", caseTitle: "Encroachment Removal - Pochampally", court: "Telangana High Court", date: "2024-04-12", time: "2:00 PM", type: "Counter Filing", officer: "K. Srinivas Rao", status: "Scheduled", outcome: "", remarks: "Counter expected from respondents", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/004", caseId: "LCMS/YBG/2024/003", caseTitle: "Consumer Complaint - Water", court: "Consumer Forum", date: "2024-04-20", time: "11:30 AM", type: "First Hearing", officer: "D. Rajender", status: "Scheduled", outcome: "", remarks: "First appearance", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/005", caseId: "LCMS/YBG/2024/001", caseTitle: "Land Acquisition - Survey No. 145", court: "Telangana High Court", date: "2024-03-10", time: "10:30 AM", type: "Regular Hearing", officer: "K. Srinivas Rao", status: "Completed", outcome: "Adjourned", remarks: "Matter adjourned to 15-Apr. Counter filed.", orderPassed: true, orderSummary: "Interim stay on acquisition proceedings", complianceRequired: true, complianceStatus: "Pending" },
  { id: "HRG/006", caseId: "LCMS/YBG/2024/002", caseTitle: "Service Matter - Suspension", court: "District Court, Bhongir", date: "2024-03-25", time: "11:00 AM", type: "Arguments", officer: "S. Padma Kumari", status: "Completed", outcome: "Part-heard", remarks: "Arguments partly heard. Adjourned.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/007", caseId: "LCMS/YBG/2024/006", caseTitle: "Criminal - Sand Mining", court: "District Court, Bhongir", date: "2024-04-28", time: "10:00 AM", type: "First Hearing", officer: "K. Srinivas Rao", status: "Scheduled", outcome: "", remarks: "First appearance. Notice served.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/008", caseId: "LCMS/YBG/2024/008", caseTitle: "Writ - Mutation Delay", court: "Telangana High Court", date: "2024-04-09", time: "10:00 AM", type: "Regular Hearing", officer: "K. Srinivas Rao", status: "Scheduled", outcome: "", remarks: "Compliance report due.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/009", caseId: "LCMS/YBG/2024/012", caseTitle: "Writ - Demolition Stay", court: "Telangana High Court", date: "2024-04-10", time: "2:30 PM", type: "Regular Hearing", officer: "K. Srinivas Rao", status: "Scheduled", outcome: "", remarks: "Compliance status to be submitted.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/010", caseId: "LCMS/YBG/2024/010", caseTitle: "Encroachment - Yadagirigutta", court: "Telangana High Court", date: "2024-03-05", time: "11:00 AM", type: "Regular Hearing", officer: "D. Rajender", status: "Completed", outcome: "Directions issued", remarks: "Directed revenue survey within 30 days.", orderPassed: true, orderSummary: "Revenue survey directed within 30 days", complianceRequired: true, complianceStatus: "Partially Complied" },
];

export const alerts = [
  { id: "ALT/001", type: "Hearing Reminder", message: "Hearing in WP(C) 14523/2024 due in 3 days", caseId: "LCMS/YBG/2024/001", officer: "K. Srinivas Rao", date: "2024-04-12", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/002", type: "Hearing Reminder", message: "Hearing in OS 234/2024 due tomorrow", caseId: "LCMS/YBG/2024/002", officer: "S. Padma Kumari", date: "2024-04-07", priority: "Urgent", status: "Sent", channel: "SMS" },
  { id: "ALT/003", type: "Overdue Update", message: "Status update overdue for WP 7892/2023", caseId: "LCMS/YBG/2024/004", officer: "K. Srinivas Rao", date: "2024-04-05", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/004", type: "Appeal Deadline", message: "Appeal deadline approaching for TA 456/2023", caseId: "LCMS/YBG/2024/005", officer: "S. Padma Kumari", date: "2024-04-10", priority: "Medium", status: "Sent", channel: "Email" },
  { id: "ALT/005", type: "Escalation", message: "Case LCMS/YBG/2024/004 pending beyond 30 days without update", caseId: "LCMS/YBG/2024/004", officer: "K. Srinivas Rao", date: "2024-04-06", priority: "Urgent", status: "Failed", channel: "SMS" },
  { id: "ALT/006", type: "Compliance Due", message: "Compliance due this week for WP(C) 16789/2024", caseId: "LCMS/YBG/2024/008", officer: "K. Srinivas Rao", date: "2024-04-07", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/007", type: "Order Compliance", message: "Order compliance pending for encroachment case - Yadagirigutta", caseId: "LCMS/YBG/2024/010", officer: "D. Rajender", date: "2024-04-06", priority: "Urgent", status: "Pending", channel: "SMS" },
  { id: "ALT/008", type: "Land Dispute", message: "High-priority land dispute pending in Bommalaramaram", caseId: "LCMS/YBG/2024/014", officer: "K. Srinivas Rao", date: "2024-04-07", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/009", type: "Hearing Reminder", message: "Hearing tomorrow - WP(C) 16789/2024 Mutation Delay", caseId: "LCMS/YBG/2024/008", officer: "K. Srinivas Rao", date: "2024-04-08", priority: "Urgent", status: "Sent", channel: "SMS" },
];

export const users = [
  { id: "USR/001", name: "Sri. Pamela Satpathy, IAS", email: "collector@ybg.telangana.gov.in", role: "District Collector", department: "General Administration", mandal: "All", status: "Active", lastLogin: "2024-04-07 09:15" },
  { id: "USR/002", name: "K. Srinivas Rao", email: "legal.officer1@ybg.telangana.gov.in", role: "Legal Officer", department: "Collectorate Legal Cell", mandal: "All", status: "Active", lastLogin: "2024-04-07 10:30" },
  { id: "USR/003", name: "S. Padma Kumari", email: "legal.officer2@ybg.telangana.gov.in", role: "Case Handling Officer", department: "Collectorate Legal Cell", mandal: "All", status: "Active", lastLogin: "2024-04-06 16:45" },
  { id: "USR/004", name: "D. Rajender", email: "section.officer@ybg.telangana.gov.in", role: "Section Officer", department: "Revenue Department", mandal: "Alair", status: "Active", lastLogin: "2024-04-07 08:00" },
  { id: "USR/005", name: "M. Priya", email: "deo@ybg.telangana.gov.in", role: "Data Entry Operator", department: "Collectorate Legal Cell", mandal: "Bhongir", status: "Active", lastLogin: "2024-04-07 09:45" },
  { id: "USR/006", name: "Admin User", email: "admin@ybg.telangana.gov.in", role: "Admin", department: "IT", mandal: "All", status: "Active", lastLogin: "2024-04-07 07:30" },
  { id: "USR/007", name: "R. Venkat Reddy", email: "viewer@ybg.telangana.gov.in", role: "Read-Only Viewer", department: "Planning", mandal: "All", status: "Inactive", lastLogin: "2024-03-28 14:00" },
  { id: "USR/008", name: "P. Nagesh", email: "hc.rep@ybg.telangana.gov.in", role: "HC Representative Officer", department: "Collectorate Legal Cell", mandal: "All", status: "Active", lastLogin: "2024-04-07 08:45" },
  { id: "USR/009", name: "V. Sridhar", email: "mandal.user@ybg.telangana.gov.in", role: "Mandal-Level User", department: "Tahsildar Office", mandal: "Choutuppal", status: "Active", lastLogin: "2024-04-06 11:00" },
];

export const auditLogs = [
  { id: 1, timestamp: "2024-04-07 10:32:15", user: "K. Srinivas Rao", role: "Legal Officer", action: "Updated", module: "Cases", object: "Case LCMS/YBG/2024/001", details: "Changed status from 'Fresh' to 'Ongoing'" },
  { id: 2, timestamp: "2024-04-07 09:45:00", user: "M. Priya", role: "Data Entry Operator", action: "Created", module: "Cases", object: "Case LCMS/YBG/2024/014", details: "New case registered for Land Dispute" },
  { id: 3, timestamp: "2024-04-07 08:50:00", user: "P. Nagesh", role: "HC Representative Officer", action: "Updated", module: "Hearings", object: "Hearing HRG/009", details: "Updated hearing outcome and compliance status" },
  { id: 4, timestamp: "2024-04-06 16:20:00", user: "S. Padma Kumari", role: "Case Handling Officer", action: "Uploaded", module: "Documents", object: "Counter Affidavit", details: "Uploaded counter affidavit for WP(C) 14523/2024" },
  { id: 5, timestamp: "2024-04-06 15:00:00", user: "Admin User", role: "Admin", action: "Modified", module: "Users", object: "User USR/007", details: "Deactivated user R. Venkat Reddy" },
  { id: 6, timestamp: "2024-04-06 11:30:00", user: "K. Srinivas Rao", role: "Legal Officer", action: "Updated", module: "Compliance", object: "Case LCMS/YBG/2024/012", details: "Marked compliance as Complied" },
  { id: 7, timestamp: "2024-04-05 14:15:00", user: "D. Rajender", role: "Section Officer", action: "Created", module: "Alerts", object: "Alert ALT/003", details: "Generated overdue alert for WP 7892/2023" },
  { id: 8, timestamp: "2024-04-05 10:00:00", user: "S. Padma Kumari", role: "Case Handling Officer", action: "Created", module: "Appeals", object: "Appeal APL/YBG/2024/002", details: "Filed review appeal for TA 456/2023" },
  { id: 9, timestamp: "2024-04-04 15:30:00", user: "M. Priya", role: "Data Entry Operator", action: "Bulk Upload", module: "Cases", object: "Bulk Import", details: "Uploaded 5 cases via CSV import" },
  { id: 10, timestamp: "2024-04-04 09:00:00", user: "K. Srinivas Rao", role: "Legal Officer", action: "Exported", module: "Reports", object: "Court-wise Report", details: "Exported court-wise case report to PDF" },
];

export const documents = [
  { id: "DOC/001", name: "Counter Affidavit - WP(C) 14523/2024", category: "Affidavit", linkedCase: "LCMS/YBG/2024/001", uploadDate: "2024-03-08", uploadedBy: "S. Padma Kumari", size: "2.4 MB", type: "PDF" },
  { id: "DOC/002", name: "Land Survey Report - Survey No. 145", category: "Survey Report", linkedCase: "LCMS/YBG/2024/001", uploadDate: "2024-02-15", uploadedBy: "D. Rajender", size: "5.1 MB", type: "PDF" },
  { id: "DOC/003", name: "Suspension Order Copy", category: "Order", linkedCase: "LCMS/YBG/2024/002", uploadDate: "2024-02-22", uploadedBy: "M. Priya", size: "850 KB", type: "PDF" },
  { id: "DOC/004", name: "Consumer Forum Notice", category: "Notice", linkedCase: "LCMS/YBG/2024/003", uploadDate: "2024-03-05", uploadedBy: "M. Priya", size: "320 KB", type: "PDF" },
  { id: "DOC/005", name: "Encroachment Photos - Pochampally", category: "Evidence", linkedCase: "LCMS/YBG/2024/004", uploadDate: "2023-12-10", uploadedBy: "D. Rajender", size: "12.3 MB", type: "ZIP" },
  { id: "DOC/006", name: "PRC Calculation Sheet", category: "Financial", linkedCase: "LCMS/YBG/2024/005", uploadDate: "2023-09-01", uploadedBy: "S. Padma Kumari", size: "1.1 MB", type: "XLSX" },
  { id: "DOC/007", name: "Court Order - Stay on Acquisition", category: "Court Order", linkedCase: "LCMS/YBG/2024/001", uploadDate: "2024-03-12", uploadedBy: "K. Srinivas Rao", size: "1.8 MB", type: "PDF" },
  { id: "DOC/008", name: "Revenue Survey Report - Yadagirigutta", category: "Survey Report", linkedCase: "LCMS/YBG/2024/010", uploadDate: "2024-03-20", uploadedBy: "D. Rajender", size: "3.2 MB", type: "PDF" },
];

export const statusColors: Record<string, string> = {
  "Fresh": "bg-status-fresh/10 text-status-fresh border-status-fresh/20",
  "Ongoing": "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
  "Hearing Scheduled": "bg-status-hearing/10 text-status-hearing border-status-hearing/20",
  "Counter Pending": "bg-status-pending/10 text-status-pending border-status-pending/20",
  "Appealed": "bg-status-appealed/10 text-status-appealed border-status-appealed/20",
  "Closed": "bg-status-closed/10 text-status-closed border-status-closed/20",
  "Under Review": "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
  "Scheduled": "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
  "Completed": "bg-status-success/10 text-status-success border-status-success/20",
  "Pending": "bg-status-warning/10 text-status-warning border-status-warning/20",
  "Sent": "bg-status-success/10 text-status-success border-status-success/20",
  "Failed": "bg-status-urgent/10 text-status-urgent border-status-urgent/20",
  "Active": "bg-status-success/10 text-status-success border-status-success/20",
  "Inactive": "bg-status-closed/10 text-status-closed border-status-closed/20",
  "Admission": "bg-status-fresh/10 text-status-fresh border-status-fresh/20",
  "Arguments": "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
  "Complied": "bg-status-success/10 text-status-success border-status-success/20",
  "Partially Complied": "bg-status-warning/10 text-status-warning border-status-warning/20",
  "Not Applicable": "bg-muted text-muted-foreground border-border",
};

export const priorityColors: Record<string, string> = {
  "High": "bg-status-urgent/10 text-status-urgent border-status-urgent/20",
  "Medium": "bg-status-warning/10 text-status-warning border-status-warning/20",
  "Low": "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
  "Urgent": "bg-status-urgent/10 text-status-urgent border-status-urgent/20",
  "Time-Sensitive": "bg-status-pending/10 text-status-pending border-status-pending/20",
  "Court-Critical": "bg-status-urgent/10 text-status-urgent border-status-urgent/20",
};
