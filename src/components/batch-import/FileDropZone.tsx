"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileType, Image as ImageIcon } from "lucide-react";
import { getAcceptedTypes } from "@/lib/file-utils";

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function FileDropZone({ onFilesSelected, disabled = false }: FileDropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: getAcceptedTypes(),
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300
        ${disabled ? "opacity-50 cursor-not-allowed border-border bg-muted/20" : "cursor-pointer"}
        ${isDragActive ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/30"}
        ${isDragReject ? "border-destructive bg-destructive/5" : ""}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <UploadCloud className={`h-8 w-8 transition-colors ${isDragActive ? "text-primary animate-bounce" : "text-primary/70"}`} />
      </div>
      
      <h3 className="mb-2 text-xl font-semibold text-foreground">
        {isDragActive ? "Drop file di sini..." : "Drag & drop file JSA"}
      </h3>
      
      <p className="mb-6 text-sm text-muted-foreground max-w-sm mx-auto">
        Atau klik untuk memilih file dari perangkat Anda.
      </p>

      <div className="flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground/80">
        <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border border-border shadow-sm">
          <FileType className="h-3.5 w-3.5" /> PDF
        </div>
        <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border border-border shadow-sm">
          <ImageIcon className="h-3.5 w-3.5" /> JPG / PNG / HEIC
        </div>
      </div>
      
      {isDragReject && (
        <div className="absolute inset-x-0 bottom-0 bg-destructive/10 py-2 text-xs font-medium text-destructive">
          Beberapa tipe file tidak didukung.
        </div>
      )}
    </div>
  );
}
