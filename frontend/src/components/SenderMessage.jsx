import React, { useRef, useEffect, useState } from 'react';
import dp from "../assets/dp.webp";
import { useSelector } from 'react-redux';
import ImageModal from './ImageModal.jsx'; // ✅ spelling "Modal" not "Model"

const SenderMessage = ({ image, message }) => {
  const scroll = useRef();
  const { userData } = useSelector(state => state.user);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  return (
    <>
      <div className="flex justify-end items-end gap-[8px]">
        {/* Message Bubble */}
        <div
          ref={scroll}
          className="relative w-fit max-w-[500px] px-[20px] py-[10px] rounded-tr-none rounded-2xl text-white text-[20px] bg-[#1797c2] shadow-gray-400 shadow-lg flex flex-col gap-[10px]"
        >
          {image && (
            <img
              src={image}
              alt=""
              className="w-[150px] rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowModal(true)}
            />
          )}
          {message && <span>{message}</span>}
        </div>

        {/* Sender Avatar */}
        <div className="w-[40px] h-[40px] overflow-hidden rounded-full bg-white flex justify-center items-center shadow-md">
          <img
            src={userData.image || dp}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ✅ Image Modal */}
      {showModal && (
        <ImageModal imageUrl={image} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default SenderMessage;
