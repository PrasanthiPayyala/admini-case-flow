export const mandals = [
  "Addagudur", "Alair", "Atmakur(M)", "Bhongir", "Bibinagar",
  "Bommalaramaram", "Motakondur", "Mothkur", "Rajapet", "Turkapally",
  "Yadagirigutta", "Bhoodan Pochampally", "Choutuppal", "Ramannapet",
  "Samsthan Narayanapur", "Valigonda", "Gundala"
];

export const divisions: Record<string, string[]> = {
  "Bhongir Division": ["Bhongir", "Bibinagar", "Bommalaramaram", "Alair", "Yadagirigutta", "Addagudur", "Atmakur(M)", "Motakondur", "Turkapally"],
  "Choutuppal Division": ["Choutuppal", "Mothkur", "Rajapet", "Bhoodan Pochampally", "Ramannapet", "Samsthan Narayanapur", "Valigonda", "Gundala"],
};

export const tahsildarNames: Record<string, string> = {
  "Addagudur": "Sri. G. Dasaratha",
  "Alair": "Sri. P. Rama Krishna",
  "Atmakur(M)": "Smt. M. Jayamma",
  "Bhongir": "Sri. K. Venkat Reddy",
  "Bibinagar": "Sri. Y. Ashok Reddy",
  "Bommalaramaram": "Smt. P. Padmasundari",
  "Motakondur": "Smt. P. Jyothi",
  "Mothkur": "Sri. Shaik Ahmed",
  "Rajapet": "Sri. P. Ravi Kumar",
  "Turkapally": "Sri. V. Brahmaiah",
  "Yadagirigutta": "Sri. Shobhan Babu",
  "Bhoodan Pochampally": "Smt. B. Veera Bai",
  "Choutuppal": "Sri. P. Shyam Sundar Reddy",
  "Ramannapet": "Sri. V. Anjaneyulu",
  "Samsthan Narayanapur": "Sri. Ch. Srinivasa Raju",
  "Valigonda": "Sri. D. Ganesh",
  "Gundala": "Smt. G. Jyothi",
};

export const collectotateSections = [
  { code: "C", name: "Section C", description: "Court / Legal Matters" },
  { code: "D", name: "Section D", description: "Land Revenue and Relief" },
  { code: "E", name: "Section E", description: "Land Administration" },
  { code: "G", name: "Section G", description: "Land Acquisition" },
];

export const caseTypes = [
  "Writ Petition", "Land Dispute", "Revenue Matter", "Civil Suit",
  "Tribunal Matter", "Consumer Matter", "Service Matter",
  "Encroachment Matter", "Compensation Matter", "Compliance Matter"
];

export const courtNames = [
  "District Court, Bhongir",
  "Principal District Court, Bhongir",
  "Telangana High Court",
  "Revenue Tribunal",
  "Civil Court, Bhongir",
  "Consumer Forum"
];

export const departments = [
  "Collectorate Legal Cell", "Revenue Department", "Land Records",
  "Tahsildar Office", "Survey & Settlement", "Municipal Administration",
  "Panchayat Raj", "Roads & Buildings", "Irrigation", "Education Department"
];

export const priorities = ["High", "Medium", "Low", "Time-Sensitive", "Court-Critical"];

export const collectorateInvolvementTypes = [
  "Collectorate as Respondent", "Collectorate as Co-Respondent",
  "Department Involved", "Monitoring Only"
];

export const natureOfCaseOptions = [
  "Land Ownership Dispute", "Encroachment Removal", "Mutation / Revenue Record Issue",
  "Compensation / Acquisition Matter", "Service / Administrative Matter",
  "Court Direction Compliance", "Survey Boundary Dispute",
  "Public Land Protection Matter", "Municipal Notice Challenge", "Departmental Action Matter"
];

export const complianceStatuses = ["Not Applicable", "Pending", "Partially Complied", "Complied"];

export const pendingAtLevels = [
  "Department", "GP Approval", "Collector Approval", "Counter Filing",
  "Compliance", "Hearing Update", "Final Action", "Closed"
];

export const HC_STATUS_URL = "https://hcservices.ecourts.gov.in/ecourtindiaHC/cases/case_no.php?state_cd=29&dist_cd=1&court_code=1&stateNm=Telangana";

export interface Party {
  name: string;
  type: string;
  department?: string;
  remarks?: string;
}

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
  petitioners: Party[];
  respondents: Party[];
  coRespondentParties: Party[];
  department: string;
  mandal: string;
  division: string;
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
  // Approval workflow fields
  counterDraftStatus: string;
  gpApprovalStatus: string;
  collectorApprovalStatus: string;
  counterFilingDueDate: string;
  pendingAtLevel: string;
  interimOrderStatus: string;
  finalJudgmentStatus: string;
  finalActionStatus: string;
}

function getDivision(mandal: string): string {
  if (divisions["Bhongir Division"].includes(mandal)) return "Bhongir Division";
  if (divisions["Choutuppal Division"].includes(mandal)) return "Choutuppal Division";
  return "";
}

function makeCase(
  base: Omit<CaseRecord, "petitioners" | "respondents" | "coRespondentParties" | "division" | "counterDraftStatus" | "gpApprovalStatus" | "collectorApprovalStatus" | "counterFilingDueDate" | "pendingAtLevel" | "interimOrderStatus" | "finalJudgmentStatus" | "finalActionStatus">,
  extra?: Partial<CaseRecord>
): CaseRecord {
  // Auto-generate a counterFilingDueDate for Counter Pending / Hearing Scheduled cases
  let autoCounterDueDate = "";
  if (base.status === "Counter Pending" || base.status === "Hearing Scheduled") {
    // Set counter due 7 days before next hearing if available
    if (base.nextHearing && base.nextHearing !== "-") {
      const nh = new Date(base.nextHearing);
      nh.setDate(nh.getDate() - 7);
      autoCounterDueDate = nh.toISOString().split("T")[0];
    }
  }
  return {
    ...base,
    division: getDivision(base.mandal),
    petitioners: [{ name: base.petitioner, type: "Individual", department: "", remarks: "" }],
    respondents: [{ name: base.respondent, type: "Government", department: base.department, remarks: "" }],
    coRespondentParties: base.coRespondents.map(cr => ({ name: cr, type: "Government", department: "", remarks: "" })),
    counterDraftStatus: base.status === "Counter Pending" ? "Pending" : base.status === "Closed" ? "Filed" : "Not Started",
    gpApprovalStatus: "Not Applicable",
    collectorApprovalStatus: "Not Applicable",
    counterFilingDueDate: autoCounterDueDate,
    pendingAtLevel: base.status === "Counter Pending" ? "Counter Filing" : base.complianceRequired && base.complianceStatus === "Pending" ? "Compliance" : base.status === "Closed" ? "Closed" : "Hearing Update",
    interimOrderStatus: base.orderPassed ? "Received" : "Not Applicable",
    finalJudgmentStatus: base.status === "Closed" ? "Received" : "Pending",
    finalActionStatus: base.status === "Closed" ? "Completed" : "In Progress",
    ...extra,
  };
}

