"use client";

import { useEffect, useState } from "react";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

const RevokeDoctorAccess = () => {
  const [doctorAddress, setDoctorAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.ethereum) {
      alert("MetaMask is not installed");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = await getRecordContract();

      const tx = await contract.revokePermission(doctorAddress);
      await tx.wait();

      setMessage("Access revoked successfully");
      setDoctorAddress("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to revoke access. Make sure the address is correct.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Revoke Doctor Access</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Doctor's Ethereum Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          {loading ? "Revoking..." : "Revoke Access"}
        </button>

        {message && (
          <p className="mt-4 text-green-600 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
};

export default RevokeDoctorAccess;
