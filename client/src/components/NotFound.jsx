import React from 'react';
import notFound from '../assests/Images/notFound.png';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <>
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="w-96">
          <img src={notFound} />
        </div>
        <div className="flex flex-col justify-center items-center gap-3">
          <h1 className="text-6xl text-sky-900 font-bold">404</h1>
          <h3 className="text-gray-800 font-bold text-2xl">
            Oops, Page Not Found
          </h3>
          <p className="text-gray-800">
            We suggest you go to Home page while we fix the problem!!
          </p>
          {/* <Link to="/" className="w-full md:w-auto"> */}
            <button onClick={(e)=>navigate(-1)} className="w-full md:w-auto border rounded-xl py-3 px-10 text-center border-sky-900 bg-sky-900 hover:bg-white text-white hover:text-sky-900 focus:outline-none">
              Go Back!
            </button>
          {/* </Link> */}
        </div>
      </div>
    </>
  )
}

export default NotFound
