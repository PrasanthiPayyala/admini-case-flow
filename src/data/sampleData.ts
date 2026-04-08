export const mandals = [
  "Bhongir", "Alair", "Raigir", "Pochampally", "Yadagirigutta",
  "Choutuppal", "Mothkur", "Bommalaramaram", "Valigonda", "Addanki",
  "Turkapally", "Bibinagar", "Narayanapur", "Atmakur (M)", "Rajapet"
];

export const caseTypes = [
  "Civil", "Criminal", "Revenue", "Land Dispute", "Service Matter",
  "Consumer Matter", "Tribunal Matter", "Other"
];

export const courtNames = [
  "High Court of Telangana",
  "District Court, Yadadri Bhuvanagiri",
  "Consumer Forum, Nalgonda",
  "Telangana Administrative Tribunal",
  "Revenue Court, Bhongir",
  "Revenue Court, Alair",
  "District Consumer Forum, YBG"
];

export const cases = [
  { id: "LCMS/YBG/2024/001", caseNumber: "WP(C) 14523/2024", title: "Land Acquisition - Survey No. 145, Bhongir", court: "High Court of Telangana", courtType: "High Court", caseType: "Land Dispute", petitioner: "Ramesh Kumar Reddy", respondent: "District Collector, Yadadri Bhuvanagiri", coRespondents: ["Tahsildar, Bhongir", "Revenue Divisional Officer, Bhongir"], department: "Revenue", mandal: "Bhongir", filingDate: "2024-01-15", assignedOfficer: "K. Srinivas Rao", priority: "High", status: "Ongoing", lastHearing: "2024-03-10", nextHearing: "2024-04-15", advocate: "Adv. P. Venkatesh", advocateContact: "9876543210", subject: "Challenge to land acquisition notification under RFCTLARR Act for Survey No. 145, Bhongir Mandal", remarks: "Counter affidavit filed. Awaiting next hearing.", tags: ["Land", "Revenue", "Urgent"] },
  { id: "LCMS/YBG/2024/002", caseNumber: "OS 234/2024", title: "Service Matter - Suspension of Clerk", court: "District Court, Yadadri Bhuvanagiri", courtType: "District Court", caseType: "Service Matter", petitioner: "M. Lakshmi Devi", respondent: "Collector & DM, YBG", coRespondents: ["District Personnel Officer, YBG"], department: "Administration", mandal: "Bhongir", filingDate: "2024-02-20", assignedOfficer: "S. Padma Kumari", priority: "Medium", status: "Hearing Scheduled", lastHearing: "2024-03-25", nextHearing: "2024-04-08", advocate: "Adv. R. Suresh Babu", advocateContact: "9123456780", subject: "Challenge to suspension order of ministerial staff in Collectorate", remarks: "Written statement to be filed.", tags: ["Service", "HR"] },
  { id: "LCMS/YBG/2024/003", caseNumber: "CCC 89/2024", title: "Consumer Complaint - Water Supply", court: "Consumer Forum, Nalgonda", courtType: "Consumer Forum", caseType: "Consumer Matter", petitioner: "Nagarjuna Welfare Association", respondent: "HMWSSB & District Administration", coRespondents: ["Municipal Commissioner, Raigir", "Executive Engineer, HMWSSB"], department: "Municipal", mandal: "Raigir", filingDate: "2024-03-01", assignedOfficer: "D. Rajender", priority: "Low", status: "Fresh", lastHearing: "-", nextHearing: "2024-04-20", advocate: "Adv. G. Srinivasa Rao", advocateContact: "9988776655", subject: "Complaint regarding irregular water supply in Raigir Municipality", remarks: "Case recently filed. To assign junior officer.", tags: ["Municipal", "Consumer"] },
  { id: "LCMS/YBG/2024/004", caseNumber: "WP 7892/2023", title: "Encroachment Removal - Govt Land", court: "High Court of Telangana", courtType: "High Court", caseType: "Revenue", petitioner: "Telangana State Govt", respondent: "Various Encroachers", coRespondents: ["Pochampally Gram Panchayat", "MRO, Pochampally"], department: "Revenue", mandal: "Pochampally", filingDate: "2023-11-10", assignedOfficer: "K. Srinivas Rao", priority: "High", status: "Counter Pending", lastHearing: "2024-02-28", nextHearing: "2024-04-12", advocate: "Govt. Pleader", advocateContact: "9876501234", subject: "Action against illegal encroachments on government land in Pochampally", remarks: "Counter pending from respondents. Urgent follow-up needed.", tags: ["Revenue", "Encroachment"] },
  { id: "LCMS/YBG/2024/005", caseNumber: "TA 456/2023", title: "Tribunal Appeal - PRC Arrears", court: "Telangana Administrative Tribunal", courtType: "Tribunal", caseType: "Tribunal Matter", petitioner: "B. Venkateswarlu & Others", respondent: "State of Telangana", coRespondents: ["Principal Secretary, Finance Dept.", "District Treasury Officer, YBG"], department: "Finance", mandal: "Yadagirigutta", filingDate: "2023-08-15", assignedOfficer: "S. Padma Kumari", priority: "Medium", status: "Appealed", lastHearing: "2024-01-20", nextHearing: "2024-05-10", advocate: "Adv. M. Bharath Kumar", advocateContact: "9012345678", subject: "PRC arrears claim by Group-D employees of Collectorate", remarks: "Appeal filed by petitioners. Review pending.", tags: ["Finance", "PRC"] },
  { id: "LCMS/YBG/2023/010", caseNumber: "WP 2345/2022", title: "RoR Correction - Alair", court: "High Court of Telangana", courtType: "High Court", caseType: "Civil", petitioner: "Smt. Sarojini Devi", respondent: "Tahsildar, Alair", coRespondents: ["Sub-Registrar, Alair"], department: "Revenue", mandal: "Alair", filingDate: "2022-06-18", assignedOfficer: "D. Rajender", priority: "Low", status: "Closed", lastHearing: "2023-12-15", nextHearing: "-", advocate: "Adv. K. Ramakrishna", advocateContact: "9567890123", subject: "Correction of Record of Rights in Alair Mandal land records", remarks: "Case disposed. Orders complied.", tags: ["Revenue", "Land Records"] },
  { id: "LCMS/YBG/2024/006", caseNumber: "CC 102/2024", title: "Criminal Case - Sand Mining", court: "District Court, Yadadri Bhuvanagiri", courtType: "District Court", caseType: "Criminal", petitioner: "State of Telangana", respondent: "K. Mahesh & Others", coRespondents: ["Sarpanch, Mothkur GP"], department: "Revenue", mandal: "Mothkur", filingDate: "2024-03-25", assignedOfficer: "K. Srinivas Rao", priority: "High", status: "Fresh", lastHearing: "-", nextHearing: "2024-04-28", advocate: "Govt. Pleader", advocateContact: "9876501234", subject: "Illegal sand mining in Mothkur mandal river bed areas", remarks: "FIR registered. Court notice issued.", tags: ["Criminal", "Mining"] },
  { id: "LCMS/YBG/2024/007", caseNumber: "LP 45/2024", title: "Land Petition - Choutuppal", court: "Revenue Court, Bhongir", courtType: "Revenue Court", caseType: "Land Dispute", petitioner: "G. Suresh Reddy", respondent: "MRO, Choutuppal", coRespondents: ["Village Revenue Officer, Choutuppal"], department: "Revenue", mandal: "Choutuppal", filingDate: "2024-04-01", assignedOfficer: "D. Rajender", priority: "Medium", status: "Fresh", lastHearing: "-", nextHearing: "2024-04-22", advocate: "Adv. T. Narasimha", advocateContact: "9345678901", subject: "Dispute over patta land boundaries in Choutuppal mandal", remarks: "Recently filed. Preliminary hearing pending.", tags: ["Land", "Revenue"] },
];

