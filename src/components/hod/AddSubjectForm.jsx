"use client";

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import SubjectTable from "./SubjectTable";
import LoaderOverlay from "../LoaderOverlay";

export default function SubjectForm() {
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    code: "",
    name: "",
    semester: "",
  });

  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 🔑 triggers SubjectTable reload

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = await getToken();

      const payload = {
        code: form.code.toUpperCase(),
        name: form.name.toUpperCase(),
        semester: form.semester,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subjects/addsubject`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data?.message || "✅ Subject added");
      setForm({ code: "", name: "", semester: "" });

      // 🔄 refresh table
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      console.error("Error adding subject:", err);
      toast.error(err.response?.data?.message || "❌ Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoaderOverlay message="Adding Subject..." />}

      <form
        onSubmit={handleSubmit}
        className="p-4 rounded-lg shadow-sm mb-6 bg-white text-sm"
      >
        <h2 className="text-lg font-semibold mb-3">Add Subject</h2>

        <div className="grid md:grid-cols-3 gap-3">
          <input
            type="text"
            name="code"
            placeholder="Subject Code"
            value={form.code}
            onChange={handleChange}
            required
            disabled={loading}
            className="border p-2 rounded disabled:bg-gray-100"
          />
          <input
            type="text"
            name="name"
            placeholder="Subject Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="border p-2 rounded disabled:bg-gray-100"
          />
          <select
            name="semester"
            value={form.semester}
            onChange={handleChange}
            required
            disabled={loading}
            className="border p-2 rounded disabled:bg-gray-100"
          >
            <option value="">Select Semester</option>
            {[1, 2, 3, 4, 5, 6].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Add Subject
        </button>
      </form>

      <SubjectTable refreshKey={refreshKey} />
    </>
  );
}
