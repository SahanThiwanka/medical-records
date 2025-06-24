"use client";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white">
      <section className="w-full px-6 md:px-12 py-40 flex flex-col items-start justify-center text-left max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Medical Record System
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
          Ensure that your records are safe and sound. Powered by Ethereum
          blockchain for secure and decentralized access.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Go to Dashboard →
        </Link>
      </section>

      <section className="bg-gray-800 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Decentralized Health Records
            </h2>
            <p className="text-gray-300 mb-4">
              Blockchain provides a secure, transparent, and immutable platform
              for storing sensitive medical data and ensuring the integrity and
              privacy of patient information.
            </p>
            <p className="text-gray-400">
              This is a patient-based system where patients have the privilege
              to access their own health reports and information.
            </p>
          </div>
          <Image
            src="https://integrisok.com/-/media/Blog/19-April-May-June-July-Aug/Man-at-the-doctors-office.ashx?revision=ccc13a85-78b3-422e-bbc0-e82a7ad64e22"
            alt="doctor"
            width={600}
            height={400}
            className="rounded-lg shadow-lg w-full"
            unoptimized={true}
          />
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 bg-gray-900 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          “Easy to use, Reliable, Secure”
        </h3>
        <p className="text-gray-400">That is what they all say about us.</p>
      </section>

      <footer className="bg-black text-gray-400 py-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-2">About</h4>
            <ul className="space-y-1">
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Creator Info</a>
              </li>
              <li>
                <a href="#">Site Details</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Services</h4>
            <ul className="space-y-1">
              <li>
                <a href="#">Create Blockchain System</a>
              </li>
              <li>
                <a href="#">Store Medical Record</a>
              </li>
              <li>
                <a href="#">How to Access</a>
              </li>
              <li>
                <a href="#">How to Store</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Technology</h4>
            <p>Powered by Ethereum, IPFS, and Next.js</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
