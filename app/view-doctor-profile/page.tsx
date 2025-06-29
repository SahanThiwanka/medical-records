"use client";

import { useEffect, useState } from "react";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

type Doctor = {
  ic: string;
  name: string;
  phone: string;
  gender: string;
  dob: string;
  qualification: string;
  major: string;
  addr: string;
  date: string;
};

const ViewDoctorProfile = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        if (!window.ethereum) {
          throw new Error("MetaMask not found");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const user = accounts[0];

        const contract = await getRecordContract();

        const isDoctor = await contract.isDoctor(user);
        if (!isDoctor) {
          setError("You are not registered as a doctor.");
          setLoading(false);
          return;
        }

        const data = await contract.doctors(user);

        setDoctor({
          ic: data.ic,
          name: data.name,
          phone: data.phone,
          gender: data.gender,
          dob: data.dob,
          qualification: data.qualification,
          major: data.major,
          addr: data.addr,
          date: new Date(Number(data.date) * 1000).toLocaleString(),
        });

        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError("Unauthorized or unable to load doctor profile.");
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Doctor Profile</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(doctor || {}).map(([key, value]) => (
          <div key={key} className="bg-gray-100 p-4 rounded shadow">
            <div className="text-gray-600 font-semibold capitalize">{key}</div>
            <div className="text-black">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDoctorProfile;
