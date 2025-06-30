"use client";

import { useEffect, useState } from "react";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

type Appointment = {
  patientaddr: string;
  doctoraddr: string;
  date: string;
  time: string;
  diagnosis: string;
  prescription: string;
  description: string;
  status: string;
  creationDate: bigint;
};

export default function EditAppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [form, setForm] = useState({
    diagnosis: "",
    prescription: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("Ethereum provider not found. Please install MetaMask.");
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const contract = await getRecordContract();

        const patientList = await contract.getPatientList();
        const doctor = accounts[0];
        const filteredAppointments: Appointment[] = [];

        for (const patient of patientList) {
          const appts = await contract.getAppointments(patient);
          appts.forEach((appt: Appointment) => {
            if (appt.doctoraddr.toLowerCase() === doctor.toLowerCase()) {
              filteredAppointments.push(appt);
            }
          });
        }

        setAppointments(filteredAppointments);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdate = async () => {
    if (selectedIndex === null) return;

    const selectedAppointment = appointments[selectedIndex];
    setLoading(true);
    setMessage("");

    try {
      const contract = await getRecordContract();
      await contract.createAppointment(
        selectedAppointment.patientaddr,
        selectedAppointment.date,
        selectedAppointment.time,
        form.diagnosis,
        form.prescription,
        form.description,
        selectedAppointment.status
      );

      setMessage("Appointment updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Appointment</h1>

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <>
          <select
            className="w-full p-2 mb-4 border rounded"
            onChange={(e) => {
              const index = Number(e.target.value);
              setSelectedIndex(index);
              const selected = appointments[index];
              setForm({
                diagnosis: selected.diagnosis,
                prescription: selected.prescription,
                description: selected.description,
              });
            }}
          >
            <option value="">Select Appointment</option>
            {appointments.map((appt, i) => (
              <option key={i} value={i}>
                {`${appt.date} ${appt.time} | ${appt.patientaddr.slice(0, 10)}...`}
              </option>
            ))}
          </select>

          {selectedIndex !== null && (
            <>
              <div className="grid gap-4 mb-4">
                <div>
                  <label className="block mb-1">Diagnosis</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={form.diagnosis}
                    onChange={(e) => handleChange("diagnosis", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1">Prescription</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={form.prescription}
                    onChange={(e) => handleChange("prescription", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows={3}
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>
              </div>

              <button
                className="bg-blue-600 text-white px-6 py-2 rounded"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Appointment"}
              </button>
            </>
          )}

          {message && <p className="mt-4 text-green-600">{message}</p>}
        </>
      )}
    </div>
  );
}
