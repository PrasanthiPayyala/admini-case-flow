import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Briefcase, Scale, CalendarDays, Bell, BarChart3,
  Users, Shield, FileText, ClipboardList, Settings, User, Lock, LogOut,
  ChevronLeft, ChevronDown, ChevronRight, Upload, ShieldCheck, Gavel
} from "lucide-react";
import { useState } from "react";

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Cases", icon: Briefcase, href: "/cases" },
  { label: "Appeals", icon: Scale, href: "/appeals" },
  { label: "Hearings", icon: CalendarDays, href: "/hearings" },
  { label: "Court Liaison Updates", icon: Gavel, href: "/court-liaison" },
  { label: "Compliance Tracking", icon: ShieldCheck, href: "/compliance" },
  { label: "Alerts", icon: Bell, href: "/alerts" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
];

const adminNav = [
  { label: "Users", icon: Users, href: "/users" },
  { label: "Roles & Permissions", icon: Shield, href: "/roles" },
  { label: "Documents", icon: FileText, href: "/documents" },
  { label: "Audit Logs", icon: ClipboardList, href: "/audit-logs" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const accountNav = [
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Change Password", icon: Lock, href: "/change-password" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    main: true, admin: true, account: false
  });

  const toggleSection = (s: string) => setOpenSections(prev => ({ ...prev, [s]: !prev[s] }));

  const NavItem = ({ item }: { item: typeof mainNav[0] }) => {
    const active = location.pathname === item.href ||
      (item.href !== "/" && location.pathname.startsWith(item.href));
    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
        title={collapsed ? item.label : undefined}
      >
        <item.icon className="h-4 w-4 flex-shrink-0" />
        {!collapsed && <span className="text-xs">{item.label}</span>}
      </Link>
    );
  };

  const SectionHeader = ({ label, section }: { label: string; section: string }) => (
    !collapsed ? (
      <button
        onClick={() => toggleSection(section)}
        className="sidebar-section-label flex items-center justify-between w-full hover:text-sidebar-foreground/70"
      >
        {label}
        {openSections[section] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
    ) : <div className="border-t border-sidebar-border my-2 mx-3" />
  );

  return (
    <aside className={cn(
      "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-200 flex-shrink-0",
      collapsed ? "w-16" : "w-56"
    )}>
      <div className="p-3 border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-govt-gold/20 flex items-center justify-center">
              <Scale className="h-3.5 w-3.5 text-govt-gold" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-sidebar-primary leading-tight">LCMS</h2>
              <p className="text-[9px] text-sidebar-foreground/60 leading-tight">Yadadri Bhuvanagiri</p>
            </div>
          </div>
        ) : (
          <div className="w-7 h-7 rounded bg-govt-gold/20 flex items-center justify-center mx-auto">
            <Scale className="h-3.5 w-3.5 text-govt-gold" />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        <SectionHeader label="Main" section="main" />
        {(collapsed || openSections.main) && mainNav.map(item => <NavItem key={item.href} item={item} />)}
        <SectionHeader label="Administration" section="admin" />
        {(collapsed || openSections.admin) && adminNav.map(item => <NavItem key={item.href} item={item} />)}
        <SectionHeader label="Account" section="account" />
        {(collapsed || openSections.account) && accountNav.map(item => <NavItem key={item.href} item={item} />)}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <button onClick={onToggle} className="flex items-center justify-center w-full p-2 rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors">
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
        {!collapsed && (
          <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-md text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground mt-1">
            <LogOut className="h-4 w-4" /><span>Logout</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
