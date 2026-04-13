import { useState } from "react";
import { Scale, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
          <div className="mt-10 bg-primary-foreground/5 rounded-lg p-4">
            <p className="text-[10px] text-primary-foreground/60 font-semibold mb-2">DEMO CREDENTIALS</p>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-primary-foreground/50">
              <span>superadmin@lcms.local</span><span>demo123</span>
              <span>admin@lcms.local</span><span>demo123</span>
              <span>collector@lcms.local</span><span>demo123</span>
              <span>legalofficer@lcms.local</span><span>demo123</span>
              <span>liaisonofficer@lcms.local</span><span>demo123</span>
              <span>dataentry@lcms.local</span><span>demo123</span>
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
