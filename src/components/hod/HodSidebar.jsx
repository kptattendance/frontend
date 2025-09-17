"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  BarChart2,
  UserPlus,
  Users,
  BookOpen,
  Calendar,
  Settings,
} from "lucide-react";

export default function HodSidebar({ selected, setSelected }) {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [hodInfo, setHodInfo] = useState(null);

  // ✅ Fetch HOD details from backend
  useEffect(() => {
    const fetchHodDetails = async () => {
      try {
        if (!user?.id) return;
        const token = await getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/getuser/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHodInfo(res.data.data); // API should return { data: { name, email, phone, department, imageUrl } }
      } catch (err) {
        console.error("Error fetching HOD details:", err);
      }
    };

    fetchHodDetails();
  }, [user, getToken]);

  const menu = [
    { id: "stats", label: "Department Stats", Icon: BarChart2 },
    { id: "add-staff", label: "Add Staff", Icon: UserPlus },
    { id: "add-student", label: "Add Students", Icon: Users },
    { id: "list-student", label: "Students List", Icon: Users },
    { id: "add-subject", label: "Add Subject", Icon: BookOpen },
    { id: "timetable", label: "Timetable", Icon: Calendar },
    { id: "settings", label: "Settings", Icon: Settings },
  ];

  return (
    <aside className="h-full p-4 bg-white rounded-2xl shadow flex flex-col gap-4">
      {/* ✅ HOD Profile Section */}
      {hodInfo ? (
        <div className="text-center border-b pb-4">
          <p className="mt-2 text-blue-600 font-medium">
            👋 Welcome to HOD Page
          </p>
          <img
            src={hodInfo.imageUrl || "/default-avatar.png"}
            alt={hodInfo.name}
            className="w-20 h-20 rounded-full mx-auto object-cover"
          />
          <h2 className="mt-2 text-lg font-semibold">{hodInfo.name}</h2>
          {/* <p className="text-sm text-gray-600 uppercase">
            {hodInfo.department}
          </p> */}
          <p className="text-sm text-gray-500">{hodInfo.phone}</p>
          <p className="text-sm text-gray-500 break-words">{hodInfo.email}</p>
        </div>
      ) : (
        <div className="text-center text-gray-500 border-b pb-4">
          Loading profile...
        </div>
      )}

      {/* ✅ Sidebar Menu */}
      <nav className="space-y-1 flex-1">
        {menu.map((m) => {
          const active = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md transition
                ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <m.Icon className="w-5 h-5" />
              <span className="font-small">{m.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
