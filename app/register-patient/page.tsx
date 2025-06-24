"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getRecordContract } from "@/lib/contract";

const RegisterPatient = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [form, setForm] = useState({
    ic: "",
    name: "",
    phone: "",
    gender: "",
    dob: "",
    height: "",
    weight: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    medication: "",
    emergencyName: "",
    emergencyContact: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Auto-connect wallet and set IC/address
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        setForm((prev) => ({ ...prev, ic: accounts[0] }));
      }
    };
    connectWallet();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const contract = await getRecordContract();

      const tx = await contract.registerPatient(
        form.ic,
        form.name,
        form.phone,
        form.gender,
        form.dob,
        form.height,
        form.weight,
        form.address,
        form.bloodGroup,
        form.allergies,
        form.medication,
        form.emergencyName,
        form.emergencyContact,
        "" // ipfsHash (optional for now)
      );

      await tx.wait();

      setMessage("✅ Patient registered successfully!");
      setForm({
        ic: walletAddress,
        name: "",
        phone: "",
        gender: "",
        dob: "",
        height: "",
        weight: "",
        address: "",
        bloodGroup: "",
        allergies: "",
        medication: "",
        emergencyName: "",
        emergencyContact: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Maybe already registered?");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Register Patient</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input label="Ethereum Address" value={form.ic} readOnly />

        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(v) => handleChange("name", v)}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(v) => handleChange("phone", v)}
          />
          <Select
            label="Gender"
            options={["Male", "Female", "Other"]}
            value={form.gender}
            onChange={(v) => handleChange("gender", v)}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Date of Birth"
            value={form.dob}
            onChange={(v) => handleChange("dob", v)}
          />
          <Input
            label="Height (cm)"
            value={form.height}
            onChange={(v) => handleChange("height", v)}
          />
          <Input
            label="Weight (kg)"
            value={form.weight}
            onChange={(v) => handleChange("weight", v)}
          />
        </div>

        <Textarea
          label="Address"
          value={form.address}
          onChange={(v) => handleChange("address", v)}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Blood Group"
            value={form.bloodGroup}
            onChange={(v) => handleChange("bloodGroup", v)}
          />
          <Select
            label="Allergies"
            options={["Food", "Medical", "Environmental", "Others"]}
            value={form.allergies}
            onChange={(v) => handleChange("allergies", v)}
          />
        </div>

        <Textarea
          label="Current Medications"
          value={form.medication}
          onChange={(v) => handleChange("medication", v)}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Emergency Contact Name"
            value={form.emergencyName}
            onChange={(v) => handleChange("emergencyName", v)}
          />
          <Input
            label="Emergency Contact Phone"
            value={form.emergencyContact}
            onChange={(v) => handleChange("emergencyContact", v)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Create Record"}
        </button>

        {message && (
          <p className="mt-4 text-green-600 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
};

export default RegisterPatient;


const Input = ({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
}) => (
  <div>
    <label className="block mb-1">{label}</label>
    <input
      type="text"
      className="w-full p-2 border rounded"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
    />
  </div>
);

const Textarea = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div>
    <label className="block mb-1">{label}</label>
    <textarea
      className="w-full p-2 border rounded"
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Select = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) => (
  <div>
    <label className="block mb-1">{label}</label>
    <select
      className="w-full p-2 border rounded"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
