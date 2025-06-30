import { ethers, Eip1193Provider } from "ethers";
import RecordABI from "./Record.json";

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export const CONTRACT_ADDRESS = "0x1640f626e7c6B8cE13A3b6DC35874C070856eCf6";

export const getRecordContract = async () => {
  if (!window.ethereum) {
    throw new Error("No crypto wallet found. Please install it.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, RecordABI.abi, signer);
  return contract;
};
