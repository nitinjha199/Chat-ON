import React, { useEffect, useRef,useState } from 'react';
import dp from "../assets/dp.webp";
import { useSelector } from 'react-redux';
import ImageModal from './ImageModal.jsx'; 

const ReceiverMessage = ({ image, message, userData }) => {
  const scroll = useRef();
    const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  const handleImagescroll = () => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  };
  const {selectedUser}=useSelector(state=>state.user)
  return (
    <div className='flex items-end gap-[8px]'>
      {/* Receiver avatar */}
      <div className='w-[40px] h-[40px] overflow-hidden rounded-full bg-white flex justify-center items-center shadow-md'>
        <img
          src={selectedUser?.image || dp}
          alt="Receiver"
          className='w-full h-full object-cover'
          
        />
      </div>

      {/* Message Bubble */}
      <div
        ref={scroll}
        className='w-fit max-w-[500px] px-[20px] py-[10px] rounded-tl-none rounded-2xl text-white text-[20px] bg-[#20c7ff] shadow-gray-400 shadow-lg flex flex-col gap-[10px]'
      >
        {image && (
          <img
            src={image}
            onLoad={handleImagescroll}
            alt=""
            className='w-[150px] rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform'
            onClick={() => setShowModal(true)}
          />
        )}
        {message && <span>{message}</span>}
      </div>
      {/* ✅ Image Modal */}
            {showModal && (
              <ImageModal imageUrl={image} onClose={() => setShowModal(false)} />
            )}
    </div>
  );
};

export default ReceiverMessage;
