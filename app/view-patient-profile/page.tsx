"use client";

import { useEffect, useState } from "react";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

type Patient = {
  ic: string;
  name: string;
  phone: string;
  gender: string;
  dob: string;
  height: string;
  weight: string;
  houseaddr: string;
  bloodgroup: string;
  allergies: string;
  medication: string;
  emergencyName: string;
  emergencyContact: string;
  ipfsHash: string;
  addr: string;
  date: string;
};

const ViewPatientProfile = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("MetaMask not found");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const user = accounts[0];
        setWallet(user);

        const contract = await getRecordContract();

        const isApproved = await contract.isApproved(user, user);
        if (!isApproved) {
          setError("You are not authorized to view this profile.");
          setLoading(false);
          return;
        }

        const data = await contract.patients(user);

        setPatient({
          ic: data.ic,
          name: data.name,
          phone: data.phone,
          gender: data.gender,
          dob: data.dob,
          height: data.height,
          weight: data.weight,
          houseaddr: data.houseaddr,
          bloodgroup: data.bloodgroup,
          allergies: data.allergies,
          medication: data.medication,
          emergencyName: data.emergencyName,
          emergencyContact: data.emergencyContact,
          ipfsHash: data.ipfsHash,
          addr: data.addr,
          date: new Date(Number(data.date) * 1000).toLocaleString(),
        });

        setLoading(false);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error loading patient profile.");
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Patient Profile</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(patient || {}).map(([key, value]) => (
          <div key={key} className="bg-gray-100 p-4 rounded shadow">
            <div className="text-gray-600 font-semibold capitalize">{key}</div>
            <div className="text-black">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPatientProfile;
