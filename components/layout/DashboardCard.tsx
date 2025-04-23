"use client";

import { useState } from "react";

interface DashboardCardProps {
    title: string;
    // children: React.ReactNode;
    count: number;
}

export default function DashboardCard({title, count} : DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <h3 className="text-2xl font-bold">{count}</h3>
    </div>
  );
}
