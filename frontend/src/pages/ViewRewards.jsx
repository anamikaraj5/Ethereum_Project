import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserProvider, ethers } from 'ethers';
import abi from '../assets/LearnChain.json';
import address from '../assets/deployed_addresses.json';
import bg from '../assets/images/coursebg3.jpeg';

const ViewRewards = () => {
  const location = useLocation();
  const signerAddress = location.state?.signerAddress;
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!signerAddress || !window.ethereum) {
        alert("Wallet not connected");
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(address['CourseModule1#LearnChain'], abi.abi, signer);
        
        const bal = await contract.getTokenBalance(signerAddress);
        setBalance(ethers.formatUnits(bal, 18));
      } 
      catch (error) {
        console.error("Error fetching token balance:", error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchTokenBalance();
  }, [signerAddress]);

  return (
    <div className="bg-fixed bg-cover min-h-screen p-10 text-white" style={{ backgroundImage: `url(${bg})` }}>
      <h2 className="text-4xl font-bold mb-6">Your LearnToken Rewards</h2>
      {loading ? (
        <p>Loading your rewards...</p>
      ) : (
        <p className="text-2xl">You have <span className="text-green-300 font-bold">{balance}</span> Tokens</p>
      )}
    </div>
  );
};

export default ViewRewards;
