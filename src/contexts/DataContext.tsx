import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  CaseRecord, cases as seedCases, hearings as seedHearings, appeals as seedAppeals, alerts as seedAlerts,
  AuditEntry, DirectionRecord, ActionTakenRecord, CaseDoc,
} from "@/data/sampleData";

export interface HearingRecord {
  id: string;
  caseId: string;
  caseTitle: string;
  court: string;
  date: string;
  time: string;
  type: string;
  officer: string;
  status: string;
  outcome: string;
  remarks: string;
  orderPassed: boolean;
  orderSummary: string;
  complianceRequired: boolean;
  complianceStatus: string;
  complianceDueDate?: string;
  complianceCompletedDate?: string;
  responsibleDepartment?: string;
  responsibleOfficer?: string;
  complianceRemarks?: string;
}

export interface AppealRecord {
  id: string;
  parentCaseId: string;
  appealNumber: string;
  court: string;
  filingDate: string;
  grounds: string;
  stage: string;
  assignedOfficer: string;
  nextHearing: string;
  outcome: string;
  remarks: string;
  attachments: number;
}

export interface AlertRecord {
  id: string;
  type: string;
  message: string;
  caseId: string;
  officer: string;
  date: string;
  priority: string;
  status: string;
  channel: string;
}

const CASES_KEY = "lcms_cases";
const HEARINGS_KEY = "lcms_hearings";
const APPEALS_KEY = "lcms_appeals";
const ALERTS_KEY = "lcms_alerts";
const DOCS_KEY = "lcms_case_docs";
const AUDIT_KEY = "lcms_audit";
const SEED_VERSION_KEY = "lcms_seed_version";
const CURRENT_SEED_VERSION = "2026.05.26-contempt";

// Backfill any legacy/seed records missing the new workflow fields.
function normaliseCase(c: CaseRecord, idx: number): CaseRecord {
  const isClosed = c.status === "Closed";
  const defaults: Partial<CaseRecord> = {
    slNo: idx + 1,
    caseYear: c.filingYear,
    instructionsFiled: isClosed ? "Yes" : c.status === "Fresh" ? "Pending" : "Yes",
    counterFiled: isClosed ? "Yes" : c.status === "Counter Pending" || c.status === "Fresh" ? "No" : "Yes",
    srNumber: "",
    approvedCounterDoc: null,
    disposed: isClosed ? "Yes" : "No",
    disposalDate: "",
    disposalSummary: "",
    judgmentDoc: null,
    directions: [],
    actionsTaken: [],
    closed: false,
    closedBy: "",
    closedAt: "",
    auditTrail: [],
  };
  return { ...defaults, ...c, slNo: c.slNo ?? idx + 1 };
}

// One-time per version: clear cached seeds so new seed data appears.
function ensureSeedVersion() {
  if (typeof window === "undefined") return;
  const v = localStorage.getItem(SEED_VERSION_KEY);
  if (v !== CURRENT_SEED_VERSION) {
    localStorage.removeItem(CASES_KEY);
    localStorage.removeItem(HEARINGS_KEY);
    localStorage.removeItem(APPEALS_KEY);
    localStorage.removeItem(ALERTS_KEY);
    localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
  }
}
ensureSeedVersion();

function load<T>(key: string, seed: T[]): T[] {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(seed));
  return [...seed];
}


