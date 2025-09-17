"use client";

import React from "react";

/**
 * DepartmentStats
 * Props:
 *  - dept (string) e.g. "Computer Science"
 *  - data (optional) — if you have API data pass it here
 */
export default function DepartmentStats({ dept = "Your Department", data }) {
  // fallback static data for demo; replace with API values later
  const stats = data || {
    totalStudents: 320,
    averageAttendance: 88,
    presentToday: 265,
    last7Days: [75, 80, 85, 90, 88, 87, 89],
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">
        {dept} — Department Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow">
          <div className="text-sm">Total Students</div>
          <div className="text-3xl font-extrabold mt-2">
            {stats.totalStudents}
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow">
          <div className="text-sm">Average Attendance</div>
          <div className="text-3xl font-extrabold mt-2">
            {stats.averageAttendance}%
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow">
          <div className="text-sm">Present Today</div>
          <div className="text-3xl font-extrabold mt-2">
            {stats.presentToday}
          </div>
        </div>
      </div>

      {/* Simple inline bar chart placeholder (pure CSS) */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-600 mb-2">
          Last 7 days attendance (sample)
        </div>
        <div className="flex items-end gap-2 h-32">
          {stats.last7Days.map((v, i) => (
            <div key={i} className="flex-1">
              <div
                className="mx-auto w-full rounded-t-md bg-blue-500"
                style={{ height: `${(v / 100) * 100}%` }}
              />
              <div className="text-xs text-center mt-1 text-gray-500">
                Day {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
