import React from 'react';
import ReactDOM from 'react-dom';

const BookFlightModal = ({ children, onClose }) => {
  const portalRoot = document.getElementById('root');

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 bg-opacity-50">
      <div className="bg-gray-100 p-6 rounded shadow-lg ">
        {children}
        <button
          onClick={onClose}
          className="mt-4 ml-3 p-2 bg-white hover:bg-gray-200 border text-sky-900 border-sky-900 md:text-lg rounded-lg shadow-md"
        >
          Close
        </button>
      </div>
    </div>,
    portalRoot
  );
};

export default BookFlightModal;