export const appeals = [
  { id: "APL/YBG/2024/001", parentCaseId: "LCMS/YBG/2024/001", appealNumber: "WA 234/2024", court: "Division Bench, HC Telangana", filingDate: "2024-03-20", grounds: "Error in single bench order regarding land valuation methodology", stage: "Admission", assignedOfficer: "K. Srinivas Rao", nextHearing: "2024-04-25", outcome: "Pending", remarks: "Writ appeal admitted. Stay granted.", attachments: 2 },
  { id: "APL/YBG/2024/002", parentCaseId: "LCMS/YBG/2024/005", appealNumber: "RA 78/2024", court: "Principal Bench, TAT", filingDate: "2024-02-10", grounds: "Review of arrears computation by single member bench", stage: "Arguments", assignedOfficer: "S. Padma Kumari", nextHearing: "2024-05-15", outcome: "Pending", remarks: "Arguments stage. Govt side to present.", attachments: 1 },
];

export const hearings = [
  { id: "HRG/001", caseId: "LCMS/YBG/2024/001", caseTitle: "Land Acquisition - Survey No. 145", court: "High Court of Telangana", date: "2024-04-15", time: "10:30 AM", type: "Regular Hearing", officer: "K. Srinivas Rao", status: "Scheduled", outcome: "", remarks: "Counter affidavit to be presented" },
  { id: "HRG/002", caseId: "LCMS/YBG/2024/002", caseTitle: "Service Matter - Suspension of Clerk", court: "District Court, YBG", date: "2024-04-08", time: "11:00 AM", type: "Arguments", officer: "S. Padma Kumari", status: "Scheduled", outcome: "", remarks: "Written statement deadline" },
  { id: "HRG/003", caseId: "LCMS/YBG/2024/004", caseTitle: "Encroachment Removal - Govt Land", court: "High Court of Telangana", date: "2024-04-12", time: "2:00 PM", type: "Counter Filing", officer: "K. Srinivas Rao", status: "Scheduled", outcome: "", remarks: "Counter expected from respondents" },
  { id: "HRG/004", caseId: "LCMS/YBG/2024/003", caseTitle: "Consumer Complaint - Water Supply", court: "Consumer Forum", date: "2024-04-20", time: "11:30 AM", type: "First Hearing", officer: "D. Rajender", status: "Scheduled", outcome: "", remarks: "First appearance" },
  { id: "HRG/005", caseId: "LCMS/YBG/2024/001", caseTitle: "Land Acquisition - Survey No. 145", court: "High Court of Telangana", date: "2024-03-10", time: "10:30 AM", type: "Regular Hearing", officer: "K. Srinivas Rao", status: "Completed", outcome: "Adjourned", remarks: "Matter adjourned to 15-Apr. Counter filed." },
  { id: "HRG/006", caseId: "LCMS/YBG/2024/002", caseTitle: "Service Matter - Suspension of Clerk", court: "District Court, YBG", date: "2024-03-25", time: "11:00 AM", type: "Arguments", officer: "S. Padma Kumari", status: "Completed", outcome: "Part-heard", remarks: "Arguments partly heard. Adjourned." },
  { id: "HRG/007", caseId: "LCMS/YBG/2024/006", caseTitle: "Criminal Case - Sand Mining", court: "District Court, YBG", date: "2024-04-28", time: "10:00 AM", type: "First Hearing", officer: "K. Srinivas Rao", status: "Scheduled", outcome: "", remarks: "First appearance. Notice served." },
];

