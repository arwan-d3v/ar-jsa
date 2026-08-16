import Link from "next/link";
import { LayoutDashboard, Briefcase, Car, Cloud, AlertTriangle, FileText } from "lucide-react";

export function AdminSidebarLinks({ onClick }: { onClick?: () => void }) {
  return (
    <nav className="grid items-start px-4 text-sm font-medium gap-2">
      <Link
        href="/admin"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
      <div className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Master Data
      </div>
      <Link
        href="/admin/type-pekerjaan"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
      >
        <Briefcase className="h-4 w-4" />
        Type Pekerjaan
      </Link>
      <Link
        href="/admin/jenis-unit"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
      >
        <Car className="h-4 w-4" />
        Jenis Unit
      </Link>
      <Link
        href="/admin/cuaca"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
      >
        <Cloud className="h-4 w-4" />
        Cuaca
      </Link>
      <Link
        href="/admin/kondisi"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
      >
        <AlertTriangle className="h-4 w-4" />
        Kondisi
      </Link>

      <div className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Templates
      </div>
      <Link
        href="/admin/templates"
        onClick={onClick}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-teal-600 transition-all hover:text-teal-700 hover:bg-teal-50 bg-teal-50/50"
      >
        <FileText className="h-4 w-4" />
        Template Observasi
      </Link>
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <div className="hidden md:block w-64 border-r bg-white h-[calc(100vh-4rem)]">
      <div className="flex h-full flex-col">
        <div className="flex-1 py-4">
          <AdminSidebarLinks />
        </div>
      </div>
    </div>
  );
}