export const cases: CaseRecord[] = [
  makeCase({
    id: "LCMS/YBG/2024/001", caseNumber: "WP 2456/2024", title: "Land Acquisition Challenge - Survey No. 145, Bhongir",
    court: "Telangana High Court", courtType: "High Court", caseType: "Writ Petition",
    petitioner: "Ramesh Kumar Reddy", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Tahsildar, Bhongir", "Revenue Divisional Officer"],
    department: "Revenue Department", mandal: "Bhongir", filingDate: "2024-01-15", filingYear: "2024",
    assignedOfficer: "District Legal Officer", priority: "High", status: "Ongoing",
    lastHearing: "2026-03-28", nextHearing: "2026-04-15",
    advocate: "Adv. P. Venkatesh", advocateContact: "9876543210",
    subject: "Challenge to land acquisition notification under RFCTLARR Act for Survey No. 145, Bhongir Mandal",
    remarks: "Counter affidavit filed. Awaiting next hearing.", tags: ["Land", "Revenue", "Urgent"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Compensation / Acquisition Matter",
    landDisputeFlag: true, orderPassed: true, orderSummary: "Interim stay on acquisition proceedings granted",
    complianceRequired: true, complianceStatus: "Pending", complianceDueDate: "2026-04-30",
    complianceCompletedDate: "", lastUpdated: "2026-04-08"
  }, {
    counterDraftStatus: "Filed", gpApprovalStatus: "Approved", collectorApprovalStatus: "Approved", pendingAtLevel: "Compliance",
    counterFilingDueDate: "2026-04-10",
    petitioners: [
      { name: "Ramesh Kumar Reddy", type: "Individual", department: "", remarks: "Primary petitioner" },
      { name: "Smt. Padmavathi", type: "Individual", department: "", remarks: "Co-owner of Survey No. 145" },
      { name: "K. Narasimha", type: "Individual", department: "", remarks: "Adjacent land owner" },
    ],
  }),
  makeCase({
    id: "LCMS/YBG/2024/002", caseNumber: "OS 118/2023", title: "Service Matter - Suspension of Ministerial Staff",
    court: "District Court, Bhongir", courtType: "District Court", caseType: "Service Matter",
    petitioner: "M. Lakshmi Devi", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["District Personnel Officer"],
    department: "Collectorate Legal Cell", mandal: "Bhongir", filingDate: "2023-08-20", filingYear: "2023",
    assignedOfficer: "Section Officer – Land Matters", priority: "Medium", status: "Hearing Scheduled",
    lastHearing: "2026-03-25", nextHearing: "2026-04-12",
    advocate: "Adv. R. Suresh Babu", advocateContact: "9123456780",
    subject: "Challenge to suspension order of ministerial staff in Collectorate",
    remarks: "Written statement to be filed.", tags: ["Service", "HR"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Service / Administrative Matter",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }, { pendingAtLevel: "Counter Filing", counterDraftStatus: "Draft Ready", gpApprovalStatus: "Pending",
    counterFilingDueDate: "2026-04-15",
  }),
  makeCase({
    id: "LCMS/YBG/2024/003", caseNumber: "CCC 89/2024", title: "Consumer Complaint - Water Supply Irregularity",
    court: "Consumer Forum", courtType: "Consumer Forum", caseType: "Consumer Matter",
    petitioner: "Nagarjuna Welfare Association", respondent: "Municipal Commissioner, Bhongir",
    coRespondents: ["Executive Engineer, HMWSSB"],
    department: "Municipal Administration", mandal: "Bhongir", filingDate: "2024-03-01", filingYear: "2024",
    assignedOfficer: "Department Nodal Officer – Revenue", priority: "Low", status: "Fresh",
    lastHearing: "-", nextHearing: "2026-04-20",
    advocate: "Adv. G. Srinivasa Rao", advocateContact: "9988776655",
    subject: "Complaint regarding irregular water supply in Bhongir Municipality",
    remarks: "Case recently filed. To assign junior officer.", tags: ["Municipal", "Consumer"],
    collectorateInvolvement: "Department Involved", natureOfCase: "Municipal Notice Challenge",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-07"
  }, {
    pendingAtLevel: "Department",
    respondents: [
      { name: "Municipal Commissioner, Bhongir", type: "Government", department: "Municipal Administration", remarks: "" },
      { name: "Executive Engineer, HMWSSB", type: "Government", department: "Irrigation", remarks: "Water supply wing" },
    ],
  }),
  makeCase({
    id: "LCMS/YBG/2024/004", caseNumber: "WP 7892/2023", title: "Encroachment Removal - Govt Land, Choutuppal",
    court: "Telangana High Court", courtType: "High Court", caseType: "Encroachment Matter",
    petitioner: "Telangana State Govt", respondent: "Various Encroachers",
    coRespondents: ["Gram Panchayat, Choutuppal", "Tahsildar, Choutuppal"],
    department: "Revenue Department", mandal: "Choutuppal", filingDate: "2023-11-10", filingYear: "2023",
    assignedOfficer: "District Legal Officer", priority: "High", status: "Counter Pending",
    lastHearing: "2026-02-28", nextHearing: "2026-04-14",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Action against illegal encroachments on government land in Choutuppal",
    remarks: "Counter pending from respondents. Urgent follow-up needed.", tags: ["Revenue", "Encroachment"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Encroachment Removal",
    landDisputeFlag: true, orderPassed: true, orderSummary: "Status quo ordered on encroached land",
    complianceRequired: true, complianceStatus: "Partially Complied", complianceDueDate: "2026-04-15",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }, { counterDraftStatus: "Pending", gpApprovalStatus: "Pending", pendingAtLevel: "GP Approval",
    counterFilingDueDate: "2026-04-12",
    petitioners: [
      { name: "Telangana State Govt", type: "Government", department: "Revenue Department", remarks: "" },
      { name: "District Collector, Yadadri Bhuvanagiri", type: "Government", department: "Collectorate Legal Cell", remarks: "Co-petitioner" },
    ],
    respondents: [
      { name: "Various Encroachers", type: "Individual", department: "", remarks: "Primary respondents" },
      { name: "Gram Panchayat, Choutuppal", type: "Government", department: "Panchayat Raj", remarks: "" },
      { name: "Tahsildar, Choutuppal", type: "Government", department: "Tahsildar Office", remarks: "" },
    ],
  }),
  makeCase({
    id: "LCMS/YBG/2024/005", caseNumber: "TA 456/2023", title: "Tribunal Appeal - PRC Arrears Claim",
    court: "Revenue Tribunal", courtType: "Tribunal", caseType: "Tribunal Matter",
    petitioner: "B. Venkateswarlu & Others", respondent: "State of Telangana",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri", "District Treasury Officer"],
    department: "Collectorate Legal Cell", mandal: "Yadagirigutta", filingDate: "2023-08-15", filingYear: "2023",
    assignedOfficer: "Senior Reviewing Officer", priority: "Medium", status: "Appealed",
    lastHearing: "2026-01-20", nextHearing: "2026-05-10",
    advocate: "Adv. M. Bharath Kumar", advocateContact: "9012345678",
    subject: "PRC arrears claim by Group-D employees of Collectorate",
    remarks: "Appeal filed by petitioners. Review pending.", tags: ["Finance", "PRC"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Service / Administrative Matter",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Tribunal directed payment of arrears in 3 months",
    complianceRequired: true, complianceStatus: "Pending", complianceDueDate: "2026-06-20",
    complianceCompletedDate: "", lastUpdated: "2026-03-28"
  }),
  makeCase({
    id: "LCMS/YBG/2023/006", caseNumber: "WP 2345/2022", title: "RoR Correction - Alair Mandal Patta Records",
    court: "Telangana High Court", courtType: "High Court", caseType: "Revenue Matter",
    petitioner: "Smt. Sarojini Devi", respondent: "Tahsildar, Alair",
    coRespondents: ["Sub-Registrar, Alair"],
    department: "Land Records", mandal: "Alair", filingDate: "2022-06-18", filingYear: "2022",
    assignedOfficer: "Revenue Officer – Collectorate", priority: "Low", status: "Closed",
    lastHearing: "2025-12-15", nextHearing: "-",
    advocate: "Adv. K. Ramakrishna", advocateContact: "9567890123",
    subject: "Correction of Record of Rights in Alair Mandal land records",
    remarks: "Case disposed. Orders complied.", tags: ["Revenue", "Land Records"],
    collectorateInvolvement: "Department Involved", natureOfCase: "Mutation / Revenue Record Issue",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Directed correction of RoR entries within 60 days",
    complianceRequired: true, complianceStatus: "Complied", complianceDueDate: "2026-02-15",
    complianceCompletedDate: "2026-01-28", lastUpdated: "2026-01-28"
  }),
  makeCase({
    id: "LCMS/YBG/2024/007", caseNumber: "CC 102/2024", title: "Illegal Sand Mining - Motakondur River Bed",
    court: "District Court, Bhongir", courtType: "District Court", caseType: "Encroachment Matter",
    petitioner: "State of Telangana", respondent: "K. Mahesh & Others",
    coRespondents: ["Sarpanch, Motakondur GP"],
    department: "Revenue Department", mandal: "Motakondur", filingDate: "2024-03-25", filingYear: "2024",
    assignedOfficer: "District Legal Officer", priority: "High", status: "Fresh",
    lastHearing: "-", nextHearing: "2026-04-28",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Illegal sand mining in Motakondur mandal river bed areas",
    remarks: "FIR registered. Court notice issued.", tags: ["Criminal", "Mining"],
    collectorateInvolvement: "Department Involved", natureOfCase: "Public Land Protection Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }, { pendingAtLevel: "Department" }),
  makeCase({
    id: "LCMS/YBG/2024/008", caseNumber: "LP 45/2024", title: "Boundary Dispute - Patta Land, Bibinagar",
    court: "Civil Court, Bhongir", courtType: "Civil Court", caseType: "Land Dispute",
    petitioner: "G. Suresh Reddy", respondent: "Tahsildar, Bibinagar",
    coRespondents: ["Village Revenue Officer, Bibinagar"],
    department: "Revenue Department", mandal: "Bibinagar", filingDate: "2024-04-01", filingYear: "2024",
    assignedOfficer: "Section Officer – Land Matters", priority: "Medium", status: "Fresh",
    lastHearing: "-", nextHearing: "2026-04-22",
    advocate: "Adv. T. Narasimha", advocateContact: "9345678901",
    subject: "Dispute over patta land boundaries in Bibinagar mandal",
    remarks: "Recently filed. Preliminary hearing pending.", tags: ["Land", "Revenue"],
    collectorateInvolvement: "Monitoring Only", natureOfCase: "Survey Boundary Dispute",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-08"
  }),
  makeCase({
    id: "LCMS/YBG/2024/009", caseNumber: "WP 16789/2024", title: "Writ - Mutation Delay, Addagudur",
    court: "Telangana High Court", courtType: "High Court", caseType: "Writ Petition",
    petitioner: "A. Narayana Swamy", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Tahsildar, Addagudur", "Survey Department"],
    department: "Land Records", mandal: "Addagudur", filingDate: "2024-03-15", filingYear: "2024",
    assignedOfficer: "District Legal Officer", priority: "Court-Critical", status: "Hearing Scheduled",
    lastHearing: "2026-04-02", nextHearing: "2026-04-11",
    advocate: "Adv. S. Rani", advocateContact: "9234567890",
    subject: "Delay in processing mutation application for agricultural land in Addagudur",
    remarks: "HC directed to complete mutation within 4 weeks.", tags: ["Mutation", "Urgent"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Mutation / Revenue Record Issue",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Directed completion of mutation within 4 weeks",
    complianceRequired: true, complianceStatus: "Pending", complianceDueDate: "2026-05-02",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }, { counterDraftStatus: "Filed", gpApprovalStatus: "Approved", collectorApprovalStatus: "Approved", pendingAtLevel: "Compliance" }),
  makeCase({
    id: "LCMS/YBG/2024/010", caseNumber: "OS 567/2024", title: "Compensation Claim - Road Widening, Alair",
    court: "District Court, Bhongir", courtType: "District Court", caseType: "Compensation Matter",
    petitioner: "P. Venkat Reddy & Ors.", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Joint Collector Office", "Revenue Divisional Officer"],
    department: "Roads & Buildings", mandal: "Alair", filingDate: "2024-02-10", filingYear: "2024",
    assignedOfficer: "Revenue Officer – Collectorate", priority: "High", status: "Ongoing",
    lastHearing: "2026-03-20", nextHearing: "2026-04-18",
    advocate: "Adv. K. Ramakrishna", advocateContact: "9567890123",
    subject: "Inadequate compensation for land acquired for NH road widening near Alair",
    remarks: "Govt valuation report submitted. Counter arguments pending.", tags: ["Compensation", "Land"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Compensation / Acquisition Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-06"
  }, { counterDraftStatus: "Draft Ready", gpApprovalStatus: "Pending", pendingAtLevel: "GP Approval",
    counterFilingDueDate: "2026-04-16",
    respondents: [
      { name: "District Collector, Yadadri Bhuvanagiri", type: "Government", department: "Revenue Department", remarks: "" },
      { name: "Joint Collector Office", type: "Government", department: "Collectorate Legal Cell", remarks: "" },
      { name: "Revenue Divisional Officer", type: "Government", department: "Revenue Department", remarks: "" },
    ],
    petitioners: [
      { name: "P. Venkat Reddy", type: "Individual", department: "", remarks: "Primary petitioner" },
      { name: "M. Srinivasa Rao", type: "Individual", department: "", remarks: "Affected farmer" },
    ],
  }),
  makeCase({
    id: "LCMS/YBG/2024/011", caseNumber: "WP 8901/2023", title: "Encroachment on Assigned Land - Yadagirigutta Temple Area",
    court: "Telangana High Court", courtType: "High Court", caseType: "Encroachment Matter",
    petitioner: "B. Sai Kumar", respondent: "Gram Panchayat, Yadagirigutta",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri", "Temple Lands Authority"],
    department: "Revenue Department", mandal: "Yadagirigutta", filingDate: "2023-09-20", filingYear: "2023",
    assignedOfficer: "Section Officer – Land Matters", priority: "Time-Sensitive", status: "Under Review",
    lastHearing: "2026-03-05", nextHearing: "2026-04-25",
    advocate: "Adv. M. Srinivas", advocateContact: "9456789012",
    subject: "Encroachment on assigned land by local body near temple area",
    remarks: "Survey report awaited. Revenue inspection ordered.", tags: ["Encroachment", "Assigned Land"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Encroachment Removal",
    landDisputeFlag: true, orderPassed: true, orderSummary: "Directed revenue survey within 30 days",
    complianceRequired: true, complianceStatus: "Partially Complied", complianceDueDate: "2026-04-05",
    complianceCompletedDate: "", lastUpdated: "2026-04-08"
  }),
  makeCase({
    id: "LCMS/YBG/2024/012", caseNumber: "RA 112/2024", title: "Revenue Appeal - Patta Cancellation, Motakondur",
    court: "Revenue Tribunal", courtType: "Tribunal", caseType: "Revenue Matter",
    petitioner: "L. Ramaiah", respondent: "Tahsildar, Motakondur",
    coRespondents: ["Revenue Divisional Officer"],
    department: "Tahsildar Office", mandal: "Motakondur", filingDate: "2024-01-30", filingYear: "2024",
    assignedOfficer: "Mandal Nodal Officer – Choutuppal", priority: "Medium", status: "Ongoing",
    lastHearing: "2026-03-18", nextHearing: "2026-04-30",
    advocate: "Adv. D. Krishna", advocateContact: "9678901234",
    subject: "Appeal against patta cancellation order by Tahsildar, Motakondur",
    remarks: "Revenue enquiry pending.", tags: ["Revenue", "Patta"],
    collectorateInvolvement: "Monitoring Only", natureOfCase: "Mutation / Revenue Record Issue",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-03-25"
  }),
  makeCase({
    id: "LCMS/YBG/2024/013", caseNumber: "WP 19234/2024", title: "Demolition Stay - Unauthorized Construction, Atmakur(M)",
    court: "Telangana High Court", courtType: "High Court", caseType: "Writ Petition",
    petitioner: "Atmakur Town Residents' Association", respondent: "Municipal Commissioner, Bhongir",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri", "Joint Collector Office"],
    department: "Municipal Administration", mandal: "Atmakur(M)", filingDate: "2024-03-28", filingYear: "2024",
    assignedOfficer: "District Legal Officer", priority: "Court-Critical", status: "Hearing Scheduled",
    lastHearing: "2026-04-03", nextHearing: "2026-04-11",
    advocate: "Adv. N. Srinivas Reddy", advocateContact: "9789012345",
    subject: "Stay petition against demolition of unauthorized constructions in Atmakur municipality",
    remarks: "Interim stay granted. Compliance report due.", tags: ["Municipal", "Demolition", "Stay"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Municipal Notice Challenge",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Interim stay on demolition for 4 weeks",
    complianceRequired: true, complianceStatus: "Complied", complianceDueDate: "2026-04-10",
    complianceCompletedDate: "2026-04-05", lastUpdated: "2026-04-09"
  }),
  makeCase({
    id: "LCMS/YBG/2024/014", caseNumber: "CC 45/2023", title: "Consumer Complaint - Power Disconnection, Choutuppal",
    court: "Consumer Forum", courtType: "Consumer Forum", caseType: "Consumer Matter",
    petitioner: "T. Anjaiah", respondent: "TSSPDCL",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri"],
    department: "Collectorate Legal Cell", mandal: "Choutuppal", filingDate: "2023-10-05", filingYear: "2023",
    assignedOfficer: "Department Nodal Officer – Revenue", priority: "Low", status: "Closed",
    lastHearing: "2026-02-10", nextHearing: "-",
    advocate: "Adv. G. Srinivasa Rao", advocateContact: "9988776655",
    subject: "Wrongful disconnection of electricity supply in Choutuppal",
    remarks: "Matter settled. Reconnection done.", tags: ["Consumer", "Power"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Departmental Action Matter",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Directed reconnection and compensation of Rs.10,000",
    complianceRequired: true, complianceStatus: "Complied", complianceDueDate: "2026-03-10",
    complianceCompletedDate: "2026-02-28", lastUpdated: "2026-02-28"
  }),
  makeCase({
    id: "LCMS/YBG/2024/015", caseNumber: "LP 78/2024", title: "Land Dispute - Private vs Govt, Bommalaramaram",
    court: "Civil Court, Bhongir", courtType: "Civil Court", caseType: "Land Dispute",
    petitioner: "Private Land Owner", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Survey Department", "Tahsildar, Bommalaramaram"],
    department: "Survey & Settlement", mandal: "Bommalaramaram", filingDate: "2024-04-03", filingYear: "2024",
    assignedOfficer: "Section Officer – Land Matters", priority: "High", status: "Fresh",
    lastHearing: "-", nextHearing: "2026-04-25",
    advocate: "Adv. P. Venkatesh", advocateContact: "9876543210",
    subject: "Dispute over government land boundaries overlapping private patta in Bommalaramaram",
    remarks: "Newly filed. Survey report requested.", tags: ["Land", "Survey", "Sensitive"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Land Ownership Dispute",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-08"
  }),
  makeCase({
    id: "LCMS/YBG/2024/016", caseNumber: "WP 4567/2022", title: "Service - Seniority Dispute, Collectorate Staff",
    court: "Telangana High Court", courtType: "High Court", caseType: "Service Matter",
    petitioner: "R. Suresh & Others", respondent: "State of Telangana",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri"],
    department: "Collectorate Legal Cell", mandal: "Bhongir", filingDate: "2022-03-10", filingYear: "2022",
    assignedOfficer: "Senior Reviewing Officer", priority: "Medium", status: "Ongoing",
    lastHearing: "2026-01-15", nextHearing: "2026-05-20",
    advocate: "Adv. M. Bharath Kumar", advocateContact: "9012345678",
    subject: "Seniority fixation dispute among ministerial staff of Collectorate",
    remarks: "Arguments ongoing. Long-pending matter.", tags: ["Service", "Seniority"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Service / Administrative Matter",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-01-15"
  }),
  makeCase({
    id: "LCMS/YBG/2024/017", caseNumber: "OS 890/2024", title: "Compensation - Acquisition for Govt Building, Turkapally",
    court: "Principal District Court, Bhongir", courtType: "District Court", caseType: "Compensation Matter",
    petitioner: "M. Ramesh Goud", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Joint Collector Office", "Revenue Divisional Officer"],
    department: "Revenue Department", mandal: "Turkapally", filingDate: "2024-03-05", filingYear: "2024",
    assignedOfficer: "Revenue Officer – Collectorate", priority: "Time-Sensitive", status: "Ongoing",
    lastHearing: "2026-03-30", nextHearing: "2026-04-16",
    advocate: "Adv. T. Narasimha", advocateContact: "9345678901",
    subject: "Enhanced compensation for land acquired for government building in Turkapally",
    remarks: "Valuation disputed. Expert opinion sought.", tags: ["Compensation", "Acquisition"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Compensation / Acquisition Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-08"
  }),
  makeCase({
    id: "LCMS/YBG/2024/018", caseNumber: "CC 201/2024", title: "Unauthorized Layout - Govt Land, Turkapally",
    court: "District Court, Bhongir", courtType: "District Court", caseType: "Encroachment Matter",
    petitioner: "State of Telangana", respondent: "N. Raju & Others",
    coRespondents: ["Gram Panchayat, Turkapally"],
    department: "Panchayat Raj", mandal: "Turkapally", filingDate: "2026-04-05", filingYear: "2026",
    assignedOfficer: "District Legal Officer", priority: "High", status: "Fresh",
    lastHearing: "-", nextHearing: "2026-05-05",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Unauthorized layout development on government land in Turkapally",
    remarks: "Case registered. Notice issued to accused.", tags: ["Criminal", "Layout", "Unauthorized"],
    collectorateInvolvement: "Department Involved", natureOfCase: "Public Land Protection Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }),
  makeCase({
    id: "LCMS/YBG/2025/019", caseNumber: "REV 87/2025", title: "Revenue Record Dispute - Mutation Appeal, Alair",
    court: "Revenue Tribunal", courtType: "Tribunal", caseType: "Revenue Matter",
    petitioner: "K. Narasimha Rao", respondent: "Tahsildar, Alair",
    coRespondents: ["Revenue Divisional Officer"],
    department: "Tahsildar Office", mandal: "Alair", filingDate: "2025-01-10", filingYear: "2025",
    assignedOfficer: "Mandal Nodal Officer – Bhongir", priority: "Medium", status: "Ongoing",
    lastHearing: "2026-03-15", nextHearing: "2026-04-28",
    advocate: "Adv. D. Krishna", advocateContact: "9678901234",
    subject: "Appeal against rejection of mutation application in Alair mandal",
    remarks: "Revenue hearing pending. Documents submitted.", tags: ["Revenue", "Mutation"],
    collectorateInvolvement: "Monitoring Only", natureOfCase: "Mutation / Revenue Record Issue",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-05"
  }),
  makeCase({
    id: "LCMS/YBG/2025/020", caseNumber: "WP 3456/2025", title: "Land Acquisition Stay - NH Expansion, Choutuppal",
    court: "Telangana High Court", courtType: "High Court", caseType: "Writ Petition",
    petitioner: "Local Resident Welfare Association", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Roads & Buildings Division Officer", "Revenue Divisional Officer"],
    department: "Roads & Buildings", mandal: "Choutuppal", filingDate: "2025-02-20", filingYear: "2025",
    assignedOfficer: "District Legal Officer", priority: "Court-Critical", status: "Hearing Scheduled",
    lastHearing: "2026-04-01", nextHearing: "2026-04-14",
    advocate: "Adv. S. Rani", advocateContact: "9234567890",
    subject: "Stay on land acquisition for national highway expansion near Choutuppal",
    remarks: "Stay petition heard. Counter due.", tags: ["Land", "Highway", "Stay"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Compensation / Acquisition Matter",
    landDisputeFlag: true, orderPassed: true, orderSummary: "Interim stay granted pending hearing",
    complianceRequired: true, complianceStatus: "Pending", complianceDueDate: "2026-04-30",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }, { counterDraftStatus: "Draft Ready", gpApprovalStatus: "Pending", pendingAtLevel: "GP Approval" }),
  makeCase({
    id: "LCMS/YBG/2025/021", caseNumber: "CS 234/2025", title: "Civil Suit - Property Dispute, Bibinagar",
    court: "Civil Court, Bhongir", courtType: "Civil Court", caseType: "Civil Suit",
    petitioner: "D. Srinivas", respondent: "Private Land Owner",
    coRespondents: ["Tahsildar, Bibinagar"],
    department: "Land Records", mandal: "Bibinagar", filingDate: "2025-03-12", filingYear: "2025",
    assignedOfficer: "Section Officer – Land Matters", priority: "Medium", status: "Fresh",
    lastHearing: "-", nextHearing: "2026-04-20",
    advocate: "Adv. R. Suresh Babu", advocateContact: "9123456780",
    subject: "Civil suit regarding disputed property ownership in Bibinagar town",
    remarks: "Summons issued. Awaiting response.", tags: ["Civil", "Property"],
    collectorateInvolvement: "Monitoring Only", natureOfCase: "Land Ownership Dispute",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-07"
  }),
  makeCase({
    id: "LCMS/YBG/2025/022", caseNumber: "WP 5678/2025", title: "Survey Boundary Dispute - Govt vs Private, Yadagirigutta",
    court: "Telangana High Court", courtType: "High Court", caseType: "Land Dispute",
    petitioner: "Temple Lands Authority", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Survey Department", "Tahsildar, Yadagirigutta"],
    department: "Survey & Settlement", mandal: "Yadagirigutta", filingDate: "2025-01-25", filingYear: "2025",
    assignedOfficer: "High Court Representative Officer", priority: "High", status: "Ongoing",
    lastHearing: "2026-03-22", nextHearing: "2026-04-19",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Survey boundary dispute between temple lands and government land near Yadagirigutta",
    remarks: "Survey ordered by HC. Report pending.", tags: ["Survey", "Temple Land", "Sensitive"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Survey Boundary Dispute",
    landDisputeFlag: true, orderPassed: true, orderSummary: "Joint survey ordered within 45 days",
    complianceRequired: true, complianceStatus: "Partially Complied", complianceDueDate: "2026-05-06",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }),
  makeCase({
    id: "LCMS/YBG/2025/023", caseNumber: "OS 345/2025", title: "Irrigation Canal Land Dispute - Addagudur",
    court: "Principal District Court, Bhongir", courtType: "District Court", caseType: "Land Dispute",
    petitioner: "P. Yellaiah & Others", respondent: "Irrigation Department",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri"],
    department: "Irrigation", mandal: "Addagudur", filingDate: "2025-02-05", filingYear: "2025",
    assignedOfficer: "Revenue Officer – Collectorate", priority: "Medium", status: "Hearing Scheduled",
    lastHearing: "2026-03-10", nextHearing: "2026-04-17",
    advocate: "Adv. T. Narasimha", advocateContact: "9345678901",
    subject: "Land encroached by irrigation canal expansion in Addagudur",
    remarks: "Joint inspection ordered.", tags: ["Irrigation", "Land"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Compensation / Acquisition Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-05"
  }),
  makeCase({
    id: "LCMS/YBG/2025/024", caseNumber: "CMP 12/2025", title: "Compliance Matter - School Building Order, Bommalaramaram",
    court: "District Court, Bhongir", courtType: "District Court", caseType: "Compliance Matter",
    petitioner: "Parents Association, Bommalaramaram", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["District Education Officer"],
    department: "Education Department", mandal: "Bommalaramaram", filingDate: "2025-03-18", filingYear: "2025",
    assignedOfficer: "Department Nodal Officer – Revenue", priority: "Time-Sensitive", status: "Ongoing",
    lastHearing: "2026-04-01", nextHearing: "2026-04-22",
    advocate: "Adv. G. Srinivasa Rao", advocateContact: "9988776655",
    subject: "Non-compliance of court order regarding school building repairs in Bommalaramaram",
    remarks: "Compliance report submitted. Partial compliance noted.", tags: ["Education", "Compliance"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Court Direction Compliance",
    landDisputeFlag: false, orderPassed: true, orderSummary: "Directed repair of school building within 3 months",
    complianceRequired: true, complianceStatus: "Partially Complied", complianceDueDate: "2026-06-18",
    complianceCompletedDate: "", lastUpdated: "2026-04-08"
  }),
  makeCase({
    id: "LCMS/YBG/2025/025", caseNumber: "WP 6789/2025", title: "Panchayat Land Encroachment - Gram Panchayat vs Private",
    court: "Telangana High Court", courtType: "High Court", caseType: "Encroachment Matter",
    petitioner: "Gram Panchayat, Bibinagar", respondent: "Private Land Owner",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri", "Tahsildar, Bibinagar"],
    department: "Panchayat Raj", mandal: "Bibinagar", filingDate: "2025-04-02", filingYear: "2025",
    assignedOfficer: "District Legal Officer", priority: "High", status: "Fresh",
    lastHearing: "-", nextHearing: "2026-04-29",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Encroachment on Panchayat land by private individual in Bibinagar",
    remarks: "Newly filed. Demarcation survey needed.", tags: ["Panchayat", "Encroachment"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Public Land Protection Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }),
  makeCase({
    id: "LCMS/YBG/2025/026", caseNumber: "RA 56/2025", title: "Revenue Appeal - Inam Land Classification, Atmakur(M)",
    court: "Revenue Tribunal", courtType: "Tribunal", caseType: "Revenue Matter",
    petitioner: "V. Chandrasekhar", respondent: "Tahsildar, Atmakur(M)",
    coRespondents: [],
    department: "Tahsildar Office", mandal: "Atmakur(M)", filingDate: "2025-01-20", filingYear: "2025",
    assignedOfficer: "Mandal Nodal Officer – Bhongir", priority: "Low", status: "Ongoing",
    lastHearing: "2026-03-05", nextHearing: "2026-05-15",
    advocate: "Adv. K. Ramakrishna", advocateContact: "9567890123",
    subject: "Appeal against Inam land classification by Tahsildar office",
    remarks: "Arguments stage. Documents verified.", tags: ["Revenue", "Inam"],
    collectorateInvolvement: "Monitoring Only", natureOfCase: "Mutation / Revenue Record Issue",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-03-10"
  }),
  makeCase({
    id: "LCMS/YBG/2025/027", caseNumber: "CCC 34/2025", title: "Consumer Complaint - Building Permit Delay, Bhongir",
    court: "Consumer Forum", courtType: "Consumer Forum", caseType: "Consumer Matter",
    petitioner: "S. Ravi Kumar", respondent: "Municipal Commissioner, Bhongir",
    coRespondents: [],
    department: "Municipal Administration", mandal: "Bhongir", filingDate: "2025-02-15", filingYear: "2025",
    assignedOfficer: "Department Nodal Officer – Revenue", priority: "Low", status: "Ongoing",
    lastHearing: "2026-03-28", nextHearing: "2026-05-02",
    advocate: "Adv. G. Srinivasa Rao", advocateContact: "9988776655",
    subject: "Delay in issuing building permit by Bhongir Municipality",
    remarks: "Hearing completed. Order awaited.", tags: ["Municipal", "Consumer"],
    collectorateInvolvement: "Department Involved", natureOfCase: "Municipal Notice Challenge",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-04"
  }),
  makeCase({
    id: "LCMS/YBG/2025/028", caseNumber: "WP 7890/2025", title: "Writ - Compensation for Temple Land Acquisition",
    court: "Telangana High Court", courtType: "High Court", caseType: "Compensation Matter",
    petitioner: "Temple Trust Committee", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Temple Lands Authority", "Revenue Divisional Officer"],
    department: "Revenue Department", mandal: "Yadagirigutta", filingDate: "2025-03-28", filingYear: "2025",
    assignedOfficer: "High Court Representative Officer", priority: "Court-Critical", status: "Hearing Scheduled",
    lastHearing: "2026-04-05", nextHearing: "2026-04-13",
    advocate: "Adv. P. Venkatesh", advocateContact: "9876543210",
    subject: "Challenge to compensation amount for temple land acquired for Yadagirigutta development",
    remarks: "HC bench hearing. Sensitive matter requiring Collector review.", tags: ["Temple", "Compensation", "Sensitive"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Compensation / Acquisition Matter",
    landDisputeFlag: true, orderPassed: true, orderSummary: "Notice issued to respondent. Counter due in 2 weeks.",
    complianceRequired: true, complianceStatus: "Pending", complianceDueDate: "2026-04-27",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }, { counterDraftStatus: "Draft Ready", gpApprovalStatus: "Pending", pendingAtLevel: "GP Approval", counterFilingDueDate: "2026-04-27" }),
  makeCase({
    id: "LCMS/YBG/2025/029", caseNumber: "OS 456/2025", title: "Service Matter - Departmental Inquiry, Revenue Staff",
    court: "Principal District Court, Bhongir", courtType: "District Court", caseType: "Service Matter",
    petitioner: "J. Srikanth", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: [],
    department: "Revenue Department", mandal: "Bhongir", filingDate: "2025-04-01", filingYear: "2025",
    assignedOfficer: "Senior Reviewing Officer", priority: "Medium", status: "Fresh",
    lastHearing: "-", nextHearing: "2026-04-24",
    advocate: "Adv. M. Bharath Kumar", advocateContact: "9012345678",
    subject: "Challenge to departmental inquiry proceedings against revenue staff",
    remarks: "Recently filed. Notice issued.", tags: ["Service", "Inquiry"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Service / Administrative Matter",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-07"
  }),
  makeCase({
    id: "LCMS/YBG/2025/030", caseNumber: "WP 8901/2025", title: "Public Land Protection - Lake Boundary, Addagudur",
    court: "Telangana High Court", courtType: "High Court", caseType: "Encroachment Matter",
    petitioner: "Environmental Action Committee", respondent: "Various Encroachers",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri", "Gram Panchayat, Addagudur"],
    department: "Revenue Department", mandal: "Addagudur", filingDate: "2025-03-10", filingYear: "2025",
    assignedOfficer: "District Legal Officer", priority: "High", status: "Hearing Scheduled",
    lastHearing: "2026-04-03", nextHearing: "2026-04-16",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Protection of public lake boundaries from encroachment in Addagudur mandal",
    remarks: "HC directed demarcation. Revenue survey pending.", tags: ["Environment", "Lake", "Encroachment"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Public Land Protection Matter",
    landDisputeFlag: true, orderPassed: true, orderSummary: "Directed demarcation and removal within 60 days",
    complianceRequired: true, complianceStatus: "Partially Complied", complianceDueDate: "2026-05-15",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }),
  // New cases for new mandals
  makeCase({
    id: "LCMS/YBG/2025/031", caseNumber: "WP 9012/2025", title: "Land Grabbing - Govt Land, Mothkur",
    court: "Telangana High Court", courtType: "High Court", caseType: "Encroachment Matter",
    petitioner: "State of Telangana", respondent: "Private Developers",
    coRespondents: ["Tahsildar, Mothkur", "District Collector, Yadadri Bhuvanagiri"],
    department: "Revenue Department", mandal: "Mothkur", filingDate: "2025-03-20", filingYear: "2025",
    assignedOfficer: "District Legal Officer", priority: "High", status: "Ongoing",
    lastHearing: "2026-04-05", nextHearing: "2026-04-22",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Action against land grabbing of government land in Mothkur mandal",
    remarks: "Survey completed. Eviction order pending.", tags: ["Land Grabbing", "Encroachment"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Public Land Protection Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }),
  makeCase({
    id: "LCMS/YBG/2025/032", caseNumber: "RA 78/2025", title: "Revenue Appeal - Patta Issue, Rajapet",
    court: "Revenue Tribunal", courtType: "Tribunal", caseType: "Revenue Matter",
    petitioner: "M. Venkatesh", respondent: "Tahsildar, Rajapet",
    coRespondents: [],
    department: "Tahsildar Office", mandal: "Rajapet", filingDate: "2025-02-10", filingYear: "2025",
    assignedOfficer: "Mandal Nodal Officer – Choutuppal", priority: "Medium", status: "Ongoing",
    lastHearing: "2026-03-20", nextHearing: "2026-05-05",
    advocate: "Adv. D. Krishna", advocateContact: "9678901234",
    subject: "Appeal against rejection of patta application by Tahsildar, Rajapet",
    remarks: "Revenue hearing pending.", tags: ["Revenue", "Patta"],
    collectorateInvolvement: "Monitoring Only", natureOfCase: "Mutation / Revenue Record Issue",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-03"
  }),
  makeCase({
    id: "LCMS/YBG/2025/033", caseNumber: "CS 567/2025", title: "Property Dispute - Bhoodan Pochampally",
    court: "Civil Court, Bhongir", courtType: "Civil Court", caseType: "Civil Suit",
    petitioner: "Village Committee, Pochampally", respondent: "Private Land Owner",
    coRespondents: ["Tahsildar, Bhoodan Pochampally"],
    department: "Land Records", mandal: "Bhoodan Pochampally", filingDate: "2025-01-15", filingYear: "2025",
    assignedOfficer: "Section Officer – Land Matters", priority: "Medium", status: "Hearing Scheduled",
    lastHearing: "2026-03-15", nextHearing: "2026-04-25",
    advocate: "Adv. R. Suresh Babu", advocateContact: "9123456780",
    subject: "Bhoodan land dispute in Pochampally involving village committee",
    remarks: "Historical Bhoodan records being verified.", tags: ["Bhoodan", "Land"],
    collectorateInvolvement: "Monitoring Only", natureOfCase: "Land Ownership Dispute",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-05"
  }),
  makeCase({
    id: "LCMS/YBG/2025/034", caseNumber: "WP 1234/2025", title: "Land Acquisition - Road Project, Ramannapet",
    court: "Telangana High Court", courtType: "High Court", caseType: "Compensation Matter",
    petitioner: "Farmers Association, Ramannapet", respondent: "District Collector, Yadadri Bhuvanagiri",
    coRespondents: ["Revenue Divisional Officer", "Roads & Buildings Department"],
    department: "Roads & Buildings", mandal: "Ramannapet", filingDate: "2025-03-05", filingYear: "2025",
    assignedOfficer: "District Legal Officer", priority: "High", status: "Hearing Scheduled",
    lastHearing: "2026-04-02", nextHearing: "2026-04-18",
    advocate: "Adv. P. Venkatesh", advocateContact: "9876543210",
    subject: "Challenge to compensation for land acquired for state road project in Ramannapet",
    remarks: "Counter affidavit being prepared.", tags: ["Compensation", "Road", "Acquisition"],
    collectorateInvolvement: "Collectorate as Respondent", natureOfCase: "Compensation / Acquisition Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }, { counterDraftStatus: "Draft Ready", gpApprovalStatus: "Pending", pendingAtLevel: "GP Approval", counterFilingDueDate: "2026-04-25" }),
  makeCase({
    id: "LCMS/YBG/2025/035", caseNumber: "CC 89/2025", title: "Encroachment - Government Tank, Valigonda",
    court: "District Court, Bhongir", courtType: "District Court", caseType: "Encroachment Matter",
    petitioner: "State of Telangana", respondent: "K. Ranga Rao & Others",
    coRespondents: ["Gram Panchayat, Valigonda"],
    department: "Revenue Department", mandal: "Valigonda", filingDate: "2025-04-01", filingYear: "2025",
    assignedOfficer: "District Legal Officer", priority: "High", status: "Fresh",
    lastHearing: "-", nextHearing: "2026-05-10",
    advocate: "Govt. Pleader", advocateContact: "9876501234",
    subject: "Encroachment on government tank land in Valigonda mandal",
    remarks: "FIR registered. Survey pending.", tags: ["Encroachment", "Tank Land"],
    collectorateInvolvement: "Department Involved", natureOfCase: "Public Land Protection Matter",
    landDisputeFlag: true, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-09"
  }),
  makeCase({
    id: "LCMS/YBG/2025/036", caseNumber: "WP 2345/2025", title: "Panchayat Road Dispute - Samsthan Narayanapur",
    court: "Telangana High Court", courtType: "High Court", caseType: "Writ Petition",
    petitioner: "Local Residents Committee", respondent: "Gram Panchayat, Samsthan Narayanapur",
    coRespondents: ["District Collector, Yadadri Bhuvanagiri"],
    department: "Panchayat Raj", mandal: "Samsthan Narayanapur", filingDate: "2025-02-25", filingYear: "2025",
    assignedOfficer: "Section Officer – Land Matters", priority: "Medium", status: "Ongoing",
    lastHearing: "2026-03-25", nextHearing: "2026-04-28",
    advocate: "Adv. M. Srinivas", advocateContact: "9456789012",
    subject: "Dispute regarding panchayat road encroachment in Samsthan Narayanapur",
    remarks: "Site inspection report submitted.", tags: ["Panchayat", "Road"],
    collectorateInvolvement: "Collectorate as Co-Respondent", natureOfCase: "Encroachment Removal",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-05"
  }),
  makeCase({
    id: "LCMS/YBG/2025/037", caseNumber: "RA 90/2025", title: "Revenue Record Correction - Gundala",
    court: "Revenue Tribunal", courtType: "Tribunal", caseType: "Revenue Matter",
    petitioner: "S. Mallesh", respondent: "Tahsildar, Gundala",
    coRespondents: [],
    department: "Tahsildar Office", mandal: "Gundala", filingDate: "2025-03-15", filingYear: "2025",
    assignedOfficer: "Mandal Nodal Officer – Choutuppal", priority: "Low", status: "Ongoing",
    lastHearing: "2026-03-28", nextHearing: "2026-05-12",
    advocate: "Adv. K. Ramakrishna", advocateContact: "9567890123",
    subject: "Appeal for correction of revenue records in Gundala mandal",
    remarks: "Documents submitted. Hearing pending.", tags: ["Revenue", "Records"],
    collectorateInvolvement: "Monitoring Only", natureOfCase: "Mutation / Revenue Record Issue",
    landDisputeFlag: false, orderPassed: false, orderSummary: "",
    complianceRequired: false, complianceStatus: "Not Applicable", complianceDueDate: "",
    complianceCompletedDate: "", lastUpdated: "2026-04-02"
  }),
];

export const appeals = [
  { id: "APL/YBG/2024/001", parentCaseId: "LCMS/YBG/2024/001", appealNumber: "WA 234/2024", court: "Division Bench, HC Telangana", filingDate: "2024-03-20", grounds: "Error in single bench order regarding land valuation methodology", stage: "Admission", assignedOfficer: "District Legal Officer", nextHearing: "2026-04-25", outcome: "Pending", remarks: "Writ appeal admitted. Stay granted.", attachments: 2 },
  { id: "APL/YBG/2024/002", parentCaseId: "LCMS/YBG/2024/005", appealNumber: "RA 78/2024", court: "Principal Bench, TAT", filingDate: "2024-02-10", grounds: "Review of arrears computation by single member bench", stage: "Arguments", assignedOfficer: "Senior Reviewing Officer", nextHearing: "2026-05-15", outcome: "Pending", remarks: "Arguments stage. Govt side to present.", attachments: 1 },
  { id: "APL/YBG/2025/003", parentCaseId: "LCMS/YBG/2024/004", appealNumber: "WA 56/2025", court: "Division Bench, HC Telangana", filingDate: "2025-01-15", grounds: "Challenge to status quo order on encroached land", stage: "Hearing", assignedOfficer: "District Legal Officer", nextHearing: "2026-04-20", outcome: "Pending", remarks: "Division bench hearing scheduled.", attachments: 3 },
  { id: "APL/YBG/2025/004", parentCaseId: "LCMS/YBG/2024/011", appealNumber: "RA 112/2025", court: "Revenue Appellate Tribunal", filingDate: "2025-02-28", grounds: "Inadequacy of survey conducted by revenue authorities", stage: "Evidence", assignedOfficer: "High Court Representative Officer", nextHearing: "2026-05-08", outcome: "Pending", remarks: "Evidence submission stage.", attachments: 2 },
];

export const hearings = [
  { id: "HRG/001", caseId: "LCMS/YBG/2024/001", caseTitle: "Land Acquisition - Survey No. 145", court: "Telangana High Court", date: "2026-04-15", time: "10:30 AM", type: "Regular Hearing", officer: "District Legal Officer", status: "Scheduled", outcome: "", remarks: "Counter affidavit to be presented", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/002", caseId: "LCMS/YBG/2024/002", caseTitle: "Service Matter - Suspension", court: "District Court, Bhongir", date: "2026-04-12", time: "11:00 AM", type: "Arguments", officer: "Section Officer – Land Matters", status: "Scheduled", outcome: "", remarks: "Written statement deadline", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/003", caseId: "LCMS/YBG/2024/004", caseTitle: "Encroachment Removal - Choutuppal", court: "Telangana High Court", date: "2026-04-14", time: "2:00 PM", type: "Counter Filing", officer: "District Legal Officer", status: "Scheduled", outcome: "", remarks: "Counter expected from respondents", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/004", caseId: "LCMS/YBG/2024/003", caseTitle: "Consumer Complaint - Water", court: "Consumer Forum", date: "2026-04-20", time: "11:30 AM", type: "First Hearing", officer: "Department Nodal Officer – Revenue", status: "Scheduled", outcome: "", remarks: "First appearance", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/005", caseId: "LCMS/YBG/2024/001", caseTitle: "Land Acquisition - Survey No. 145", court: "Telangana High Court", date: "2026-03-28", time: "10:30 AM", type: "Regular Hearing", officer: "District Legal Officer", status: "Completed", outcome: "Adjourned", remarks: "Matter adjourned to 15-Apr. Counter filed.", orderPassed: true, orderSummary: "Interim stay on acquisition proceedings", complianceRequired: true, complianceStatus: "Pending" },
  { id: "HRG/006", caseId: "LCMS/YBG/2024/002", caseTitle: "Service Matter - Suspension", court: "District Court, Bhongir", date: "2026-03-25", time: "11:00 AM", type: "Arguments", officer: "Section Officer – Land Matters", status: "Completed", outcome: "Part-heard", remarks: "Arguments partly heard. Adjourned.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/007", caseId: "LCMS/YBG/2024/007", caseTitle: "Sand Mining - Motakondur", court: "District Court, Bhongir", date: "2026-04-28", time: "10:00 AM", type: "First Hearing", officer: "District Legal Officer", status: "Scheduled", outcome: "", remarks: "First appearance. Notice served.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/008", caseId: "LCMS/YBG/2024/009", caseTitle: "Writ - Mutation Delay, Addagudur", court: "Telangana High Court", date: "2026-04-11", time: "10:00 AM", type: "Regular Hearing", officer: "District Legal Officer", status: "Scheduled", outcome: "", remarks: "Compliance report due.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/009", caseId: "LCMS/YBG/2024/013", caseTitle: "Demolition Stay - Atmakur(M)", court: "Telangana High Court", date: "2026-04-11", time: "2:30 PM", type: "Regular Hearing", officer: "District Legal Officer", status: "Scheduled", outcome: "", remarks: "Compliance status to be submitted.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/010", caseId: "LCMS/YBG/2024/011", caseTitle: "Encroachment - Yadagirigutta", court: "Telangana High Court", date: "2026-03-05", time: "11:00 AM", type: "Regular Hearing", officer: "Section Officer – Land Matters", status: "Completed", outcome: "Directions issued", remarks: "Directed revenue survey within 30 days.", orderPassed: true, orderSummary: "Revenue survey directed within 30 days", complianceRequired: true, complianceStatus: "Partially Complied" },
  { id: "HRG/011", caseId: "LCMS/YBG/2025/020", caseTitle: "NH Expansion Stay - Choutuppal", court: "Telangana High Court", date: "2026-04-14", time: "11:00 AM", type: "Regular Hearing", officer: "District Legal Officer", status: "Scheduled", outcome: "", remarks: "Counter affidavit due.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/012", caseId: "LCMS/YBG/2025/022", caseTitle: "Survey Boundary - Yadagirigutta", court: "Telangana High Court", date: "2026-04-19", time: "10:30 AM", type: "Regular Hearing", officer: "High Court Representative Officer", status: "Scheduled", outcome: "", remarks: "Survey report to be presented.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/013", caseId: "LCMS/YBG/2025/023", caseTitle: "Irrigation Canal Dispute - Addagudur", court: "Principal District Court, Bhongir", date: "2026-04-17", time: "11:00 AM", type: "Arguments", officer: "Revenue Officer – Collectorate", status: "Scheduled", outcome: "", remarks: "Joint inspection report to be filed.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/014", caseId: "LCMS/YBG/2025/028", caseTitle: "Temple Land Compensation - Yadagirigutta", court: "Telangana High Court", date: "2026-04-13", time: "2:00 PM", type: "Regular Hearing", officer: "High Court Representative Officer", status: "Scheduled", outcome: "", remarks: "Counter to be filed urgently.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/015", caseId: "LCMS/YBG/2025/030", caseTitle: "Lake Boundary Protection - Addagudur", court: "Telangana High Court", date: "2026-04-16", time: "10:00 AM", type: "Regular Hearing", officer: "District Legal Officer", status: "Scheduled", outcome: "", remarks: "Demarcation progress report due.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
  { id: "HRG/016", caseId: "LCMS/YBG/2024/010", caseTitle: "Compensation - Road Widening, Alair", court: "District Court, Bhongir", date: "2026-04-18", time: "10:30 AM", type: "Arguments", officer: "Revenue Officer – Collectorate", status: "Scheduled", outcome: "", remarks: "Valuation arguments.", orderPassed: false, orderSummary: "", complianceRequired: false, complianceStatus: "Not Applicable" },
];

export const alerts = [
  { id: "ALT/001", type: "Hearing Reminder", message: "Hearing in WP 2456/2024 due in 3 days", caseId: "LCMS/YBG/2024/001", officer: "District Legal Officer", date: "2026-04-12", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/002", type: "Hearing Reminder", message: "Hearing in OS 118/2023 due tomorrow", caseId: "LCMS/YBG/2024/002", officer: "Section Officer – Land Matters", date: "2026-04-11", priority: "Urgent", status: "Sent", channel: "SMS" },
  { id: "ALT/003", type: "Overdue Update", message: "Status update overdue for WP 7892/2023 - Encroachment", caseId: "LCMS/YBG/2024/004", officer: "District Legal Officer", date: "2026-04-08", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/004", type: "Appeal Deadline", message: "Appeal deadline approaching for TA 456/2023", caseId: "LCMS/YBG/2024/005", officer: "Senior Reviewing Officer", date: "2026-04-10", priority: "Medium", status: "Sent", channel: "Email" },
  { id: "ALT/005", type: "Escalation", message: "Case LCMS/YBG/2024/004 pending beyond 30 days without update", caseId: "LCMS/YBG/2024/004", officer: "District Legal Officer", date: "2026-04-09", priority: "Urgent", status: "Failed", channel: "SMS" },
  { id: "ALT/006", type: "Compliance Due", message: "Compliance due this week for WP 16789/2024 - Mutation", caseId: "LCMS/YBG/2024/009", officer: "District Legal Officer", date: "2026-04-09", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/007", type: "Order Compliance", message: "Order compliance pending for encroachment case - Yadagirigutta", caseId: "LCMS/YBG/2024/011", officer: "Section Officer – Land Matters", date: "2026-04-08", priority: "Urgent", status: "Pending", channel: "SMS" },
  { id: "ALT/008", type: "Land Dispute", message: "High-priority land dispute pending in Bommalaramaram", caseId: "LCMS/YBG/2024/015", officer: "Section Officer – Land Matters", date: "2026-04-08", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/009", type: "Hearing Reminder", message: "Hearing tomorrow - WP 16789/2024 Mutation Delay", caseId: "LCMS/YBG/2024/009", officer: "District Legal Officer", date: "2026-04-10", priority: "Urgent", status: "Sent", channel: "SMS" },
  { id: "ALT/010", type: "Compliance Due", message: "Temple land survey compliance due - Yadagirigutta", caseId: "LCMS/YBG/2025/022", officer: "High Court Representative Officer", date: "2026-04-09", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/011", type: "Hearing Reminder", message: "HC hearing for NH expansion stay - Choutuppal on 14-Apr", caseId: "LCMS/YBG/2025/020", officer: "District Legal Officer", date: "2026-04-12", priority: "Urgent", status: "Pending", channel: "SMS" },
  { id: "ALT/012", type: "Order Compliance", message: "School building compliance partially done - Bommalaramaram", caseId: "LCMS/YBG/2025/024", officer: "Department Nodal Officer – Revenue", date: "2026-04-08", priority: "Medium", status: "Sent", channel: "Email" },
  { id: "ALT/013", type: "Land Dispute", message: "Lake boundary encroachment matter urgent - Addagudur", caseId: "LCMS/YBG/2025/030", officer: "District Legal Officer", date: "2026-04-09", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/014", type: "Hearing Reminder", message: "Temple land compensation hearing on 13-Apr at HC", caseId: "LCMS/YBG/2025/028", officer: "High Court Representative Officer", date: "2026-04-11", priority: "Urgent", status: "Pending", channel: "SMS" },
  { id: "ALT/015", type: "GP Approval Pending", message: "GP approval pending for counter in WP 3456/2025 - NH Expansion", caseId: "LCMS/YBG/2025/020", officer: "District Legal Officer", date: "2026-04-10", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/016", type: "Counter Due", message: "Counter filing due date approaching for WP 7890/2025 - Temple Land", caseId: "LCMS/YBG/2025/028", officer: "High Court Representative Officer", date: "2026-04-12", priority: "Urgent", status: "Pending", channel: "SMS" },
  { id: "ALT/017", type: "Collector Approval Pending", message: "Collector approval required for land acquisition counter", caseId: "LCMS/YBG/2025/034", officer: "District Legal Officer", date: "2026-04-11", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/018", type: "No Update", message: "No update in 7+ days for seniority dispute case", caseId: "LCMS/YBG/2024/016", officer: "Senior Reviewing Officer", date: "2026-04-09", priority: "Medium", status: "Pending", channel: "Email" },
];

export const users = [
  { id: "USR/001", name: "Sri. Anuraag Jayanti, IAS", email: "collector@ybg.telangana.gov.in", role: "District Collector", department: "General Administration", mandal: "All", status: "Active", lastLogin: "2026-04-10 09:15" },
  { id: "USR/002", name: "K. Srinivas Rao", email: "legal.officer@ybg.telangana.gov.in", role: "District Legal Officer", department: "Collectorate Legal Cell", mandal: "All", status: "Active", lastLogin: "2026-04-10 10:30" },
  { id: "USR/003", name: "S. Padma Kumari", email: "sro@ybg.telangana.gov.in", role: "Senior Reviewing Officer", department: "Collectorate Legal Cell", mandal: "All", status: "Active", lastLogin: "2026-04-09 16:45" },
  { id: "USR/004", name: "D. Rajender", email: "section.officer@ybg.telangana.gov.in", role: "Section Officer – Land Matters", department: "Revenue Department", mandal: "All", status: "Active", lastLogin: "2026-04-10 08:00" },
  { id: "USR/005", name: "P. Nagesh", email: "hc.rep@ybg.telangana.gov.in", role: "High Court Representative Officer", department: "Collectorate Legal Cell", mandal: "All", status: "Active", lastLogin: "2026-04-10 08:45" },
  { id: "USR/006", name: "V. Ramesh", email: "revenue.officer@ybg.telangana.gov.in", role: "Revenue Officer – Collectorate", department: "Revenue Department", mandal: "All", status: "Active", lastLogin: "2026-04-09 14:00" },
  { id: "USR/007", name: "M. Priya", email: "deo@ybg.telangana.gov.in", role: "Data Entry Operator – Legal Cell", department: "Collectorate Legal Cell", mandal: "Bhongir", status: "Active", lastLogin: "2026-04-10 09:45" },
  { id: "USR/008", name: "Admin User", email: "admin@ybg.telangana.gov.in", role: "Admin", department: "IT", mandal: "All", status: "Active", lastLogin: "2026-04-10 07:30" },
  { id: "USR/009", name: "R. Venkat Reddy", email: "viewer@ybg.telangana.gov.in", role: "Read-Only Viewer", department: "Planning", mandal: "All", status: "Inactive", lastLogin: "2026-03-28 14:00" },
  { id: "USR/010", name: "B. Suresh", email: "mandal.bhongir@ybg.telangana.gov.in", role: "Mandal Nodal Officer – Bhongir", department: "Tahsildar Office", mandal: "Bhongir", status: "Active", lastLogin: "2026-04-09 11:00" },
  { id: "USR/011", name: "V. Sridhar", email: "mandal.choutuppal@ybg.telangana.gov.in", role: "Mandal Nodal Officer – Choutuppal", department: "Tahsildar Office", mandal: "Choutuppal", status: "Active", lastLogin: "2026-04-08 11:00" },
  { id: "USR/012", name: "N. Lakshmi", email: "dept.revenue@ybg.telangana.gov.in", role: "Department Nodal Officer – Revenue", department: "Revenue Department", mandal: "All", status: "Active", lastLogin: "2026-04-10 09:00" },
];

export const auditLogs = [
  { id: 1, timestamp: "2026-04-10 10:32:15", user: "K. Srinivas Rao", role: "District Legal Officer", action: "Updated", module: "Cases", object: "Case WP 2456/2024", details: "Updated hearing outcome and next hearing date" },
  { id: 2, timestamp: "2026-04-10 09:45:00", user: "M. Priya", role: "Data Entry Operator", action: "Created", module: "Cases", object: "Case WP 8901/2025", details: "New case registered - Lake Boundary Protection" },
  { id: 3, timestamp: "2026-04-09 16:20:00", user: "P. Nagesh", role: "HC Representative Officer", action: "Updated", module: "Hearings", object: "Hearing HRG/014", details: "Updated hearing details for temple land compensation" },
  { id: 4, timestamp: "2026-04-09 15:00:00", user: "S. Padma Kumari", role: "Senior Reviewing Officer", action: "Uploaded", module: "Documents", object: "Counter Affidavit", details: "Uploaded counter affidavit for WP 2456/2024" },
  { id: 5, timestamp: "2026-04-09 11:30:00", user: "K. Srinivas Rao", role: "District Legal Officer", action: "Updated", module: "Compliance", object: "Case WP 19234/2024", details: "Marked compliance as Complied for demolition stay" },
  { id: 6, timestamp: "2026-04-08 14:15:00", user: "D. Rajender", role: "Section Officer", action: "Created", module: "Alerts", object: "Alert ALT/007", details: "Generated compliance alert for Yadagirigutta encroachment" },
  { id: 7, timestamp: "2026-04-08 10:00:00", user: "Admin User", role: "Admin", action: "Modified", module: "Users", object: "User USR/009", details: "Deactivated user R. Venkat Reddy" },
  { id: 8, timestamp: "2026-04-07 15:30:00", user: "S. Padma Kumari", role: "Senior Reviewing Officer", action: "Created", module: "Appeals", object: "Appeal APL/YBG/2025/004", details: "Filed appeal for Yadagirigutta encroachment case" },
  { id: 9, timestamp: "2026-04-07 09:00:00", user: "M. Priya", role: "Data Entry Operator", action: "Bulk Upload", module: "Cases", object: "Bulk Import", details: "Uploaded 5 cases via CSV import" },
  { id: 10, timestamp: "2026-04-06 15:30:00", user: "K. Srinivas Rao", role: "District Legal Officer", action: "Exported", module: "Reports", object: "Court-wise Report", details: "Exported court-wise case report to PDF" },
  { id: 11, timestamp: "2026-04-05 14:00:00", user: "V. Ramesh", role: "Revenue Officer", action: "Updated", module: "Cases", object: "Case OS 567/2024", details: "Updated valuation report submission status" },
  { id: 12, timestamp: "2026-04-04 11:00:00", user: "P. Nagesh", role: "HC Representative Officer", action: "Updated", module: "Court Liaison", object: "Daily Update", details: "Recorded 4 hearing outcomes from HC" },
];

export const documents = [
  { id: "DOC/001", name: "Counter Affidavit - WP 2456/2024", category: "Affidavit", linkedCase: "LCMS/YBG/2024/001", uploadDate: "2026-03-08", uploadedBy: "S. Padma Kumari", size: "2.4 MB", type: "PDF" },
  { id: "DOC/002", name: "Land Survey Report - Survey No. 145, Bhongir", category: "Survey Report", linkedCase: "LCMS/YBG/2024/001", uploadDate: "2026-02-15", uploadedBy: "D. Rajender", size: "5.1 MB", type: "PDF" },
  { id: "DOC/003", name: "Suspension Order Copy - Service Matter", category: "Order", linkedCase: "LCMS/YBG/2024/002", uploadDate: "2026-02-22", uploadedBy: "M. Priya", size: "850 KB", type: "PDF" },
  { id: "DOC/004", name: "Consumer Forum Notice - Water Supply", category: "Notice", linkedCase: "LCMS/YBG/2024/003", uploadDate: "2026-03-05", uploadedBy: "M. Priya", size: "320 KB", type: "PDF" },
  { id: "DOC/005", name: "Encroachment Photos - Choutuppal Govt Land", category: "Evidence", linkedCase: "LCMS/YBG/2024/004", uploadDate: "2025-12-10", uploadedBy: "D. Rajender", size: "12.3 MB", type: "ZIP" },
  { id: "DOC/006", name: "PRC Calculation Sheet - Tribunal Matter", category: "Financial", linkedCase: "LCMS/YBG/2024/005", uploadDate: "2025-09-01", uploadedBy: "S. Padma Kumari", size: "1.1 MB", type: "XLSX" },
  { id: "DOC/007", name: "Court Order - Stay on Acquisition", category: "Court Order", linkedCase: "LCMS/YBG/2024/001", uploadDate: "2026-03-30", uploadedBy: "K. Srinivas Rao", size: "1.8 MB", type: "PDF" },
  { id: "DOC/008", name: "Revenue Survey Report - Yadagirigutta Temple Area", category: "Survey Report", linkedCase: "LCMS/YBG/2024/011", uploadDate: "2026-03-20", uploadedBy: "D. Rajender", size: "3.2 MB", type: "PDF" },
  { id: "DOC/009", name: "NH Road Widening Valuation Report", category: "Valuation", linkedCase: "LCMS/YBG/2024/010", uploadDate: "2026-03-15", uploadedBy: "V. Ramesh", size: "4.5 MB", type: "PDF" },
  { id: "DOC/010", name: "Temple Land Compensation Assessment", category: "Valuation", linkedCase: "LCMS/YBG/2025/028", uploadDate: "2026-04-02", uploadedBy: "P. Nagesh", size: "2.8 MB", type: "PDF" },
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
  "Hearing": "bg-status-hearing/10 text-status-hearing border-status-hearing/20",
  "Evidence": "bg-status-pending/10 text-status-pending border-status-pending/20",
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