interface DataContextType {
  cases: CaseRecord[];
  hearings: HearingRecord[];
  appeals: AppealRecord[];
  alerts: AlertRecord[];
  docs: CaseDoc[];
  globalAudit: AuditEntry[];
  addCase: (c: CaseRecord) => void;
  updateCase: (id: string, data: Partial<CaseRecord>) => void;
  deleteCase: (id: string) => void;
  addHearing: (h: HearingRecord) => void;
  updateHearing: (id: string, data: Partial<HearingRecord>) => void;
  addAppeal: (a: AppealRecord) => void;
  updateAppeal: (id: string, data: Partial<AppealRecord>) => void;
  addCases: (newCases: CaseRecord[]) => void;
  generateCaseId: () => string;
  generateHearingId: () => string;
  // Workflow helpers
  appendAudit: (caseId: string, entry: Omit<AuditEntry, "id" | "ts">, actor: string, role: string) => void;
  addDirection: (caseId: string, direction: Omit<DirectionRecord, "id" | "issuedAt">, actor: string, role: string) => void;
  updateDirection: (caseId: string, directionId: string, patch: Partial<DirectionRecord>, actor: string, role: string) => void;
  addActionTaken: (caseId: string, action: Omit<ActionTakenRecord, "id" | "uploadedAt">, actor: string, role: string) => void;
  setCounterStatus: (caseId: string, patch: Partial<CaseRecord>, actor: string, role: string, label: string) => void;
  markDisposed: (caseId: string, payload: { disposalDate: string; disposalSummary: string }, actor: string, role: string) => void;
  closeFile: (caseId: string, actor: string, role: string) => { ok: boolean; reason?: string };
  addCaseDocument: (caseId: string, doc: Omit<CaseDoc, "id" | "uploadedAt">, actor: string, role: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

const CLOSE_AUTHORISED_ROLES = [
  "District Collector",
  "Additional Collector (Revenue)",
  "Additional Collector (Local Bodies)",
  "District Legal Officer",
  "Admin",
  "Super Admin",
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<CaseRecord[]>(() => {
    const raw = load(CASES_KEY, seedCases);
    return raw.map((c, i) => normaliseCase(c, i));
  });
  const [hearings, setHearings] = useState<HearingRecord[]>(() => load(HEARINGS_KEY, seedHearings as HearingRecord[]));
  const [appeals, setAppeals] = useState<AppealRecord[]>(() => load(APPEALS_KEY, seedAppeals as AppealRecord[]));
  const [alerts, setAlerts] = useState<AlertRecord[]>(() => load(ALERTS_KEY, seedAlerts as AlertRecord[]));
  const [docs, setDocs] = useState<CaseDoc[]>(() => load(DOCS_KEY, [] as CaseDoc[]));
  const [globalAudit, setGlobalAudit] = useState<AuditEntry[]>(() => load(AUDIT_KEY, [] as AuditEntry[]));

  useEffect(() => { localStorage.setItem(CASES_KEY, JSON.stringify(cases)); }, [cases]);
  useEffect(() => { localStorage.setItem(HEARINGS_KEY, JSON.stringify(hearings)); }, [hearings]);
  useEffect(() => { localStorage.setItem(APPEALS_KEY, JSON.stringify(appeals)); }, [appeals]);
  useEffect(() => { localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts)); }, [alerts]);
  useEffect(() => { localStorage.setItem(DOCS_KEY, JSON.stringify(docs)); }, [docs]);
  useEffect(() => { localStorage.setItem(AUDIT_KEY, JSON.stringify(globalAudit)); }, [globalAudit]);

  const addCase = (c: CaseRecord) => setCases(prev => [c, ...prev]);
  const updateCase = (id: string, data: Partial<CaseRecord>) => setCases(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  const deleteCase = (id: string) => setCases(prev => prev.filter(c => c.id !== id));
  const addCases = (newCases: CaseRecord[]) => setCases(prev => [...newCases, ...prev]);

  const addHearing = (h: HearingRecord) => setHearings(prev => [h, ...prev]);
  const updateHearing = (id: string, data: Partial<HearingRecord>) => setHearings(prev => prev.map(h => h.id === id ? { ...h, ...data } : h));

  const addAppeal = (a: AppealRecord) => setAppeals(prev => [a, ...prev]);
  const updateAppeal = (id: string, data: Partial<AppealRecord>) => setAppeals(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));

  const generateCaseId = () => {
    const year = new Date().getFullYear();
    const num = cases.length + 1;
    return `LCMS/YBG/${year}/${String(num).padStart(3, "0")}`;
  };
  const generateHearingId = () => `HRG/${String(hearings.length + 1).padStart(3, "0")}`;

