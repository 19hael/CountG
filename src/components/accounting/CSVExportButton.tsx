"use client";

import { Download } from "lucide-react";

interface CSVExportButtonProps {
  data: any[];
  filename?: string;
  label?: string;
}

export function CSVExportButton({ data, filename = "export.csv", label = "Exportar CSV" }: CSVExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // 1. Extract headers
    const headers = Object.keys(data[0]);
    
    // 2. Convert to CSV string
    const csvContent = [
      headers.join(","), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle strings with commas or quotes
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(",")
      )
    ].join("\n");

    // 3. Create Blob and Download Link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-[#11132b] border border-indigo-500/30 rounded-lg text-indigo-300 hover:bg-indigo-500/10 hover:text-white transition-colors text-sm font-medium"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
}
