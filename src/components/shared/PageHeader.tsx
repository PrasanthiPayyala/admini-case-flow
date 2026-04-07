import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <nav className="flex items-center text-xs text-muted-foreground mb-2">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center">
            {i > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
            {crumb.href ? (
              <Link to={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</Link>
            ) : (
              <span className="text-foreground font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
