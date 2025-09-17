"use client";

import Navbar from "@/components/Navbar";

export default function StaffDashboard() {
  return (
    <div>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
        <ul className="space-y-3">
          <li className="p-4 bg-blue-100 rounded shadow">📋 Mark Attendance</li>
          <li className="p-4 bg-green-100 rounded shadow">
            📊 View Class Attendance
          </li>
          <li className="p-4 bg-yellow-100 rounded shadow">
            📝 Update Records
          </li>
        </ul>
      </main>
    </div>
  );
}
