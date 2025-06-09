"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-100 border border-red-300 text-red-800 shadow-sm mt-4">
      <AlertTriangle className="w-5 h-5 text-red-500" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}