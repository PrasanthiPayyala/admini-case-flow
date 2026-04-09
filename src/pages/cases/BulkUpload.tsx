import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";

const sampleErrors = [
  { row: 3, field: "Court Name", error: "Value 'XYZ Court' not found in court master" },
  { row: 7, field: "Mandal", error: "Required field is empty" },
  { row: 12, field: "Filing Date", error: "Invalid date format. Use YYYY-MM-DD" },
];

const samplePreview = [
  { caseNumber: "WP 1234/2024", title: "Land Dispute - Bhongir", court: "Telangana High Court", caseType: "Land Dispute", mandal: "Bhongir", filingDate: "2024-04-01", status: "Valid" },
  { caseNumber: "OS 456/2024", title: "Service Matter - Alair", court: "District Court, Bhongir", caseType: "Service Matter", mandal: "Alair", filingDate: "2024-04-02", status: "Valid" },
  { caseNumber: "CC 789/2024", title: "Consumer Complaint", court: "XYZ Court", caseType: "Consumer Matter", mandal: "Raigir", filingDate: "2024-04-03", status: "Error" },
];

type Step = "upload" | "preview" | "summary";

export default function BulkUpload() {
  const [step, setStep] = useState<Step>("upload");

  return (
    <AppLayout>
      <PageHeader
        title="Bulk Upload Cases"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases", href: "/cases" }, { label: "Bulk Upload" }]}
      />

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { key: "upload", label: "1. Upload File" },
          { key: "preview", label: "2. Preview & Validate" },
          { key: "summary", label: "3. Import Summary" },
        ].map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div className={`px-3 py-1.5 rounded text-xs font-medium ${step === s.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {s.label}
            </div>
            {i < 2 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {step === "upload" && (
        <div className="max-w-2xl space-y-6">
          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Step 1: Download Template</h3>
            <p className="text-xs text-muted-foreground mb-3">Download the sample CSV/XLSX template with the required column headers. Fill in the case data and upload.</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1.5" />Download CSV Template</Button>
              <Button variant="outline" size="sm"><FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />Download XLSX Template</Button>
            </div>
          </div>

          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Step 2: Upload File</h3>
            <div className="border-2 border-dashed border-border rounded-md p-10 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Drag and drop your CSV or XLSX file here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse. Max file size: 5MB</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setStep("preview")}>Select File</Button>
            </div>
          </div>

          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Required Columns</h3>
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              {["Case Number *", "Case Title *", "Court Name *", "Case Type *", "Filing Date *", "Mandal *", "Department *", "Priority", "Petitioner *", "Respondent *", "Co-Respondent(s)", "Assigned Officer", "Nature of Case", "Land Dispute (Y/N)", "Collectorate Involvement", "Subject", "Remarks"].map(c => (
                <span key={c} className="py-1">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-6">
          <div className="govt-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Mapping Preview</h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-status-success"><CheckCircle2 className="h-3.5 w-3.5" />2 Valid Rows</span>
                <span className="flex items-center gap-1 text-status-urgent"><AlertTriangle className="h-3.5 w-3.5" />1 Error</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full govt-table">
                <thead>
                  <tr><th>Case Number</th><th>Title</th><th>Court</th><th>Case Type</th><th>Mandal</th><th>Filing Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {samplePreview.map((r, i) => (
                    <tr key={i} className={r.status === "Error" ? "bg-status-urgent/5" : ""}>
                      <td className="font-medium">{r.caseNumber}</td>
                      <td>{r.title}</td>
                      <td className="text-xs">{r.court}</td>
                      <td className="text-xs">{r.caseType}</td>
                      <td className="text-xs">{r.mandal}</td>
                      <td className="text-xs">{r.filingDate}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.status === "Valid" ? "bg-status-success/10 text-status-success" : "bg-status-urgent/10 text-status-urgent"}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="govt-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-status-urgent" />Validation Errors</h3>
            <table className="w-full govt-table">
              <thead>
                <tr><th>Row</th><th>Field</th><th>Error</th></tr>
              </thead>
              <tbody>
                {sampleErrors.map((e, i) => (
                  <tr key={i}>
                    <td className="font-medium">{e.row}</td>
                    <td className="text-xs">{e.field}</td>
                    <td className="text-xs text-status-urgent">{e.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setStep("summary")}>Confirm Import (2 valid rows)</Button>
            <Button variant="outline" onClick={() => setStep("upload")}>Re-Upload</Button>
          </div>
        </div>
      )}

      {step === "summary" && (
        <div className="max-w-lg">
          <div className="govt-card p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-status-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Import Completed</h3>
            <div className="grid grid-cols-3 gap-4 text-center mt-6 mb-6">
              <div className="govt-card p-3">
                <p className="text-xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Total Rows</p>
              </div>
              <div className="govt-card p-3">
                <p className="text-xl font-bold text-status-success">2</p>
                <p className="text-xs text-muted-foreground">Imported</p>
              </div>
              <div className="govt-card p-3">
                <p className="text-xl font-bold text-status-urgent">1</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">2 cases have been registered. 1 row was skipped due to validation errors.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={() => setStep("upload")}>Upload More</Button>
              <Button size="sm" onClick={() => window.location.href = "/cases"}>View Cases</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
