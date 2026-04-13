import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppRole, getPermissions, Permissions } from "@/lib/permissions";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: AppRole;
  department: string;
  mandal: string;
  password: string;
  status: "Active" | "Inactive";
  lastLogin: string;
}

const SEED_USERS: DemoUser[] = [
  { id: "USR/SA01", name: "System Administrator", email: "superadmin@lcms.local", mobile: "9000000001", role: "Super Admin", department: "Collectorate Legal Cell", mandal: "All", password: "demo123", status: "Active", lastLogin: "2026-04-13 09:00" },
  { id: "USR/AD01", name: "Admin User", email: "admin@lcms.local", mobile: "9000000002", role: "Admin", department: "Collectorate Legal Cell", mandal: "All", password: "demo123", status: "Active", lastLogin: "2026-04-13 07:30" },
  { id: "USR/DC01", name: "Sri. Pamela Satpathy, IAS", email: "collector@lcms.local", mobile: "9000000003", role: "District Collector", department: "Collectorate Legal Cell", mandal: "All", password: "demo123", status: "Active", lastLogin: "2026-04-13 09:15" },
  { id: "USR/DLO1", name: "K. Srinivas Rao", email: "legalofficer@lcms.local", mobile: "9000000004", role: "District Legal Officer", department: "Collectorate Legal Cell", mandal: "All", password: "demo123", status: "Active", lastLogin: "2026-04-13 10:30" },
  { id: "USR/HCR1", name: "P. Nagesh", email: "liaisonofficer@lcms.local", mobile: "9000000005", role: "High Court Representative Officer", department: "Collectorate Legal Cell", mandal: "All", password: "demo123", status: "Active", lastLogin: "2026-04-13 08:45" },
  { id: "USR/DNO1", name: "N. Lakshmi", email: "dept.revenue@lcms.local", mobile: "9000000006", role: "Department Nodal Officer", department: "Revenue Department", mandal: "All", password: "demo123", status: "Active", lastLogin: "2026-04-13 09:00" },
  { id: "USR/MLU1", name: "B. Suresh", email: "mandal.bhongir@lcms.local", mobile: "9000000007", role: "Mandal-Level User", department: "Tahsildar Office", mandal: "Bhongir", password: "demo123", status: "Active", lastLogin: "2026-04-13 11:00" },
  { id: "USR/DEO1", name: "M. Priya", email: "dataentry@lcms.local", mobile: "9000000008", role: "Data Entry Operator", department: "Collectorate Legal Cell", mandal: "Bhongir", password: "demo123", status: "Active", lastLogin: "2026-04-13 09:45" },
  { id: "USR/ROV1", name: "R. Venkat Reddy", email: "viewer@lcms.local", mobile: "9000000009", role: "Read-Only Viewer", department: "Collectorate Legal Cell", mandal: "All", password: "demo123", status: "Active", lastLogin: "2026-03-28 14:00" },
];

const USERS_KEY = "lcms_users";
const SESSION_KEY = "lcms_session";

function loadUsers(): DemoUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  return [...SEED_USERS];
}

function saveUsers(users: DemoUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

interface AuthContextType {
  currentUser: DemoUser | null;
  permissions: Permissions | null;
  users: DemoUser[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  addUser: (user: Omit<DemoUser, "id" | "lastLogin">) => DemoUser;
  updateUser: (id: string, data: Partial<DemoUser>) => void;
  resetPassword: (id: string, newPassword: string) => void;
  toggleUserStatus: (id: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<DemoUser[]>(loadUsers);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(() => {
    const sess = localStorage.getItem(SESSION_KEY);
    if (!sess) return null;
    const email = JSON.parse(sess);
    const allUsers = loadUsers();
    return allUsers.find(u => u.email === email) || null;
  });

  useEffect(() => { saveUsers(users); }, [users]);

  const login = (email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: "User not found. Check your email." };
    if (user.status === "Inactive") return { success: false, error: "Account is deactivated. Contact admin." };
    if (user.password !== password) return { success: false, error: "Invalid password." };
    const updated = users.map(u => u.id === user.id ? { ...u, lastLogin: new Date().toISOString().slice(0, 16).replace("T", " ") } : u);
    setUsers(updated);
    setCurrentUser({ ...user, lastLogin: new Date().toISOString().slice(0, 16).replace("T", " ") });
    localStorage.setItem(SESSION_KEY, JSON.stringify(user.email));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const addUser = (data: Omit<DemoUser, "id" | "lastLogin">) => {
    const id = `USR/${String(users.length + 1).padStart(3, "0")}`;
    const newUser: DemoUser = { ...data, id, lastLogin: "-" };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, data: Partial<DemoUser>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser?.id === id) setCurrentUser(prev => prev ? { ...prev, ...data } : prev);
  };

  const resetPassword = (id: string, newPassword: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, password: newPassword } : u));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
  };

  const permissions = currentUser ? getPermissions(currentUser.role) : null;

  return (
    <AuthContext.Provider value={{
      currentUser, permissions, users, login, logout,
      addUser, updateUser, resetPassword, toggleUserStatus,
      isAuthenticated: !!currentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
