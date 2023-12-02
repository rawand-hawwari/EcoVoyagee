import React from "react";

const Profile = () => {
  return (
    <div>
      <div class="relative text-gray-900 py-20 px-0 w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1529718836725-f449d3a52881?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
        <div class="w-full pt-4 pr-5 pb-6 pl-5 my-0 mx-auto space-y-5 sm:py-8 md:py-12 sm:space-y-8 md:space-y-16 max-w-7xl">
          <div class="flex flex-col items-center sm:px-5 md:flex-row">
            <div class="flex flex-col items-start justify-center w-full h-full pt-6 pr-0 pb-6 pl-0 mb-6 md:mb-0 ">
              <div
                class="flex flex-col items-start justify-center h-full space-y-3 transform md:pr-10 lg:pr-16
          md:space-y-5"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center absolute top-3/4 md:-bottom-1/2 -bottom-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-solid bg-white p-6 md:p-8 w-3/4 rounded-3xl mb-40">
        <div className="w-full">
          <div className="flex flex-col  pb-4">
            <div className="flex flex-row justify-between items-center border-b border-solid border-black bg-[#F7F1EE]">
              <div className="font-bold">Premium Membership</div>
              <div className="font-bold">$70.00</div>
            </div>

            <div className="flex flex-col justify-between  items-center pt-4 w-full">
              <div className="flex flex-row justify-between w-full items-center pt-4">
                <span className="font-bold">Start 1 Month</span>
                <span className="font-bold">Today</span>
              </div>
              <div className="flex flex-row justify-between w-full items-center pt-4">
                <span className="font-bold">Start billing date</span>
                <span className="font-bold">20/11/2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
