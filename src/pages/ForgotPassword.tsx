import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">LCMS</h1>
            <p className="text-[10px] text-muted-foreground">Yadadri Bhuvanagiri District</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Forgot Password</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter your registered email to receive a reset link.</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <Label htmlFor="email">Registered Email</Label>
            <Input id="email" type="email" placeholder="officer@ybg.telangana.gov.in" className="h-10" />
          </div>
          <Button className="w-full h-10" type="submit">Send Reset Link</Button>
        </form>
        <div className="text-center">
          <Link to="/login" className="text-xs text-primary hover:underline">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
