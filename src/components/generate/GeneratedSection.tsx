"use client";

import { ReactNode } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { CopyableField } from "./CopyableField";

interface Field {
  label: string;
  value: string | null;
}

interface GeneratedSectionProps {
  title: string;
  icon: ReactNode;
  fields: Field[];
  defaultOpen?: boolean;
}

export function GeneratedSection({ title, icon, fields, defaultOpen = true }: GeneratedSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-white hover:bg-gray-50/50 transition-colors [&[data-state=open]>div>svg.chevron]:rotate-180">
        <div className="flex items-center gap-3">
          <div className="text-teal-700">{icon}</div>
          <h2 className="font-semibold text-gray-800">{title}</h2>
        </div>
        <div>
          <ChevronDown className="chevron h-5 w-5 text-gray-500 transition-transform duration-200" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 pt-1 space-y-3">
        {fields.map((field, index) => (
          <CopyableField key={index} label={field.label} value={field.value || ""} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
