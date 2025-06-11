import React, { useEffect, useState } from 'react';
import { useParams, useLocation,useNavigate } from 'react-router-dom';
import { BrowserProvider, ethers } from 'ethers';
import abi from '../assets/LearnChain.json';
import address from '../assets/deployed_addresses.json';
import bg from '../assets/images/coursebg3.jpeg';

const LearnMore = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const signerAddress = location.state?.signerAddress;

  const [modules, setModules] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    async function loadModules() {
      if (!signerAddress || !window.ethereum) return;

      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(address['CourseModule1#LearnChain'], abi.abi, signer);

        const enrolled = await contract.isUserEnrolled(id, signerAddress);
        setIsEnrolled(enrolled);

        if (enrolled) {
          const fetchedModules = [];
          const completionStatus = [];

          for (let i = 0; ; i++) {
            try {
              const moduleData = await contract.getModule(id, i);
              const isCompleted = await contract.moduleCompleted(id, signerAddress, i);

              fetchedModules.push({
                content: moduleData[0],
                file: moduleData[1],
              });
              completionStatus[i] = isCompleted;
            } catch (err) {
              break;
            }
          }

          setModules(fetchedModules);
          setCompleted(completionStatus);

        }

        setLoading(false);
      } 
      catch (err) {
        setLoading(false);
      }
    }

    loadModules();
  }, [id, signerAddress]);

  const handleComplete = async (moduleIndex) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(address['CourseModule1#LearnChain'], abi.abi, signer);

      const tx = await contract.completeModule(id, moduleIndex);
      await tx.wait();

      setCompleted((prev) => ({ ...prev, [moduleIndex]: true }));
      alert(`Module ${moduleIndex + 1} completed! Token awarded.`);
    } 
    catch (err) {
      alert('Error completing module. Check console.');
    }
  };

  if (loading) return <p className="text-white p-6">Loading modules...</p>;

  if (!isEnrolled) {
    return (
      <div className="bg-fixed bg-cover min-h-screen" style={{ backgroundImage: `url(${bg})` }}>
        <h2 className="text-3xl font-bold text-white mb-4">Access Denied</h2>
        <p className="text-white">You are not enrolled in this course. Please enroll to access the content.</p>
      </div>
    );
  }

  return (
    <div className="bg-fixed bg-cover min-h-screen p-5" style={{ backgroundImage: `url(${bg})` }}>
       <button className="mb-6 px-4 py-2 bg-white text-indigo-800 rounded shadow hover:bg-gray-200 font-semibold" onClick={() => navigate('/viewallcourse', { state: { signerAddress } })}>
        Back to Courses
      </button>
      <h2 className="text-4xl font-bold mb-6 text-white">Modules</h2>

      {modules.length === 0 ? (
        <p>No modules found.</p>
      ) : (
        modules.map((mod, index) => (
          <div key={index} className="bg-white rounded-lg p-6 mb-[30px] h-[auto] shadow-md">
            <h3 className="text-2xl font-semibold mb-5 text-indigo-900 underline">Module {index + 1}</h3>
            <p className="text-lg mb-4"><strong>Content:</strong> {mod.content}</p>
            <p className="text-base mb-4">
              <strong>File:</strong>{' '}
              <a href={`https://gateway.pinata.cloud/ipfs/${mod.file}`} className="underline text-blue-700" target="_blank" rel="noopener noreferrer">
                View File
              </a>
            </p>
            <button className={`px-4 py-2 rounded text-white font-medium ${completed[index] ? 'bg-green-600 cursor-not-allowed' : 'bg-indigo-700 hover:bg-indigo-800'}`} disabled={completed[index]} onClick={() => handleComplete(index)}>
            {completed[index] ? 'Completed' : 'Mark as Complete'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default LearnMore;

