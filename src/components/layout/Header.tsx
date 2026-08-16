import Link from "next/link";
import { Shield } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-teal-700 text-white shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6" />
          <span>JSA OBSERVASI</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/admin" className="text-sm font-medium hover:underline underline-offset-4 text-teal-100 hover:text-white">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
