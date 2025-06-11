import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BrowserProvider, ethers } from 'ethers';
import bg from '../assets/images/coursebg3.jpeg';
import abi from '../assets/LearnChain.json';
import address from '../assets/deployed_addresses.json';

const ViewAll = () => {
  const navigate = useNavigate();
  const [isEducator, setIsEducator] = useState(false);
  const [courses, setCourses] = useState([]);
  const [signerAddress, setSignerAddress] = useState('');


  useEffect(() => {
    async function checkEducator() {
      if (!window.ethereum) return;
  
      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const currentAddress = await signer.getAddress();  
  
        setSignerAddress(currentAddress); 
       
        const contract = new ethers.Contract(address['CourseModule1#LearnChain'], abi.abi, signer);
        const isEdu = await contract.isEducator(currentAddress);
        setIsEducator(isEdu === true);
  
        const allCourses = await contract.getAllCourses();
        setCourses(allCourses);
  
      } catch (err) {
        console.error("Error checking educator status:", err);
        setIsEducator(false);
      }
    }
  
    checkEducator();
  }, []);
  

  const handleAddCourseClick = () => {
    navigate('/addcourse', { state: { signerAddress } });
  };


  const handleEnroll = async (courseId, priceInWei) => {
    if (!signerAddress || !window.ethereum) {
      alert("Wallet not connected");
      return;
    }
  
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(address['CourseModule1#LearnChain'], abi.abi, signer);
  
      const tx = await contract.enroll(courseId, {
        value: priceInWei  
      });
  
      await tx.wait();
      alert("Enrolled successfully!!!!");
    } 
    catch (err) {
      alert("Enrollment failed...");
    }
  };
  




  return (
    <div className="bg-fixed bg-cover min-h-screen" style={{ backgroundImage: `url(${bg})` }}>

      <div className="absolute top-4 right-4">
        <button 
          onClick={() => navigate('/')} 
          className="bg-white text-indigo-950 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-200"
        >
          Home
        </button>
      </div>
     <div className="p-6">
     <div>
     <p className="text-4xl font-bold mb-[40px] text-white">Courses Available</p>
         </div>
     

      {isEducator ? (
        <input
          type="button"
          value="Add Course"
          onClick={handleAddCourseClick}
          className="px-4 py-2 bg-white text-indigo-950 font-semibold rounded-md"
        />
      ) : (
        <input
          type="button"
          value="View Rewards"
          onClick={() => navigate('/viewrewards', { state: { signerAddress } })}
          className="px-4 py-2 bg-white text-indigo-950 font-semibold rounded-md"
        />
      )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {courses.map((course, index) => (
              <div key={index} className="bg-indigo-200 rounded-lg shadow-md p-4">
                <h2 className="text-3xl font-bold mt-2 mb-4">{course.coursename} , {course.educatorname}</h2>
                <img src={`https://gateway.pinata.cloud/ipfs/${course.image}`} alt={course.courseName} className="w-full h-48 object-cover rounded"/>
                <p className="text-md  mt-1">{course.overview}</p>
                <p className="text-sm  font-semibold text-gray-800 mt-1">Price : {ethers.formatEther(course.price)} ETH</p>
                <div className='flex gap-5'>
                  <button className="mt-3 bg-indigo-800 text-white px-3 py-1 rounded-md hover:bg-indigo-700" onClick={() => handleEnroll(course.id, course.price)}>Enroll Now</button>
                  <button className="mt-3 bg-indigo-800 text-white px-3 py-1 rounded-md hover:bg-indigo-700" onClick={() => navigate(`/learnmore/${course.id}`, { state: { signerAddress } })}>Learn More</button>
                </div>

              </div>
            ))}
      </div>

    </div>
    </div>
  );
};

export default ViewAll;
