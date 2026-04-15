import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { useMemo } from "react";
import { divisions } from "@/data/sampleData";
import type { CaseRecord } from "@/data/sampleData";

/**
 * Returns cases filtered by the current user's role scope.
 * - Super Admin / Admin / District Collector / Legal Officer / Read-Only: all cases
 * - Additional Collector (Revenue): revenue-related departments
 * - Additional Collector (Local Bodies): municipal/panchayat departments
 * - RDO Bhongir: Bhongir division mandals only
 * - RDO Choutuppal: Choutuppal division mandals only
 * - Mandal-Level User: user's mandal only
 * - Department Nodal Officer: user's department only
 * - Section officers: section-relevant departments
 * - Data Entry Operator: user's mandal if set, else all
 * - Liaison: all (hearing-focused)
 */

const REVENUE_DEPTS = ["Revenue Department", "Land Records", "Tahsildar Office", "Survey & Settlement"];
const LOCAL_BODY_DEPTS = ["Municipal Administration", "Panchayat Raj"];

export function useRoleFilter() {
  const { currentUser } = useAuth();
  const { cases, hearings, appeals, alerts } = useData();
  const role = currentUser?.role;

  const filteredCases = useMemo(() => {
    if (!role) return cases;

    switch (role) {
      case "Super Admin":
      case "Admin":
      case "District Collector":
      case "District Legal Officer":
      case "Read-Only Viewer":
      case "High Court Representative Officer":
      case "Case Handling Officer":
        return cases;

      case "Additional Collector (Revenue)":
        return cases.filter(c => REVENUE_DEPTS.includes(c.department));

      case "Additional Collector (Local Bodies)":
        return cases.filter(c => LOCAL_BODY_DEPTS.includes(c.department));

      case "DRO":
      case "Administrative Officer":
        return cases;

      case "Section C Officer":
        return cases.filter(c => c.department === "Collectorate Legal Cell" || c.court.includes("High Court"));
      case "Section D Officer":
        return cases.filter(c => REVENUE_DEPTS.includes(c.department));
      case "Section E Officer":
        return cases.filter(c => c.department === "Land Records" || c.department === "Survey & Settlement" || c.caseType === "Land Dispute");
      case "Section G Officer":
        return cases.filter(c => c.caseType === "Compensation Matter" || c.natureOfCase?.includes("Acquisition"));

      case "RDO Bhongir":
        return cases.filter(c => divisions["Bhongir Division"]?.includes(c.mandal));
      case "RDO Choutuppal":
        return cases.filter(c => divisions["Choutuppal Division"]?.includes(c.mandal));

      case "Mandal-Level User":
        return cases.filter(c => c.mandal === currentUser?.mandal);

      case "Department Nodal Officer":
        return cases.filter(c => c.department === currentUser?.department);

      case "Data Entry Operator":
        if (currentUser?.mandal && currentUser.mandal !== "All") {
          return cases.filter(c => c.mandal === currentUser.mandal);
        }
        return cases;

      default:
        return cases;
    }
  }, [cases, role, currentUser]);

  const filteredHearings = useMemo(() => {
    const caseIds = new Set(filteredCases.map(c => c.id));
    return hearings.filter(h => caseIds.has(h.caseId));
  }, [hearings, filteredCases]);

  const scopeLabel = useMemo(() => {
    switch (role) {
      case "RDO Bhongir": return "Bhongir Division";
      case "RDO Choutuppal": return "Choutuppal Division";
      case "Mandal-Level User": return `${currentUser?.mandal} Mandal`;
      case "Department Nodal Officer": return currentUser?.department || "";
      case "Additional Collector (Revenue)": return "Revenue & Land Departments";
      case "Additional Collector (Local Bodies)": return "Local Body Departments";
      case "Section C Officer": return "Court / Legal Matters";
      case "Section D Officer": return "Land Revenue & Relief";
      case "Section E Officer": return "Land Administration";
      case "Section G Officer": return "Land Acquisition";
      default: return "District-wide";
    }
  }, [role, currentUser]);

  return { filteredCases, filteredHearings, appeals, alerts, scopeLabel };
}

export function getRoleDashboardType(role: string | undefined): string {
  if (!role) return "default";
  switch (role) {
    case "Super Admin": return "superadmin";
    case "Admin": return "admin";
    case "District Collector": return "collector";
    case "Additional Collector (Revenue)":
    case "Additional Collector (Local Bodies)": return "addlcollector";
    case "DRO":
    case "Administrative Officer": return "dro";
    case "District Legal Officer": return "legal";
    case "Section C Officer":
    case "Section D Officer":
    case "Section E Officer":
    case "Section G Officer": return "section";
    case "RDO Bhongir":
    case "RDO Choutuppal": return "rdo";
    case "Mandal-Level User": return "mandal";
    case "Department Nodal Officer": return "department";
    case "High Court Representative Officer": return "liaison";
    case "Case Handling Officer": return "casehandler";
    case "Data Entry Operator": return "dataentry";
    case "Read-Only Viewer": return "readonly";
    default: return "default";
  }
}
