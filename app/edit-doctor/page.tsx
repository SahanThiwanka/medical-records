"use client";

import { useEffect, useState } from "react";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

const EditDoctorProfile = () => {
  const [form, setForm] = useState({
    ic: "",
    name: "",
    phone: "",
    gender: "",
    dob: "",
    qualification: "",
    major: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        if (!window.ethereum) {
          setMessage("Ethereum provider not found. Please install MetaMask.");
          return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const contract = await getRecordContract();
        const doctor = await contract.doctors(accounts[0]);

        setForm({
          ic: doctor.ic,
          name: doctor.name,
          phone: doctor.phone,
          gender: doctor.gender,
          dob: doctor.dob,
          qualification: doctor.qualification,
          major: doctor.major,
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load doctor profile.");
      }
    };

    loadDoctor();
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
      const tx = await contract.editDoctor(
        form.ic,
        form.name,
        form.phone,
        form.gender,
        form.dob,
        form.qualification,
        form.major
      );
      await tx.wait();
      setMessage("Doctor profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Doctor Profile</h1>
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

export default EditDoctorProfile;
