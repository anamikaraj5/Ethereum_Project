import React, { useState } from 'react';
import bg from '../assets/images/coursebg3.jpeg';
import {BrowserProvider,Contract} from 'ethers'
import abi from '../assets/LearnChain.json'
import address from '../assets/deployed_addresses.json' 
import { useNavigate } from 'react-router-dom';

const AddEducator = () => {
  const navigate = useNavigate();
  const [educatorAddress, setEducatorAddress] = useState('');
  

  const handleAddEducator = async (e) => {
    e.preventDefault();
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner();
      const contract = new Contract(address['CourseModule1#LearnChain'],abi.abi,signer);
      const receipt = await contract.addEducator(educatorAddress);
      await receipt.wait();
      alert("Educator added successfully!");
      navigate('/')
    }
    catch (err) {
      console.error(err);
      alert("Failed to add educator. Only admin can do this.");
    }
  };

  return (
    <div className="bg-fixed bg-cover min-h-screen flex justify-center" style={{ backgroundImage: `url(${bg})` }}>
      <form className="bg-white w-[500px] h-[350px] rounded-lg shadow-lg mt-[100px]" onSubmit={handleAddEducator}>
        <p className="text-3xl pt-[20px] text-center text-indigo-950 font-bold">Add Educator</p>
        <div className="flex flex-col gap-3">
          <div className="pt-7 pl-7">
            <label className="text-1xl font-bold">Educator Wallet Address:</label>
            <input
              type="text"
              className="hover:ring-2 hover:ring-indigo-400 rounded-sm border-solid border-2 border-indigo-400 w-[430px] h-[40px]"
              required
              value={educatorAddress}
              onChange={(e) => setEducatorAddress(e.target.value)}
            />
          </div>
          <div className="pt-7 pl-7 pr-10 flex justify-center">
            <button type="submit" className="bg-indigo-950 h-[40px] w-[150px] text-center text-white rounded-md">
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEducator;
