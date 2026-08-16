"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Shield } from "lucide-react";
import { AdminSidebarLinks } from "./AdminSidebar";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        render={<Button variant="ghost" size="icon" className="md:hidden text-white hover:text-teal-100 hover:bg-teal-800 mr-2 -ml-2" />}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col bg-white">
        <SheetHeader className="p-4 border-b flex items-start text-left">
            <SheetTitle className="flex items-center gap-2 font-semibold text-teal-800">
                <Shield className="h-6 w-6" />
                <span>JSA OBSERVASI</span>
            </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-4">
          <AdminSidebarLinks onClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
