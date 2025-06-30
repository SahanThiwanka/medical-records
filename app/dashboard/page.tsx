"use client";

import { useEffect, useState } from "react";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

const Dashboard = () => {
  const [patientCount, setPatientCount] = useState<number | null>(null);
  const [doctorCount, setDoctorCount] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (!window.ethereum) throw new Error("MetaMask not found");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        accounts[0];

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">System Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Total Registered Patients" value={patientCount} color="blue" />
        <Card title="Total Registered Doctors" value={doctorCount} color="green" />
      </div>
    </div>
  );
};

export default Dashboard;

const Card = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number | null;
  color: string;
}) => (
  <div className={`bg-${color}-100 text-${color}-800 p-6 rounded shadow`}>
    <div className="text-xl font-semibold">{title}</div>
    <div className="text-3xl mt-2">{value !== null ? value : "..."}</div>
  </div>
);
