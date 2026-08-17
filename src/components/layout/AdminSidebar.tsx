import Link from "next/link";
import { LayoutDashboard, Briefcase, Car, Cloud, AlertTriangle, FileText, BookOpen } from "lucide-react";

export function AdminSidebarLinks({ onClick }: { onClick?: () => void }) {
  return (
    <nav className="grid items-start px-4 text-sm font-medium gap-2">
      <Link
        href="/admin"
        onClick={onClick}
        href="/admin"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
      <div className="mt-4 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Master Data
      </div>
      <Link
        href="/admin/type-pekerjaan"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
      >
        <Briefcase className="h-4 w-4" />
        Type Pekerjaan
      </Link>
      <Link
        href="/admin/jenis-unit"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
      >
        <Car className="h-4 w-4" />
        Jenis Unit
      </Link>
      <Link
        href="/admin/cuaca"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
      >
        <Cloud className="h-4 w-4" />
        Cuaca
      </Link>
      <Link
        href="/admin/kondisi"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
      >
        <AlertTriangle className="h-4 w-4" />
        Kondisi
      </Link>

      <div className="mt-4 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Templates
      </div>
      <Link
        href="/admin/templates"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary/80 hover:bg-primary/10 bg-primary/10"
      >
        <FileText className="h-4 w-4" />
        Template Observasi
      </Link>
      <Link
        href="/admin/batch-import"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        Batch Import
      </Link>
      
      <div className="mt-4 mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        SOP Analysis
      </div>
      <Link
        href="/admin/sop-templates"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted"
      >
        <BookOpen className="h-4 w-4" />
        SOP Template
      </Link>
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <div className="hidden md:block w-64 border-r border-border bg-card transition-colors duration-[2500ms] h-[calc(100vh-4rem)]">
      <div className="flex h-full flex-col">
        <div className="flex-1 py-4">
          <AdminSidebarLinks />
        </div>
      </div>
    </div>
  );
}
