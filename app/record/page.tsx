"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getRecordContract } from "@/lib/contract";
import { ethers } from "ethers";

const RecordDetailsPage = () => {
  const { address } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const contract = await getRecordContract();
        if (!window.ethereum) {
          setError("Ethereum provider not found. Please install MetaMask.");
          return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);

        const demo = await contract.searchPatientDemographic(address);
        const med = await contract.searchPatientMedical(address);
        const app = await contract.searchAppointment(address);

        const profilePic =
          demo[3] === "Male"
            ? "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
            : "https://cdn-icons-png.flaticon.com/512/3135/3135789.png";

        setData({
          ic: demo[0],
          name: demo[1],
          phone: demo[2],
          gender: demo[3],
          dob: demo[4],
          height: demo[5],
          weight: demo[6],
          houseaddr: med[0],
          bloodgroup: med[1],
          allergies: med[2],
          medication: med[3],
          emergencyName: med[4],
          emergencyContact: med[5],
          doctoraddr: app[0].includes("0x0000") ? "" : app[0],
          doctorname: app[1],
          date: app[2],
          time: app[3],
          diagnosis: app[4],
          prescription: app[5],
          description: app[6],
          status: app[7],
          profilePic,
        });
      } catch (err) {
        setError("You don't have permission to view this record.");
        router.push("/list");
      }
    };

    fetchDetails();
  }, [address]);

  if (!data) return <div className="p-10 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex flex-col items-center text-center">
        <img src={data.profilePic} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
        <h1 className="text-3xl font-semibold">{data.name}</h1>
        <p className="text-gray-500">{data.ic}</p>
      </div>

      <Section title="Emergency Contact">
        <TwoColumn label1="Name" value1={data.emergencyName} label2="Phone" value2={data.emergencyContact} />
      </Section>

      <Section title="Personal Details">
        <FourColumn
          items={[
            { label: "Full Name", value: data.name },
            { label: "Birthdate", value: data.dob },
            { label: "Height", value: `${data.height} cm` },
            { label: "Weight", value: `${data.weight} kg` },
          ]}
        />
        <SingleField label="Address" value={data.houseaddr} />
      </Section>

      <Section title="Medical Details">
        <TwoColumn label1="Blood Group" value1={data.bloodgroup} label2="Allergies" value2={data.allergies} />
        <SingleField label="Medications" value={data.medication} />
      </Section>

      <Section title="Appointment">
        <SingleField label="Doctor Address" value={data.doctoraddr} />
        <ThreeColumn
          items={[
            { label: "Doctor Name", value: data.doctorname },
            { label: "Date", value: data.date },
            { label: "Time", value: data.time },
          ]}
        />
        <TwoColumn label1="Prescription" value1={data.prescription} label2="Description" value2={data.description} />
        <TwoColumn label1="Diagnosis" value1={data.diagnosis} label2="Status" value2={data.status} />
      </Section>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default RecordDetailsPage;

// ========== COMPONENTS ==========

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-xl font-semibold mb-3 text-gray-700">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const TwoColumn = ({
  label1,
  value1,
  label2,
  value2,
}: {
  label1: string;
  value1: string;
  label2: string;
  value2: string;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field label={label1} value={value1} />
    <Field label={label2} value={value2} />
  </div>
);

const ThreeColumn = ({ items }: { items: { label: string; value: string }[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {items.map((item) => (
      <Field key={item.label} label={item.label} value={item.value} />
    ))}
  </div>
);

const FourColumn = ({ items }: { items: { label: string; value: string }[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {items.map((item) => (
      <Field key={item.label} label={item.label} value={item.value} />
    ))}
  </div>
);

const SingleField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);
