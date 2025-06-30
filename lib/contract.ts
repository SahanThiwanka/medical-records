import { ethers } from "ethers";
import RecordABI from "./Record.json"; // make sure you have ABI here

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const CONTRACT_ADDRESS = "0x1640f626e7c6B8cE13A3b6DC35874C070856eCf6"; // Replace with your deployed contract address

export const getRecordContract = async () => {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found. Please install it.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, RecordABI.abi, signer);
  return contract;
};
