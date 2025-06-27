import React from "react";

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-[90%] max-h-[90%] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-xl font-bold"
        >
          &times;
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-[70vh] rounded mb-3"
        />

        {/* Download Button */}
        {/* <a
          href={imageUrl}
          download
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Download Image
        </a> */}
      </div>
    </div>
  );
};

export default ImageModal;
