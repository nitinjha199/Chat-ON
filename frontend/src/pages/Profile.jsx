// React & necessary hooks
import React, { useRef, useState } from 'react'

// Icons
import { MdOutlineCameraAlt } from "react-icons/md"; // Camera icon
import { IoHomeOutline } from "react-icons/io5";     // Home icon

// Default profile image
import dp from "../assets/dp.webp"

// Redux setup
import { useDispatch, useSelector } from 'react-redux';

// Routing for navigation
import { useNavigate } from 'react-router-dom';

// Server URL (base API endpoint)
import { serverURL } from '../main';

// Redux action to set user data globally
import { setUserData } from '../redux/user.slice';

// Axios for making HTTP requests
import axios from 'axios';

const Profile = () => {

  // Get user data from Redux store
  let { userData } = useSelector(state => state.user)
  
  // Dispatch function to update Redux state
  let dispatch = useDispatch()

  // For page navigation
  let navigate = useNavigate();

  // Local state to manage name input
  let [name, setName] = useState(userData.name || "");

  // Show image in frontend
  let [frontendimage, setFrontendimage] = useState(userData.image || dp)

  // Store selected image file for backend upload
  let [backendimage, setBackendimage] = useState(null)

  // Ref to trigger hidden file input
  let image = useRef()

  // Show saving... while request is in progress
  let [saving, setSaving] = useState(false);

  // Handle file/image selection
  const handleimage = (e) => {
    let file = e.target.files[0]; // Get the selected file
    setBackendimage(file); // Store for backend upload
    setFrontendimage(URL.createObjectURL(file)); // Show preview
  }

  // Handle form submit - update profile
  const handleprofile = async (e) => {
    e.preventDefault(); // Prevent default form reload
    setSaving(true);    // Start loading

    try {
      // Create form data to send (file + text)
      let formData = new FormData();
      formData.append("name", name); // Add name to form
      if (backendimage) {
        formData.append("image", backendimage); // Add image if selected
      }

      // Send PUT request to update profile
      let result = await axios.put(`${serverURL}/api/user/profile`, formData, {
        withCredentials: true // send cookies
      });

      // Stop loading
      setSaving(false);

      // Update Redux user state with new data
      dispatch(setUserData(result.data));
      navigate("/")
    } catch (error) {
      console.log(error);
      setSaving(false); // Stop loading on error
    }
  }

  return (
    <div className='w-full h-[100vh] bg-slate-300 flex flex-col justify-center items-center gap-[20px]'>

      {/* Home button - navigate to homepage */}
      <div className='fixed top-[30px] left-[40px] cursor-pointer' onClick={() => navigate("/")}>
        <IoHomeOutline className='w-[40px] h-[40px] text-gray-600' />
      </div>

      {/* Profile image section (clickable to change) */}
      <div
        className='bg-white rounded-full border-4 border-[#20c7ff] shadow-gray-500 shadow-lg relative'
        onClick={() => image.current.click()} // open file input
      >
        {/* Image preview inside circular frame */}
        <div className='w-[200px] h-[200px] overflow-hidden rounded-full flex justify-center items-center'>
          <img src={frontendimage} alt="" className='h-[100%]' />
        </div>

        {/* Camera icon at bottom right */}
        <div className='absolute bottom-8 right-3 w-[30px] h-[30px] bg-[#20c7ff] rounded-full'>
        <MdOutlineCameraAlt className='h-full w-full text-gray-500' />
        </div>
      </div>

      {/* Profile form to update name/image */}
      <form onSubmit={handleprofile} className='w-[95%] max-w-[500px] flex flex-col gap-[20px] justify-center items-center'>

        {/* Hidden input to select image */}
        <input type="file" accept='image/*' ref={image} onChange={handleimage} hidden />

        {/* Input for name (editable) */}
        <div className='w-[90%] h-[50px] border-2 border-blue-400 rounded-lg shadow-gray-400 shadow-lg overflow-hidden relative'>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder='Enter your name'
            className='bg-[white]/50 h-full w-full outline-none px-[20px] py-[10px]'
          />
        </div>

        {/* Username (read-only) */}
        <input
          type="text"
          readOnly
          placeholder='username'
          className='text-gray-500 w-[90%] h-[50px] outline-none border-2 border-blue-400 px-[20px] py-[10px] bg-[white]/50 rounded-lg shadow-gray-400 shadow-lg'
          value={userData?.username}
        />

        {/* Email (read-only) */}
        <input
          type="email"
          readOnly
          placeholder='email'
          className='text-gray-500 w-[90%] h-[50px] outline-none border-2 border-blue-400 px-[20px] py-[10px] bg-[white]/50 rounded-lg shadow-gray-400 shadow-lg'
          value={userData?.email}
        />

        {/* Save profile button */}
        <button
          type='submit'
          className='px-[20px] py-[10px] bg-blue-400 shadow-gray-400 shadow-lg rounded-2xl mt-5 text-[20px] font-serif hover:shadow-inner'
          disabled={saving}
        >
          {saving ? "saving..." : "save profile"} {/* dynamic text */}
        </button>
      </form>
    </div>
  )
}

export default Profile
