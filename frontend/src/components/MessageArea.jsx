import React, { useEffect, useRef, useState } from 'react'
import { serverURL } from "../main.jsx"
// import logo from "/public/chat-icon.png"
import { IoReturnUpBack } from "react-icons/io5";
import dp from "../assets/dp.webp"
import useGetMessages from '../customHooks/GetMessages.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/user.slice';
import { BsEmojiGrin } from "react-icons/bs";
import { BsImage } from "react-icons/bs";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage.jsx';
import ReceiverMessage from './ReceiverMessage.jsx'
import axios from 'axios';
import { setMessages } from '../redux/messages.slice.js';
import ImageModal from './ImageModal.jsx';
import { incrementUnread } from '../redux/user.slice.js';



// import { getSocket } from "../socket/socket.js"; // ✅ correct



const MessageArea = () => {
  useGetMessages();
  let { selectedUser, userData, socket, onlineUsers } = useSelector(state => state.user);
  let dispatch = useDispatch();
  let [showPicker, setShowPicker] = useState(false);
  let [input, setInput] = useState("")
  let [frontendImage, setFrontendImage] = useState(null)
  let [backendImage, setBackendImage] = useState(null)
  let image = useRef()
  let { messages } = useSelector(state => state.message)
  const [showModal, setShowModal] = useState(false);
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() && !backendImage) {
      return; // Don't send anything
    }
    try {
      let formData = new FormData()
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage)
      }
      let result = await axios.post(`${serverURL}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true })
      dispatch(setMessages([...messages, result.data]))
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
    } catch (error) {
      console.log(error)
    }
  }
  const onEmojiClick = (emojiData) => {
    setInput(prevInput => prevInput + emojiData.emoji);
  }
  const handleImage = (e) => {
    let file = e?.target?.files?.[0]
    if (file) {
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }
  }

  useEffect(() => {
    socket?.on("newMessage", (mess) => {
      if (mess.sender === selectedUser?._id) {
        dispatch(setMessages([...messages, mess]));
      } else {
        dispatch(incrementUnread(mess.sender));
      }
    });

    return () => socket?.off("newMessage");
  }, [messages, selectedUser]);







  return (
    <div className={`lg:w-[70%]  ${selectedUser ? "flex" : "hidden"} lg:block w-full relative h-full bg-slate-300 border-l-2 border-gray-400`}>
      {selectedUser &&
        <div className='w-full h-[100vh] flex flex-col'>
          <div className='w-full h-[80px] bg-blue-400 rounded-b-[30px] shadow-gray-400 shadow-lg flex items-center px-[20px] gap-[20px]'>
            <IoReturnUpBack onClick={() => dispatch(setSelectedUser(null))} className='w-[30px] h-[40px] text-gray-300 cursor-pointer ' />
            <div className='relative w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center shadow-gray-500 shadow-lg cursor-pointer hover:scale-105 transition-transform'>
              <img
                src={selectedUser?.image || dp}
                alt=""
                className='w-full h-full object-cover rounded-full'
                onClick={() => setShowModal(true)}
              />
              {onlineUsers?.includes(selectedUser?._id) && (
                <span className='w-[13px] h-[13px] rounded-full bg-[#3aff20] absolute bottom-[3px] right-[2px]'></span>
              )}

            </div>


            <h1 className='font-serif text-[20px] text-gray-100'>{selectedUser?.name || "user"}</h1>

          </div>
          <div className='w-full h-[79%]  flex flex-col py-[20px] px-[20px] lg:px-[30px] overflow-auto gap-[20px] '>




            {showPicker && <div className='absolute bottom-[110px] left-[25px]'><EmojiPicker onEmojiClick={onEmojiClick} width={300} height={350} className='shadow-lg z-[100]' /></div>}

            {messages && messages
              .map((mess) => (
                mess.sender == userData._id ? <SenderMessage image={mess.image} message={mess.message} /> : <ReceiverMessage image={mess.image} message={mess.message} />

              ))}


          </div>
        </div>}
      {!selectedUser &&
        <div className='w-full h-full flex flex-col justify-center items-center'>
          <img src="/chat-icon.png" alt="logo" className='w-[100px] h-[100px] mb-[20px]' />
          <h1 className='text-zinc-500 font-semibold text-[30px]'>Welcome to</h1>
          <span className='text-blue-400 font-bold text-[40px]'>Chat <span className='text-[50px] font-mono'>ON</span></span>
        </div>
      }
      {selectedUser &&

        <div onClick={() => {
          if (showPicker) setShowPicker(false);
          if (frontendImage) setFrontendImage(null);
        }}
          className='w-full lg:w-[70%] h-[100px] fixed bottom-[15px] flex items-center justify-center '>
          <img src={frontendImage} alt="" className='w-[100px]  absolute bottom-[100px] right-[20%] rounded-lg shadow-gray-400 shadow-lg' />
          <form className='w-[95%] lg:w-[70%] h-[60px]  bg-[#1797c2] rounded-full shadow-gray-400 shadow-lg flex  items-center gap-[20px] p-[20px]' onSubmit={handleSendMessage}>

            <div onClick={() => setShowPicker(prev => !prev)}>
              <BsEmojiGrin className='w-[25px] h-[25px] text-black cursor-pointer' />
            </div>
            <input type="file" hidden accept='image/*' ref={image} onChange={handleImage} />
            <input type="text" onChange={(e) => setInput(e.target.value)} value={input} className='w-full h-full px-[5px] py-[13px] bg-transparent outline-none border-0 text-[19px] text-white placeholder-gray-300  ' placeholder="Message..." />
            <div onClick={() => image.current.click()}>
              <BsImage className='w-[25px] h-[25px] text-black cursor-pointer' />
            </div>
            <button type='submit'>
              <RiSendPlane2Fill className='w-[25px] h-[25px] text-black cursor-pointer' />
            </button>

          </form>
        </div>
      }
      {showModal && (
        <ImageModal imageUrl={selectedUser?.image || dp} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default MessageArea