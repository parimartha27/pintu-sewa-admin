"use client";

import { Ban } from "lucide-react";

export default function NoContent() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh w-11/12 text-gray-500">
      <Ban className="w-40 h-40 mb-4 text-gray-400" />
      <p className="text-3xl font-medium">Data tidak ada</p>
    </div>
  );
}
