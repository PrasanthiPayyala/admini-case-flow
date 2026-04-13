import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CaseRecord, cases as seedCases, hearings as seedHearings, appeals as seedAppeals, alerts as seedAlerts } from "@/data/sampleData";

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
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<CaseRecord[]>(() => load(CASES_KEY, seedCases));
  const [hearings, setHearings] = useState<HearingRecord[]>(() => load(HEARINGS_KEY, seedHearings as HearingRecord[]));
  const [appeals, setAppeals] = useState<AppealRecord[]>(() => load(APPEALS_KEY, seedAppeals as AppealRecord[]));
  const [alerts, setAlerts] = useState<AlertRecord[]>(() => load(ALERTS_KEY, seedAlerts as AlertRecord[]));

  useEffect(() => { localStorage.setItem(CASES_KEY, JSON.stringify(cases)); }, [cases]);
  useEffect(() => { localStorage.setItem(HEARINGS_KEY, JSON.stringify(hearings)); }, [hearings]);
  useEffect(() => { localStorage.setItem(APPEALS_KEY, JSON.stringify(appeals)); }, [appeals]);
  useEffect(() => { localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts)); }, [alerts]);

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

  return (
    <DataContext.Provider value={{
      cases, hearings, appeals, alerts,
      addCase, updateCase, deleteCase, addCases,
      addHearing, updateHearing,
      addAppeal, updateAppeal,
      generateCaseId, generateHearingId,
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