export const alerts = [
  { id: "ALT/001", type: "Hearing Reminder", message: "Hearing in WP(C) 14523/2024 due in 3 days", caseId: "LCMS/YBG/2024/001", officer: "K. Srinivas Rao", date: "2024-04-12", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/002", type: "Hearing Reminder", message: "Hearing in OS 234/2024 due tomorrow", caseId: "LCMS/YBG/2024/002", officer: "S. Padma Kumari", date: "2024-04-07", priority: "Urgent", status: "Sent", channel: "SMS" },
  { id: "ALT/003", type: "Overdue Update", message: "Status update overdue for WP 7892/2023", caseId: "LCMS/YBG/2024/004", officer: "K. Srinivas Rao", date: "2024-04-05", priority: "High", status: "Pending", channel: "Email" },
  { id: "ALT/004", type: "Appeal Deadline", message: "Appeal deadline approaching for TA 456/2023", caseId: "LCMS/YBG/2024/005", officer: "S. Padma Kumari", date: "2024-04-10", priority: "Medium", status: "Sent", channel: "Email" },
  { id: "ALT/005", type: "Escalation", message: "Case LCMS/YBG/2024/004 pending beyond 30 days without update", caseId: "LCMS/YBG/2024/004", officer: "K. Srinivas Rao", date: "2024-04-06", priority: "Urgent", status: "Failed", channel: "SMS" },
];

export const users = [
  { id: "USR/001", name: "Sri. Pamela Satpathy, IAS", email: "collector@ybg.telangana.gov.in", role: "District Collector", department: "General Administration", status: "Active", lastLogin: "2024-04-07 09:15" },
  { id: "USR/002", name: "K. Srinivas Rao", email: "legal.officer1@ybg.telangana.gov.in", role: "Legal Officer", department: "Legal Cell", status: "Active", lastLogin: "2024-04-07 10:30" },
  { id: "USR/003", name: "S. Padma Kumari", email: "legal.officer2@ybg.telangana.gov.in", role: "Case Handling Officer", department: "Legal Cell", status: "Active", lastLogin: "2024-04-06 16:45" },
  { id: "USR/004", name: "D. Rajender", email: "section.officer@ybg.telangana.gov.in", role: "Section Officer", department: "Revenue", status: "Active", lastLogin: "2024-04-07 08:00" },
  { id: "USR/005", name: "M. Priya", email: "deo@ybg.telangana.gov.in", role: "Data Entry Operator", department: "Legal Cell", status: "Active", lastLogin: "2024-04-07 09:45" },
  { id: "USR/006", name: "Admin User", email: "admin@ybg.telangana.gov.in", role: "Admin", department: "IT", status: "Active", lastLogin: "2024-04-07 07:30" },
  { id: "USR/007", name: "R. Venkat Reddy", email: "viewer@ybg.telangana.gov.in", role: "Read-Only Viewer", department: "Planning", status: "Inactive", lastLogin: "2024-03-28 14:00" },
];

export const auditLogs = [
  { id: 1, timestamp: "2024-04-07 10:32:15", user: "K. Srinivas Rao", role: "Legal Officer", action: "Updated", object: "Case LCMS/YBG/2024/001", details: "Changed status from 'Fresh' to 'Ongoing'" },
  { id: 2, timestamp: "2024-04-07 09:45:00", user: "M. Priya", role: "Data Entry Operator", action: "Created", object: "Case LCMS/YBG/2024/003", details: "New case registered for Consumer Complaint" },
  { id: 3, timestamp: "2024-04-06 16:20:00", user: "S. Padma Kumari", role: "Case Handling Officer", action: "Uploaded", object: "Document - Counter Affidavit", details: "Uploaded counter affidavit for WP(C) 14523/2024" },
  { id: 4, timestamp: "2024-04-06 15:00:00", user: "Admin User", role: "Admin", action: "Modified", object: "User USR/007", details: "Deactivated user R. Venkat Reddy" },
  { id: 5, timestamp: "2024-04-06 11:30:00", user: "K. Srinivas Rao", role: "Legal Officer", action: "Updated", object: "Hearing HRG/005", details: "Marked hearing as completed. Outcome: Adjourned" },
  { id: 6, timestamp: "2024-04-05 14:15:00", user: "D. Rajender", role: "Section Officer", action: "Created", object: "Alert ALT/003", details: "Generated overdue alert for WP 7892/2023" },
  { id: 7, timestamp: "2024-04-05 10:00:00", user: "S. Padma Kumari", role: "Case Handling Officer", action: "Created", object: "Appeal APL/YBG/2024/002", details: "Filed review appeal for TA 456/2023" },
];

export const documents = [
  { id: "DOC/001", name: "Counter Affidavit - WP(C) 14523/2024", category: "Affidavit", linkedCase: "LCMS/YBG/2024/001", uploadDate: "2024-03-08", uploadedBy: "S. Padma Kumari", size: "2.4 MB", type: "PDF" },
  { id: "DOC/002", name: "Land Survey Report - Survey No. 145", category: "Survey Report", linkedCase: "LCMS/YBG/2024/001", uploadDate: "2024-02-15", uploadedBy: "D. Rajender", size: "5.1 MB", type: "PDF" },
  { id: "DOC/003", name: "Suspension Order Copy", category: "Order", linkedCase: "LCMS/YBG/2024/002", uploadDate: "2024-02-22", uploadedBy: "M. Priya", size: "850 KB", type: "PDF" },
  { id: "DOC/004", name: "Consumer Forum Notice", category: "Notice", linkedCase: "LCMS/YBG/2024/003", uploadDate: "2024-03-05", uploadedBy: "M. Priya", size: "320 KB", type: "PDF" },
  { id: "DOC/005", name: "Encroachment Photos - Pochampally", category: "Evidence", linkedCase: "LCMS/YBG/2024/004", uploadDate: "2023-12-10", uploadedBy: "D. Rajender", size: "12.3 MB", type: "ZIP" },
  { id: "DOC/006", name: "PRC Calculation Sheet", category: "Financial", linkedCase: "LCMS/YBG/2024/005", uploadDate: "2023-09-01", uploadedBy: "S. Padma Kumari", size: "1.1 MB", type: "XLSX" },
];

export const statusColors: Record<string, string> = {
  "Fresh": "bg-status-fresh/10 text-status-fresh border-status-fresh/20",
  "Ongoing": "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
  "Hearing Scheduled": "bg-status-hearing/10 text-status-hearing border-status-hearing/20",
  "Counter Pending": "bg-status-pending/10 text-status-pending border-status-pending/20",
  "Appealed": "bg-status-appealed/10 text-status-appealed border-status-appealed/20",
  "Closed": "bg-status-closed/10 text-status-closed border-status-closed/20",
  "Scheduled": "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
  "Completed": "bg-status-success/10 text-status-success border-status-success/20",
  "Pending": "bg-status-warning/10 text-status-warning border-status-warning/20",
  "Sent": "bg-status-success/10 text-status-success border-status-success/20",
  "Failed": "bg-status-urgent/10 text-status-urgent border-status-urgent/20",
  "Active": "bg-status-success/10 text-status-success border-status-success/20",
  "Inactive": "bg-status-closed/10 text-status-closed border-status-closed/20",
  "Admission": "bg-status-fresh/10 text-status-fresh border-status-fresh/20",
  "Arguments": "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
};

export const priorityColors: Record<string, string> = {
  "High": "bg-status-urgent/10 text-status-urgent border-status-urgent/20",
  "Medium": "bg-status-warning/10 text-status-warning border-status-warning/20",
  "Low": "bg-status-ongoing/10 text-status-ongoing border-status-ongoing/20",
  "Urgent": "bg-status-urgent/10 text-status-urgent border-status-urgent/20",
};
