"use client";

import { useEffect, useState } from "react";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

type Appointment = {
  date: string;
  time: string;
  description: string;
  prescription: string;
  diagnosis: string;
  status: string;
  doctoraddr: string;
  patientaddr: string;
};

export default function RecordsListPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [role, setRole] = useState<"doctor" | "patient" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contract = await getRecordContract();
        if (!window.ethereum) {
          throw new Error("No crypto wallet found. Please install MetaMask.");
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const current = accounts[0];

        const isPatient = await contract.isPatient(current);
        const isDoctor = await contract.isDoctor(current);

        if (isPatient) {
          setRole("patient");
          const patientAppointments = await contract.getAppointments(current);
          setAppointments(
            patientAppointments.map((a: Appointment) => ({
              ...a,
              date: a.date,
              time: a.time,
              description: a.description,
              prescription: a.prescription,
              diagnosis: a.diagnosis,
              status: a.status,
              doctoraddr: a.doctoraddr,
              patientaddr: a.patientaddr,
            }))
          );
        } else if (isDoctor) {
          setRole("doctor");

          const patientAddresses: string[] = await contract.getPatientList();
          const doctorAppointments: Appointment[] = [];

          for (const addr of patientAddresses) {
            const patientAppointments = await contract.getAppointments(addr);
            const related = patientAppointments.filter(
              (a: Appointment) =>
                a.doctoraddr.toLowerCase() === current.toLowerCase()
            );
            doctorAppointments.push(...related);
          }
          setAppointments(doctorAppointments);
        }
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {role === "patient"
          ? "My Appointments"
          : "Appointments with My Patients"}
      </h1>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((a, i) => (
            <div
              key={i}
              className="border border-gray-300 p-4 rounded-md shadow-sm bg-white dark:bg-gray-800"
            >
              <p className="text-sm text-gray-500">Date: {a.date}</p>
              <p className="text-sm text-gray-500">Time: {a.time}</p>
              <p className="text-sm text-gray-500">Status: {a.status}</p>
              <p className="text-sm text-gray-500">Diagnosis: {a.diagnosis}</p>
              <p className="text-sm text-gray-500">
                Prescription: {a.prescription}
              </p>
              <p className="text-sm text-gray-500">
                Description: {a.description}
              </p>
              {role === "doctor" && (
                <p className="text-xs text-gray-400">
                  Patient: {a.patientaddr}
                </p>
              )}
              {role === "patient" && (
                <p className="text-xs text-gray-400">Doctor: {a.doctoraddr}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
