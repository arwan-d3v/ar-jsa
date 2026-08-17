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
    <Collapsible defaultOpen={defaultOpen} className="glass-card rounded-2xl overflow-hidden transition-colors duration-[2500ms]">
      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-transparent hover:bg-muted/50 transition-colors [&[data-state=open]>div>svg.chevron]:rotate-180">
        <div className="flex items-center gap-3">
          <div className="text-primary">{icon}</div>
          <h2 className="font-semibold text-foreground">{title}</h2>
        </div>
        <div>
          <ChevronDown className="chevron h-5 w-5 text-muted-foreground transition-transform duration-200" />
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
