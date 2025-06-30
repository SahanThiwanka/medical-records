"use client";

import { useEffect, useState } from "react";
import { getRecordContract } from "@/lib/contract";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Stethoscope } from "lucide-react";

const Dashboard = () => {
  const [patientCount, setPatientCount] = useState<number | null>(null);
  const [doctorCount, setDoctorCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (!window.ethereum) throw new Error("MetaMask not found");

        const contract = await getRecordContract();
        const patients = await contract.getPatientCount();
        const doctors = await contract.getDoctorCount();

        setPatientCount(Number(patients));
        setDoctorCount(Number(doctors));
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      }
    };

    loadDashboard();
  }, []);

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const data = [
    { name: "Patients", count: patientCount || 0 },
    { name: "Doctors", count: doctorCount || 0 },
  ];

  const recentActivities = [
    "📝 New patient registered: 0x123...",
    "🩺 Doctor added medical record for patient 0xabc...",
    "📅 Appointment booked by patient 0xdef...",
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Registered Patients" value={patientCount} icon={<Users />} color="blue" />
        <Card title="Registered Doctors" value={doctorCount} icon={<Stethoscope />} color="green" />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Overview Chart</h2>
        <div className="h-64 bg-white dark:bg-gray-800 rounded shadow p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          {recentActivities.map((activity, index) => (
            <li
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow text-sm"
            >
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

const Card = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | null;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className={`bg-${color}-100 text-${color}-800 p-6 rounded-xl shadow hover:shadow-lg transition`}>
    <div className="flex items-center justify-between">
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-4xl">{icon}</div>
    </div>
    <div className="text-4xl mt-4 font-bold">{value !== null ? value : "..."}</div>
  </div>
);
