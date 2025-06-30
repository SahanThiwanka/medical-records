"use client";

import { useEffect, useState } from "react";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

const MakeAppointment = () => {
  const [patients, setPatients] = useState<string[]>([]);
  const [form, setForm] = useState({
    patientAddress: "",
    date: "",
    time: "",
    diagnosis: "",
    prescription: "",
    description: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        if (!window.ethereum) return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const contract = await getRecordContract();
        const addresses = await contract.getPatientList();
        setPatients(addresses);
      } catch (err) {
        console.error("Error fetching patient list", err);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!window.ethereum) {
        setMessage("Ethereum provider not found. Please install MetaMask.");
        setLoading(false);
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const contract = await getRecordContract();

      const tx = await contract.createAppointment(
        form.patientAddress,
        form.date,
        form.time,
        form.diagnosis,
        form.prescription,
        form.description,
        form.status
      );

      await tx.wait();
      setMessage("Appointment created successfully!");
      setForm({
        patientAddress: "",
        date: "",
        time: "",
        diagnosis: "",
        prescription: "",
        description: "",
        status: "Pending",
      });
    } catch (err) {
      console.error(err);
      setMessage("Failed to create appointment.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Make Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Patient Address</label>
          <select
            className="w-full border p-2 rounded"
            value={form.patientAddress}
            onChange={(e) => handleChange("patientAddress", e.target.value)}
          >
            <option value="">Select Patient</option>
            {patients.map((addr) => (
              <option key={addr} value={addr}>
                {addr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Time</label>
          <input
            type="time"
            className="w-full border p-2 rounded"
            value={form.time}
            onChange={(e) => handleChange("time", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Diagnosis</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={form.diagnosis}
            onChange={(e) => handleChange("diagnosis", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Prescription</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={2}
            value={form.prescription}
            onChange={(e) => handleChange("prescription", e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Appointment"}
        </button>

        {message && <p className="text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default MakeAppointment;
