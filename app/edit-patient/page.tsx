"use client";

import { useState, useEffect } from "react";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

const EditPatientProfile = () => {
  const [form, setForm] = useState({
    ic: "",
    name: "",
    phone: "",
    gender: "",
    dob: "",
    height: "",
    weight: "",
    houseaddr: "",
    bloodgroup: "",
    allergies: "",
    medication: "",
    emergencyName: "",
    emergencyContact: "",
    ipfsHash: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load current patient details
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!window.ethereum) {
          setMessage("Ethereum provider not found. Please install MetaMask.");
          return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const contract = await getRecordContract();
        const data = await contract.patients(accounts[0]);

        setForm({
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
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile.");
      }
    };

    loadProfile();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const contract = await getRecordContract();
      const tx = await contract.editPatient(
        form.ic,
        form.name,
        form.phone,
        form.gender,
        form.dob,
        form.height,
        form.weight,
        form.houseaddr,
        form.bloodgroup,
        form.allergies,
        form.medication,
        form.emergencyName,
        form.emergencyContact,
        form.ipfsHash
      );

      await tx.wait();
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong during update.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Patient Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className="block mb-1 capitalize">{key}</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
        {message && <p className="mt-4 text-green-600">{message}</p>}
      </form>
    </div>
  );
};

export default EditPatientProfile;
