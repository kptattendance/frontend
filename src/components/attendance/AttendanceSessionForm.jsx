"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import LoaderOverlay from "../LoaderOverlay";

export default function AttendanceSessionForm({ onCreated }) {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);

  // form state
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    subjectId: "",
    lecturerId: "",
    semester: "",
    department: "",
    room: "",
    notes: "",
  });

  const myRole = user?.publicMetadata?.role;
  const myDept = user?.publicMetadata?.department;

  // Lock department if user is HOD
  useEffect(() => {
    if (myRole === "hod" && myDept) {
      setForm((f) => ({ ...f, department: myDept }));
    }
  }, [myRole, myDept]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const [subRes, usersRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subjects/getsubjects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/getusers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSubjects(subRes.data.data || []);
        const allUsers = usersRes.data.data || [];
        setLecturers(allUsers.filter((u) => ["staff", "hod"].includes(u.role)));
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Failed to load subjects/lecturers");
      }
    };
    load();
  }, [getToken]);

  // load students once sem + dept are selected
  useEffect(() => {
    const loadStudents = async () => {
      if (!form.department || !form.semester) return;
      try {
        const token = await getToken();
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/students/getstudents?department=${form.department}&semester=${form.semester}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(res.data.data || []);
      } catch (err) {
        console.error("Error loading students:", err);
      }
    };
    loadStudents();
  }, [form.department, form.semester, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.date ||
      !form.startTime ||
      !form.endTime ||
      !form.subjectId ||
      !form.lecturerId ||
      !form.semester ||
      !form.department
    ) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const payload = {
        date: form.date,
        timeSlot: `${form.startTime}-${form.endTime}`,
        subjectId: form.subjectId,
        lecturerId: form.lecturerId,
        semester: Number(form.semester),
        department: form.department,
        room: form.room,
        notes: form.notes,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/attendance/sessions`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data?.message || "Session created ✅");
      setForm({
        date: "",
        startTime: "",
        endTime: "",
        subjectId: "",
        lecturerId: "",
        semester: "",
        department: myRole === "hod" ? myDept : "",
        room: "",
        notes: "",
      });
      if (onCreated) onCreated(res.data.data || res.data);
    } catch (err) {
      console.error("Error creating session:", err);
      toast.error(err.response?.data?.message || "Failed to create session ❌");
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    { value: "cs", label: "Computer Science" },
    { value: "ce", label: "Civil" },
    { value: "me", label: "Mechanical" },
    { value: "ec", label: "ECE" },
    { value: "eee", label: "EEE" },
    { value: "ch", label: "Chemical" },
    { value: "po", label: "Polymer" },
    { value: "at", label: "Automobile" },
    { value: "sc", label: "Science & English" },
  ];

  // Generate times 09:00 - 17:00
  const times = Array.from({ length: 9 }, (_, i) => {
    const hour = 9 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  return (
    <section className="bg-white p-4 rounded-lg shadow-sm">
      {loading && <LoaderOverlay message="Creating session..." />}
      <h3 className="text-lg font-semibold mb-3">Create Attendance Session</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Date dropdown */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded"
        />

        {/* Start time dropdown */}
        <select
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded"
        >
          <option value="">Start Time</option>
          {times.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* End time dropdown */}
        <select
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded"
        >
          <option value="">End Time</option>
          {times.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Subjects filtered by dept */}
        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded col-span-1 md:col-span-2"
        >
          <option value="">Select subject</option>
          {subjects
            .filter((s) => !form.department || s.department === form.department)
            .map((s) => (
              <option key={s._id} value={s._id}>
                {s.code} — {s.name} (Sem {s.semester})
              </option>
            ))}
        </select>

        {/* Lecturer */}
        <select
          name="lecturerId"
          value={form.lecturerId}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded"
        >
          <option value="">Select lecturer</option>
          {lecturers.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name} {l.department ? `(${l.department})` : ""}
            </option>
          ))}
        </select>

        {/* Semester */}
        <select
          name="semester"
          value={form.semester}
          onChange={handleChange}
          required
          className="border px-2 py-1 rounded"
        >
          <option value="">Semester</option>
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Department */}
        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          required
          disabled={myRole === "hod" && myDept && myDept !== "sc"}
          className="border px-2 py-1 rounded"
        >
          <option value="">Department</option>
          {departments.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>

        {/* Room */}
        <input
          name="room"
          value={form.room}
          onChange={handleChange}
          placeholder="Room / Location"
          className="border px-2 py-1 rounded md:col-span-2"
        />

        {/* Notes */}
        <input
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes (optional)"
          className="border px-2 py-1 rounded md:col-span-3"
        />

        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Session"}
          </button>
        </div>
      </form>
    </section>
  );
}
