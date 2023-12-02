import React from "react";

const Explore = () => {
  return (
    <div className="mb-16">
      <div className="mx-20 h-[500px] object-fill bg-no-repeat bg-cover bg-center bg-[url('https://i.gifer.com/embedded/download/7RN4.gif')]">
        <div className="w-full h-full px-5 flex flex-col flex-wrap justify-center items-center">
          <p className="py-3 text-xl md:text-2xl lg:text-3xl text-white">
            Can't decide where to go?
          </p>
          <h1 className="py-3 text-white text-4xl md:text-5xl lg:text-6xl font-bold">
            Explore every destination
          </h1>
          <button className="border-sky-900 border-2 my-5 hover:bg-white bg-sky-900 hover:text-sky-900 text-white font-bold py-2 px-4 rounded w-2/3 md:w-1/3"
          onClick={()=>{window.scrollTo({ top: 0, behavior: 'smooth' });}}
          >
            Search everywhere
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explore;
