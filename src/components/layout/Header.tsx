import Link from "next/link";
import { Shield } from "lucide-react";
import { MobileSidebar } from "./MobileSidebar";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md text-foreground shadow-sm transition-colors duration-[2500ms]">
      <div className="flex h-16 items-center px-4 md:px-6">
        <MobileSidebar />
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-primary font-bold tracking-tight">JSA OBSERVASI</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/admin" className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
