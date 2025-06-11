import React, { useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { BrowserProvider, ethers } from 'ethers';
import abi from '../assets/LearnChain.json';
import address from '../assets/deployed_addresses.json';
import bg from '../assets/images/coursebg3.jpeg';

const Addcourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signerAddress = location.state?.signerAddress;

  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [price, setPrice] = useState('');
  const [overview, setOverview] = useState('');
  const [image, setImage] = useState('');
  const [educatorName, setEducatorName] = useState('');
  const [modules, setModules] = useState([{ content: '', file: '' }]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!window.ethereum || !signerAddress) {
      alert("MetaMask or signer address not found!");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(address['CourseModule1#LearnChain'], abi.abi, signer);

      const tx = await contract.addCourse(
        parseInt(courseId),
        courseName,
        overview,
        ethers.parseEther(price),
        image,
        educatorName,
        modules
      );

      await tx.wait();
      alert("Course added successfully!!!!");
      navigate('/viewallcourse')
      window.location.reload()
    } 
    catch (err) {
      console.error("Error adding course:", err);
      alert("Failed to add course. See console for details.");
    }
  }

  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...modules];
    updatedModules[index][field] = value;
    setModules(updatedModules);
  };

  const addNewModule = () => {
    setModules([...modules, { content: '', file: '' }]);
  };

  return (
    <div>
      <div className="bg-fixed bg-cover min-h-screen flex justify-center" style={{ backgroundImage: `url(${bg})` }}>
      <div className="absolute top-4 left-4">
        <button  onClick={() => navigate('/viewallcourse')}  className="bg-white text-indigo-950 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-200">
          Back
        </button>
      </div>
        <form onSubmit={handleSubmit} className="bg-white w-[500px] min-h-[850px] rounded-lg shadow-lg mt-[40px] p-4">
          <p className="text-3xl pt-[15px] text-center text-indigo-950 font-bold">Add Course</p>
          <div className="flex flex-col gap-3">
            <div className="pt-5">
              <label className="text-1xl font-bold">Course Name:</label>
              <input value={courseName} onChange={e => setCourseName(e.target.value)} type="text" className="hover:ring-2 hover:ring-indigo-400 rounded-sm border-2 border-indigo-400 w-full h-[40px]" required />
            </div>
            <div className="pt-5">
              <label className="text-1xl font-bold">Course ID:</label>
              <input value={courseId} onChange={e => setCourseId(e.target.value)} type="text" className="hover:ring-2 hover:ring-indigo-400 rounded-sm border-2 border-indigo-400 w-full h-[40px]" required />
            </div>
            <div className="pt-5">
              <label className="text-1xl font-bold">Price (ETH):</label>
              <input value={price} onChange={e => setPrice(e.target.value)} type="text" className="hover:ring-2 hover:ring-indigo-400 rounded-sm border-2 border-indigo-400 w-full h-[40px]" required />
            </div>
            <div className="pt-5">
                <label className="text-1xl font-bold">Educator Name:</label>
                <input value={educatorName} onChange={e => setEducatorName(e.target.value)} type="text" className="hover:ring-2 hover:ring-indigo-400 rounded-sm border-2 border-indigo-400 w-full h-[40px]" required/>
            </div>

            <div className="pt-5">
              <label className="text-1xl font-bold">Overview:</label>
              <input value={overview} onChange={e => setOverview(e.target.value)} type="text" className="hover:ring-2 hover:ring-indigo-400 rounded-sm border-2 border-indigo-400 w-full h-[80px]" required />
            </div>
            <div className="pt-5">
              <label className="text-1xl font-bold">Image URL:</label>
              <input value={image} onChange={e => setImage(e.target.value)} type="text" className="hover:ring-2 hover:ring-indigo-400 rounded-sm border-2 border-indigo-400 w-full h-[40px]" required />
            </div>

            <div className="pt-5">
              <label className="text-1xl font-bold">Modules:</label>
              {modules.map((mod, index) => (
                <div key={index} className="mt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Content"
                    value={mod.content}
                    onChange={e => handleModuleChange(index, 'content', e.target.value)}
                    className="w-full border-2 border-indigo-400 rounded-sm px-2 py-1"
                  />
                  <input
                    type="text"
                    placeholder="File (URL or description)"
                    value={mod.file}
                    onChange={e => handleModuleChange(index, 'file', e.target.value)}
                    className="w-full border-2 border-indigo-400 rounded-sm px-2 py-1"
                  />
                </div>
              ))}
              <button type="button" onClick={addNewModule} className="mt-2 bg-indigo-400 px-2 py-1 rounded text-sm">
                Add Another Module
              </button>
            </div>

            <div className="pt-7 flex justify-center">
              <button type="submit" className="bg-indigo-950 h-[40px] w-[150px] text-center text-white rounded-md">
                Submit Course
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Addcourse;
