import { useState } from "react";
import { Scale, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DEMO_GROUPS: { section: string; accounts: { email: string; role: string }[] }[] = [
  { section: "LEADERSHIP", accounts: [
    { email: "collector@lcms.local", role: "District Collector" },
    { email: "addlcollector.rev@lcms.local", role: "Addl Collector (Rev)" },
    { email: "addlcollector.lb@lcms.local", role: "Addl Collector (LB)" },
    { email: "ao@lcms.local", role: "Administrative Officer" },
  ]},
  { section: "LEGAL CELL", accounts: [
    { email: "legalofficer@lcms.local", role: "District Legal Officer" },
    { email: "liaisonofficer@lcms.local", role: "HC Representative" },
    { email: "sectionc@lcms.local", role: "Section C Officer" },
    { email: "sectiond@lcms.local", role: "Section D Officer" },
    { email: "sectione@lcms.local", role: "Section E Officer" },
    { email: "sectiong@lcms.local", role: "Section G Officer" },
  ]},
  { section: "DIVISIONS / RDO", accounts: [
    { email: "rdo.bhongir@lcms.local", role: "RDO Bhongir" },
    { email: "rdo.choutuppal@lcms.local", role: "RDO Choutuppal" },
  ]},
  { section: "DEPARTMENTS & MANDALS", accounts: [
    { email: "dept.revenue@lcms.local", role: "Dept Nodal Officer" },
    { email: "tahsildar.bhongir@lcms.local", role: "Tahsildar Bhongir" },
    { email: "tahsildar.choutuppal@lcms.local", role: "Tahsildar Choutuppal" },
    { email: "tahsildar.alair@lcms.local", role: "Tahsildar Alair" },
    { email: "tahsildar.yadagirigutta@lcms.local", role: "Tahsildar Yadagirigutta" },
  ]},
  { section: "SYSTEM", accounts: [
    { email: "superadmin@lcms.local", role: "Super Admin" },
    { email: "admin@lcms.local", role: "Admin" },
    { email: "dataentry@lcms.local", role: "Data Entry Operator" },
    { email: "viewer@lcms.local", role: "Read-Only Viewer" },
  ]},
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter email and password."); return; }
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        toast({ title: "Login successful", description: "Welcome to LCMS" });
        navigate("/");
      } else {
        setError(result.error || "Login failed.");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex w-2/5 bg-primary flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-govt-gold/20 flex items-center justify-center">
              <Scale className="h-6 w-6 text-govt-gold" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">Legal Cell Monitoring System</h1>
              <p className="text-xs text-primary-foreground/60">Government of Telangana</p>
            </div>
          </div>
          <div className="space-y-6 mt-16">
            <h2 className="text-2xl font-bold text-primary-foreground leading-tight">
              Yadadri Bhuvanagiri<br />District Collectorate
            </h2>
            <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-sm">
              Secure platform for managing legal cases, appeals, hearings, and administrative legal workflows across the district.
            </p>
            <div className="flex items-center gap-2 text-primary-foreground/50 text-xs">
              <Lock className="h-3 w-3" />
              <span>Secured with SSL encryption & role-based access</span>
            </div>
          </div>
          <div className="mt-10 bg-primary-foreground/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-primary-foreground/70 font-semibold tracking-wider">DEMO CREDENTIALS</p>
              <p className="text-[10px] text-govt-gold/80 font-mono">password: demo123</p>
            </div>
            <div className="max-h-[280px] overflow-y-auto pr-1 space-y-2.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-primary-foreground/20 [&::-webkit-scrollbar-thumb]:rounded">
              {DEMO_GROUPS.map(group => (
                <div key={group.section}>
                  <p className="text-[9px] text-govt-gold/70 font-semibold tracking-wider mb-1">{group.section}</p>
                  <div className="space-y-0.5">
                    {group.accounts.map(acc => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => setEmail(acc.email)}
                        className="w-full grid grid-cols-[1fr_auto] gap-2 items-center px-1.5 py-0.5 rounded hover:bg-primary-foreground/10 text-left transition-colors"
                        title="Click to fill email"
                      >
                        <span className="text-[10px] text-primary-foreground/70 font-mono truncate">{acc.email}</span>
                        <span className="text-[9px] text-primary-foreground/45 whitespace-nowrap">{acc.role}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-primary-foreground/40">
          © 2024 District Collectorate, Yadadri Bhuvanagiri. All rights reserved.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">LCMS</h1>
              <p className="text-[10px] text-muted-foreground">Yadadri Bhuvanagiri</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground">Sign In</h2>
            <p className="text-sm text-muted-foreground mt-1">Access the Legal Cell Monitoring System</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-xs">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Username / Email</Label>
              <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. admin@lcms.local" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="h-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button className="w-full h-10" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot Password?</Link>
            </div>
          </form>

          <div className="pt-4 border-t border-border">
            <p className="text-[10px] text-muted-foreground text-center">
              This is a restricted government system. Unauthorized access is prohibited and punishable under IT Act, 2000.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
