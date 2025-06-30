"use client";

import { useState } from "react";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

const ApproveDoctorPage = () => {
  const [doctorAddress, setDoctorAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!window.ethereum) throw new Error("MetaMask not found");

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const contract = await getRecordContract();

      const tx = await contract.grantPermission(doctorAddress);
      await tx.wait();

      setMessage("Permission granted to the doctor successfully.");
      setDoctorAddress("");
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to grant permission. Make sure address is correct and try again.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Approve Doctor Access</h1>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter doctor's Ethereum address"
        value={doctorAddress}
        onChange={(e) => setDoctorAddress(e.target.value)}
      />
      <button
        onClick={handleApprove}
        disabled={loading || !doctorAddress}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Approving..." : "Grant Access"}
      </button>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default ApproveDoctorPage;
