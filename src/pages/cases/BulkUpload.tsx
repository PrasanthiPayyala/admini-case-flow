import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/hooks/use-toast";
import { mandals, departments, courtNames, caseTypes } from "@/data/sampleData";

type Step = "upload" | "preview" | "summary";
interface ParsedRow { caseNumber: string; title: string; court: string; caseType: string; mandal: string; department: string; filingDate: string; petitioner: string; respondent: string; priority: string; status: "Valid" | "Error"; errors: string[]; raw: Record<string, string>; }

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = vals[i] || ""; });
    return row;
  });
}

function validateRow(row: Record<string, string>): ParsedRow {
  const errors: string[] = [];
  const cn = row["Case Number"] || row["case_number"] || "";
  const title = row["Case Title"] || row["title"] || "";
  const court = row["Court Name"] || row["court"] || "";
  const ct = row["Case Type"] || row["case_type"] || "";
  const mandal = row["Mandal"] || row["mandal"] || "";
  const dept = row["Department"] || row["department"] || "";
  const fd = row["Filing Date"] || row["filing_date"] || "";
  const pet = row["Petitioner"] || row["petitioner"] || "";
  const resp = row["Respondent"] || row["respondent"] || "";
  const pri = row["Priority"] || row["priority"] || "Medium";
  if (!cn) errors.push("Case Number required");
  if (!title) errors.push("Title required");
  if (!court) errors.push("Court required");
  if (!ct) errors.push("Case Type required");
  if (!mandal) errors.push("Mandal required");
  if (!dept) errors.push("Department required");
  if (!pet) errors.push("Petitioner required");
  if (!resp) errors.push("Respondent required");
  return { caseNumber: cn, title, court, caseType: ct, mandal, department: dept, filingDate: fd, petitioner: pet, respondent: resp, priority: pri, status: errors.length > 0 ? "Error" : "Valid", errors, raw: row };
}

