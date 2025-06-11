import '../App.css'
import React from 'react';
import bg from '../assets/images/coursebg3.jpeg';
import students from '../assets/images/students2.jpg';
import { BrowserProvider, ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import abi from '../assets/LearnChain.json'
import address from '../assets/deployed_addresses.json' 


const Home = () => {
  const navigate = useNavigate();
  const provider = new BrowserProvider(window.ethereum);

  async function handleconnect() {
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    const contract = new ethers.Contract(address['CourseModule1#LearnChain'],abi.abi,signer);
    const adminAddress = await contract.admin();

    alert('Logged in successfully!!!');

    if (userAddress.toLowerCase() === adminAddress.toLowerCase()) {
      navigate('/addeducator', { state: { signerAddress: userAddress } });
    } 
    else {
      navigate('/viewallcourse');
    }
    
  } 
  
  

  return (
    <>
      <div className='flex justify-between items-center ml-[30px] mr-[30px] mt-[20px]'>
        <p className='text-4xl font-bold text-black'>LearnChain</p>
        <input type="button" value='Login' className='text-xl bg-indigo-900 text-white font-bold rounded-md px-4 py-2' onClick={handleconnect}/>
      </div>

      <div
        className="bg-fixed bg-cover h-[460px] mt-[40px] mx-[30px] rounded-lg shadow-lg flex items-center pl-10"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="flex flex-row justify-between items-center gap-10 w-full">

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-white">Learn skills. Earn tokens.</h1>
            <p className="text-lg text-white max-w-md">
              "Learn valuable skills at your own pace, complete modules to show your progress, and earn tokens that reflect your effort and achievements."
            </p>
          </div>

          <div className="flex justify-end">
            <img src={students} alt="Students" className="h-[460px]  object-cover" />
          </div>
        </div>
      </div>

      <div className="text-center mt-[60px] px-4">
  <p className="text-4xl font-bold mb-10 text-black">Features</p>
  
  <div className="flex flex-col md:flex-row justify-center gap-10 max-w-6xl mx-auto">

    <div className="bg-indigo-200 shadow-lg rounded-lg p-6 text-left ">
      <p className="text-2xl font-bold mb-2 text-indigo-900">Learn New Skills</p>
      <p className="text-gray-600">Discover a wide range of courses tailored to your interests and goals.</p>
    </div>

    <div className="bg-indigo-200 shadow-lg rounded-lg p-6 text-left">
      <p className="text-2xl font-bold mb-2 text-indigo-900">Earn Rewards</p>
      <p className="text-gray-600">Complete modules and earn tokens as a symbol of your progress.</p>
    </div>

    <div className="bg-indigo-200 shadow-lg rounded-lg p-6 text-left ">
      <p className="text-2xl font-bold mb-2 text-indigo-900">Learn from Trusted Educators</p>
      <p className="text-gray-600">Gain knowledge from verified experts dedicated to your success.</p>
    </div>
  </div>
</div>

    </>
  );
};

export default Home;
