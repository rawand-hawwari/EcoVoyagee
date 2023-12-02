import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children, onClose }) => {
  const portalRoot = document.getElementById('portal-root');

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        {children}
        <button
          onClick={onClose}
          className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>,
    portalRoot
  );
};

export default Modal;