export default function BulkUpload() {
  const [step, setStep] = useState<Step>("upload");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [imported, setImported] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const { addCases, generateCaseId } = useData();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      setRows(parsed.map(validateRow));
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const valid = rows.filter(r => r.status === "Valid");
    const newCases = valid.map(r => ({
      id: generateCaseId(),
      caseNumber: r.caseNumber, title: r.title, court: r.court, courtType: "",
      caseType: r.caseType, petitioner: r.petitioner, respondent: r.respondent,
      coRespondents: [] as string[], department: r.department, mandal: r.mandal,
      filingDate: r.filingDate, filingYear: r.filingDate?.slice(0, 4) || "",
      assignedOfficer: r.raw["Assigned Officer"] || "", priority: r.priority,
      status: "Fresh", lastHearing: "-", nextHearing: "-",
      advocate: r.raw["Advocate"] || "", advocateContact: "",
      subject: r.raw["Subject"] || r.title, remarks: r.raw["Remarks"] || "",
      tags: [] as string[], collectorateInvolvement: r.raw["Collectorate Involvement"] || "",
      natureOfCase: r.raw["Nature of Case"] || "",
      landDisputeFlag: (r.raw["Land Dispute"] || "").toLowerCase() === "y",
      orderPassed: false, orderSummary: "", complianceRequired: false,
      complianceStatus: "Not Applicable", complianceDueDate: "", complianceCompletedDate: "",
      lastUpdated: new Date().toISOString().slice(0, 10),
    }));
    addCases(newCases);
    setImported(valid.length);
    setSkipped(rows.length - valid.length);
    setStep("summary");
    toast({ title: "Import completed", description: `${valid.length} cases imported.` });
  };

  const downloadTemplate = () => {
    const headers = "Case Number,Case Title,Court Name,Case Type,Filing Date,Mandal,Department,Priority,Petitioner,Respondent,Assigned Officer,Nature of Case,Land Dispute,Collectorate Involvement,Subject,Remarks";
    const sample = '\n"WP 1234/2024","Land Dispute - Bhongir","Telangana High Court","Land Dispute","2024-04-01","Bhongir","Revenue Department","High","John Doe","District Collector","District Legal Officer","Land Ownership Dispute","Y","Collectorate as Respondent","Sample subject","Sample remarks"';
    const blob = new Blob([headers + sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "lcms_bulk_upload_template.csv"; a.click();
  };

  const validCount = rows.filter(r => r.status === "Valid").length;
  const errorCount = rows.filter(r => r.status === "Error").length;

  return (
    <AppLayout>
      <PageHeader title="Bulk Upload Cases" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: "Bulk Upload" }]} />

      <div className="flex items-center gap-2 mb-6">
        {[{ key: "upload", label: "1. Upload File" }, { key: "preview", label: "2. Preview & Validate" }, { key: "summary", label: "3. Import Summary" }].map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded text-xs font-medium ${step === s.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s.label}</div>
            {i < 2 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {step === "upload" && (
        <div className="max-w-2xl space-y-6">
          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Step 1: Download Template</h3>
            <p className="text-xs text-muted-foreground mb-3">Download the sample CSV template with required column headers.</p>
            <Button variant="outline" size="sm" onClick={downloadTemplate}><Download className="h-3.5 w-3.5 mr-1.5" />Download CSV Template</Button>
          </div>
          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Step 2: Upload File</h3>
            <input type="file" accept=".csv" ref={fileRef} onChange={handleFile} className="hidden" />
            <div className="border-2 border-dashed border-border rounded-md p-10 text-center cursor-pointer" onClick={() => fileRef.current?.click()}>
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Click to select your CSV file</p>
              <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB</p>
            </div>
          </div>
          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Required Columns</h3>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              {["Case Number *", "Case Title *", "Court Name *", "Case Type *", "Filing Date *", "Mandal *", "Department *", "Priority", "Petitioner *", "Respondent *", "Assigned Officer", "Nature of Case", "Land Dispute (Y/N)", "Collectorate Involvement", "Subject", "Remarks"].map(c => <span key={c} className="py-1">{c}</span>)}
            </div>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-6">
          <div className="govt-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Validation Results</h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-status-success"><CheckCircle2 className="h-3.5 w-3.5" />{validCount} Valid</span>
                <span className="flex items-center gap-1 text-status-urgent"><AlertTriangle className="h-3.5 w-3.5" />{errorCount} Errors</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full govt-table">
                <thead><tr><th>#</th><th>Case Number</th><th>Title</th><th>Court</th><th>Type</th><th>Mandal</th><th>Filing Date</th><th>Status</th><th>Errors</th></tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className={r.status === "Error" ? "bg-status-urgent/5" : ""}>
                      <td className="text-xs">{i + 1}</td>
                      <td className="font-medium text-xs">{r.caseNumber || "-"}</td>
                      <td className="text-xs">{r.title || "-"}</td>
                      <td className="text-xs">{r.court || "-"}</td>
                      <td className="text-xs">{r.caseType || "-"}</td>
                      <td className="text-xs">{r.mandal || "-"}</td>
                      <td className="text-xs">{r.filingDate || "-"}</td>
                      <td><span className={`px-2 py-0.5 rounded text-xs font-medium ${r.status === "Valid" ? "bg-status-success/10 text-status-success" : "bg-status-urgent/10 text-status-urgent"}`}>{r.status}</span></td>
                      <td className="text-xs text-status-urgent">{r.errors.join("; ") || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleImport} disabled={validCount === 0}>Import {validCount} Valid Rows</Button>
            <Button variant="outline" onClick={() => { setStep("upload"); setRows([]); }}>Re-Upload</Button>
          </div>
        </div>
      )}

      {step === "summary" && (
        <div className="max-w-lg">
          <div className="govt-card p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-status-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Import Completed</h3>
            <div className="grid grid-cols-3 gap-4 text-center mt-6 mb-6">
              <div className="govt-card p-3"><p className="text-xl font-bold text-foreground">{rows.length}</p><p className="text-xs text-muted-foreground">Total Rows</p></div>
              <div className="govt-card p-3"><p className="text-xl font-bold text-status-success">{imported}</p><p className="text-xs text-muted-foreground">Imported</p></div>
              <div className="govt-card p-3"><p className="text-xl font-bold text-status-urgent">{skipped}</p><p className="text-xs text-muted-foreground">Skipped</p></div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={() => { setStep("upload"); setRows([]); }}>Upload More</Button>
              <Button size="sm" onClick={() => window.location.href = "/cases"}>View Cases</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