  const writeAudit = (caseId: string, entry: AuditEntry) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, auditTrail: [entry, ...(c.auditTrail || [])], lastUpdated: new Date().toISOString().slice(0, 10) } : c));
    setGlobalAudit(prev => [{ ...entry, details: `[${caseId}] ${entry.details || ""}` }, ...prev].slice(0, 500));
  };

  const appendAudit: DataContextType["appendAudit"] = (caseId, entry, actor, role) => {
    writeAudit(caseId, { id: `AUD-${Date.now()}`, ts: new Date().toISOString(), actor, role, action: entry.action, details: entry.details });
  };

  const addDirection: DataContextType["addDirection"] = (caseId, d, actor, role) => {
    const dir: DirectionRecord = { ...d, id: `DIR-${Date.now()}`, issuedAt: new Date().toISOString().slice(0, 10) };
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, directions: [...(c.directions || []), dir] } : c));
    writeAudit(caseId, { id: `AUD-${Date.now() + 1}`, ts: new Date().toISOString(), actor, role, action: "Direction Issued", details: `${d.concernedOfficer} (${d.concernedDepartment}) — ${d.text.slice(0, 80)}` });
  };

  const updateDirection: DataContextType["updateDirection"] = (caseId, directionId, patch, actor, role) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, directions: (c.directions || []).map(d => d.id === directionId ? { ...d, ...patch } : d) } : c));
    writeAudit(caseId, { id: `AUD-${Date.now()}`, ts: new Date().toISOString(), actor, role, action: "Direction Updated", details: `Direction ${directionId} → ${patch.status || "updated"}` });
  };

  const addActionTaken: DataContextType["addActionTaken"] = (caseId, a, actor, role) => {
    const action: ActionTakenRecord = { ...a, id: `ACT-${Date.now()}`, uploadedAt: new Date().toISOString().slice(0, 10) };
    setCases(prev => prev.map(c => {
      if (c.id !== caseId) return c;
      const next: CaseRecord = { ...c, actionsTaken: [...(c.actionsTaken || []), action] };
      if (a.linkedDirectionId) {
        next.directions = (c.directions || []).map(d => d.id === a.linkedDirectionId ? { ...d, status: "Completed" } : d);
      }
      return next;
    }));
    writeAudit(caseId, { id: `AUD-${Date.now() + 1}`, ts: new Date().toISOString(), actor, role, action: "Action Taken Uploaded", details: a.summary.slice(0, 120) });
  };

  const setCounterStatus: DataContextType["setCounterStatus"] = (caseId, patch, actor, role, label) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, ...patch, lastUpdated: new Date().toISOString().slice(0, 10) } : c));
    writeAudit(caseId, { id: `AUD-${Date.now()}`, ts: new Date().toISOString(), actor, role, action: label, details: JSON.stringify(patch) });
  };

  const markDisposed: DataContextType["markDisposed"] = (caseId, payload, actor, role) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, disposed: "Yes", disposalDate: payload.disposalDate, disposalSummary: payload.disposalSummary, status: "Closed", finalJudgmentStatus: "Received", lastUpdated: new Date().toISOString().slice(0, 10) } : c));
    writeAudit(caseId, { id: `AUD-${Date.now()}`, ts: new Date().toISOString(), actor, role, action: "Case Disposed", details: payload.disposalSummary.slice(0, 120) });
  };

  const closeFile: DataContextType["closeFile"] = (caseId, actor, role) => {
    if (!CLOSE_AUTHORISED_ROLES.includes(role)) return { ok: false, reason: "Your role is not authorised to close files." };
    const c = cases.find(x => x.id === caseId);
    if (!c) return { ok: false, reason: "Case not found." };
    if (c.disposed !== "Yes") return { ok: false, reason: "Case is not yet disposed." };
    const openDirs = (c.directions || []).filter(d => d.status !== "Completed");
    if (openDirs.length > 0) return { ok: false, reason: `${openDirs.length} direction(s) still pending action.` };
    setCases(prev => prev.map(x => x.id === caseId ? { ...x, closed: true, closedBy: actor, closedAt: new Date().toISOString().slice(0, 10), status: "Closed", pendingAtLevel: "Closed", finalActionStatus: "Completed", lastUpdated: new Date().toISOString().slice(0, 10) } : x));
    writeAudit(caseId, { id: `AUD-${Date.now()}`, ts: new Date().toISOString(), actor, role, action: "File Closed", details: `Closed by ${actor} (${role})` });
    return { ok: true };
  };

  const addCaseDocument: DataContextType["addCaseDocument"] = (caseId, d, actor, role) => {
    const doc: CaseDoc = { ...d, id: `DOC-${Date.now()}`, uploadedAt: new Date().toISOString().slice(0, 10) };
    setDocs(prev => [{ ...doc, /* attach caseId via name prefix */ } as CaseDoc & { caseId?: string }, ...prev] as CaseDoc[]);
    // Persist link to case via stage tag
    setDocs(prev => {
      const exists = prev.find(p => p.id === doc.id);
      if (exists) return prev;
      return [{ ...doc } as CaseDoc, ...prev];
    });
    writeAudit(caseId, { id: `AUD-${Date.now()}`, ts: new Date().toISOString(), actor, role, action: "Document Uploaded", details: `${d.stage} — ${d.name}` });
  };

  return (
    <DataContext.Provider value={{
      cases, hearings, appeals, alerts, docs, globalAudit,
      addCase, updateCase, deleteCase, addCases,
      addHearing, updateHearing,
      addAppeal, updateAppeal,
      generateCaseId, generateHearingId,
      appendAudit, addDirection, updateDirection, addActionTaken,
      setCounterStatus, markDisposed, closeFile, addCaseDocument,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
