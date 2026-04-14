import { useLocation, Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Briefcase, Scale, CalendarDays, Bell, BarChart3,
  Users, Shield, FileText, ClipboardList, Settings, User, Lock, LogOut,
  ChevronLeft, ChevronDown, ChevronRight, ShieldCheck, Gavel,
  Building2, MapPin, Landmark, FolderOpen, Archive, Clock, CheckCircle2, AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { departments, divisions } from "@/data/sampleData";

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Cases", icon: Briefcase, href: "/cases" },
  { label: "Fresh Cases", icon: FolderOpen, href: "/cases/fresh" },
  { label: "Ongoing Cases", icon: Clock, href: "/cases/ongoing" },
  { label: "Closed Archive", icon: Archive, href: "/cases/closed" },
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
  const navigate = useNavigate();
  const { permissions, logout } = useAuth();
  const { cases } = useData();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    main: true, admin: true, account: false, departments: false, divisions: false, collectorQuickAccess: false,
  });

  const toggleSection = (s: string) => setOpenSections(prev => ({ ...prev, [s]: !prev[s] }));

  const visibleItems = permissions?.visibleMenuItems || [];
  const filteredMain = mainNav.filter(i => visibleItems.includes(i.href));
  const filteredAdmin = adminNav.filter(i => visibleItems.includes(i.href));
  const showAdmin = permissions?.visibleSidebarSections.admin && filteredAdmin.length > 0;
  const showDepts = permissions?.visibleSidebarSections.departments;
  const showDivisions = permissions?.visibleSidebarSections.divisions;
  const showCollectorQA = permissions?.visibleSidebarSections.collectorQuickAccess;

  const handleLogout = () => { logout(); navigate("/login"); };

  // Dept case counts
  const deptCounts: Record<string, number> = {};
  departments.forEach(d => { deptCounts[d] = cases.filter(c => c.department === d).length; });

  // Division case counts
  const divCounts: Record<string, number> = {};
  Object.entries(divisions).forEach(([div, mandals]) => {
    divCounts[div] = cases.filter(c => mandals.includes(c.mandal)).length;
  });

  // Quick access counts
  const qaItems = [
    { label: "Collectorate as Respondent", icon: Landmark, count: cases.filter(c => c.collectorateInvolvement === "Collectorate as Respondent").length, href: "/cases?involvement=Collectorate+as+Respondent" },
    { label: "Co-Respondent", icon: Building2, count: cases.filter(c => c.collectorateInvolvement === "Collectorate as Co-Respondent").length, href: "/cases?involvement=Collectorate+as+Co-Respondent" },
    { label: "Counter Pending", icon: Clock, count: cases.filter(c => c.status === "Counter Pending").length, href: "/cases?status=Counter+Pending" },
    { label: "GP Approval Pending", icon: AlertTriangle, count: cases.filter(c => c.gpApprovalStatus === "Pending").length, href: "/cases?gpApproval=Pending" },
    { label: "Collector Approval", icon: CheckCircle2, count: cases.filter(c => c.collectorApprovalStatus === "Pending").length, href: "/cases?collectorApproval=Pending" },
    { label: "Compliance Pending", icon: ShieldCheck, count: cases.filter(c => c.complianceRequired && c.complianceStatus === "Pending").length, href: "/cases?compliance=pending" },
    { label: "Long Pending", icon: Clock, count: cases.filter(c => c.status !== "Closed" && (new Date().getTime() - new Date(c.filingDate).getTime()) / (1000*60*60*24) > 365).length, href: "/cases?longPending=true" },
    { label: "Closed Archive", icon: Archive, count: cases.filter(c => c.status === "Closed").length, href: "/cases/closed" },
  ];

  const NavItem = ({ item }: { item: typeof mainNav[0] }) => {
    const active = location.pathname === item.href ||
      (item.href !== "/" && location.pathname.startsWith(item.href));
    return (
      <Link to={item.href} className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )} title={collapsed ? item.label : undefined}>
        <item.icon className="h-4 w-4 flex-shrink-0" />
        {!collapsed && <span className="text-xs">{item.label}</span>}
      </Link>
    );
  };

  const SectionHeader = ({ label, section }: { label: string; section: string }) => (
    !collapsed ? (
      <button onClick={() => toggleSection(section)}
        className="sidebar-section-label flex items-center justify-between w-full hover:text-sidebar-foreground/70">
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
        {(collapsed || openSections.main) && filteredMain.map(item => <NavItem key={item.href} item={item} />)}

        {showAdmin && (
          <>
            <SectionHeader label="Administration" section="admin" />
            {(collapsed || openSections.admin) && filteredAdmin.map(item => <NavItem key={item.href} item={item} />)}
          </>
        )}

        {showCollectorQA && (
          <>
            <SectionHeader label="Collector Quick Access" section="collectorQuickAccess" />
            {(collapsed || openSections.collectorQuickAccess) && qaItems.map(item => (
              <Link key={item.label} to={item.href} className="flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground" title={collapsed ? item.label : undefined}>
                <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-[10px] flex-1 flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    <span className="ml-1 px-1.5 py-0 rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-[9px] font-semibold">{item.count}</span>
                  </span>
                )}
              </Link>
            ))}
          </>
        )}

        {showDepts && (
          <>
            <SectionHeader label="Departments" section="departments" />
            {(collapsed || openSections.departments) && departments.map(dept => (
              <Link key={dept} to={`/cases?department=${encodeURIComponent(dept)}`} className="flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground" title={collapsed ? dept : undefined}>
                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-[10px] flex-1 flex items-center justify-between">
                    <span className="truncate">{dept}</span>
                    <span className="ml-1 px-1.5 py-0 rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-[9px] font-semibold">{deptCounts[dept] || 0}</span>
                  </span>
                )}
              </Link>
            ))}
          </>
        )}

        {showDivisions && (
          <>
            <SectionHeader label="Divisions" section="divisions" />
            {(collapsed || openSections.divisions) && Object.keys(divisions).map(div => (
              <Link key={div} to={`/cases?division=${encodeURIComponent(div)}`} className="flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground" title={collapsed ? div : undefined}>
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-[10px] flex-1 flex items-center justify-between">
                    <span className="truncate">{div}</span>
                    <span className="ml-1 px-1.5 py-0 rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-[9px] font-semibold">{divCounts[div] || 0}</span>
                  </span>
                )}
              </Link>
            ))}
          </>
        )}

        <SectionHeader label="Account" section="account" />
        {(collapsed || openSections.account) && accountNav.map(item => <NavItem key={item.href} item={item} />)}
      </nav>

      <div className="p-2 border-t border-sidebar-border">
        <button onClick={onToggle} className="flex items-center justify-center w-full p-2 rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors">
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
        {!collapsed && (
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-md text-xs text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground mt-1 w-full">
            <LogOut className="h-4 w-4" /><span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
}
