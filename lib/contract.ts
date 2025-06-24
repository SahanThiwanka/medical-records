import { ethers } from "ethers";
import RecordABI from "./Record.json"; // make sure you have ABI here

export const CONTRACT_ADDRESS = "0x90f39f36B0F8419B782aC85DC16529ee061581D4"; // Replace with your deployed contract address

export const getRecordContract = async () => {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found. Please install it.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, RecordABI.abi, signer);
  return contract;
};
