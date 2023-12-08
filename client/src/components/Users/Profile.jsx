import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import ProfileData from "./ProfileData";
import BookingHistory from "./BookingHistory";

const Profile = () => {
  const [user, setUser] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [userData, setUserData] = useState([]);
  const [firstName, setFirstName] = useState(true);
  const [lastName, setLastName] = useState(true);
  const [country, setCountry] = useState(true);
  const [email, setEmail] = useState(true);
  const [password, setPassword] = useState(true);
  const { headers } = useAuth();

  const [activeTab, setActiveTab] = React.useState("Bookings");
  const data = [
    {
      label: "Profile",
      value: "profile",
      // element: <ProfileData></ProfileData>,
      element: "hey",
    },
    {
      label: "Flights",
      value: "flights",
      // element: <Profile></Profile>,
      element: "whatever",
    },
    {
      label: "Bookings",
      value: "bookings",
      // element: <BookingHistory></BookingHistory>,
      element: "hello",
    },
  ];

  // const [activeTab, setActiveTab] = useState('Dashboard');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // You can add additional logic here when a tab is clicked
  };

  async function fetchData() {
    await axios
      .get("http://localhost:3999/getUserId", { headers: headers })
      .then((response) => {
        setUser(response.data[0]);
        // setUserData(response.data[0]);
      });
  }
  const [previewSrc, setPreviewSrc] = useState("");

  const loadFile = (e) => {
    const input = e.target;
    const file = input.files[0];

    const output = document.getElementById("preview_img");
    if (file) {
      const imageUpdate = new FormData();
      setPreviewSrc(URL.createObjectURL(file));
      imageUpdate.append("image", file);
      axios.put("http://localhost:3999/updateUserData", imageUpdate, {
        headers: headers,
      });
    } else {
      setPreviewSrc(user.profileimage);
    }
    output.onload = function () {
      URL.revokeObjectURL(previewSrc); // free memory
    };
  };

  useEffect(() => {
    fetchData();
    axios
      .get("http://localhost:3999/getBookingOfUser", { headers: headers })
      .then((response) => {
        setBookings(response.data);
      });
    axios
      .get("http://localhost:3999/getFlightsOfUser", { headers: headers })
      .then((response) => {
        setFlights(response.data);
      });
  }, [headers]);

  return (
    <div>
      <div className="relative text-gray-900 py-20 px-0 w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1529718836725-f449d3a52881?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] ">
        <div class="w-full pt-4 pr-5 pb-6 pl-5 my-0 mx-auto space-y-5 sm:py-8 md:py-12 sm:space-y-8 md:space-y-16 max-w-7xl">
          <div class="flex flex-col items-center sm:px-5 md:flex-row">
            <div class="flex flex-col items-start justify-center w-full h-full pt-6 pr-0 pb-6 pl-0 mb-6 md:mb-0 ">
              <div class="flex flex-col items-start justify-center h-full space-y-3 transform md:pr-10 lg:pr-16 md:space-y-5"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[420px]"></div>
      <div className="flex bg-gray-100 justify-center z-0 absolute top-1/4 left-1/2 transform -translate-x-1/2 border border-solid p-6 md:p-8 w-3/4 rounded-3xl mb-40 h-[700px]">
        <div className="w-full h-full">
          {/* profile info */}
          <div className="flex flex-col md:flex-row gap-12 pb-4 justify-center items-center">
            <div className="shrink-0 flex flex-col justify-center items-center">
              <img
                id="preview_img"
                src={
                  previewSrc !== ""
                    ? previewSrc
                    : user && user.profileimage && user.profileimage
                }
                alt="Profile image"
                className="h-48 w-48 rounded-full object-cover"
              />
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input
                  type="file"
                  onChange={(e) => loadFile(e)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </label>
            </div>
            <div className="text-start w-1/2">
              <h1 className="text-2xl md:text-4xl">
                {user && user.first_name + " " + user.last_name}
              </h1>
              <p className="text-gray-700">
                {flights && flights.length} Flights{" "}
                {bookings && bookings.length} Bookings
              </p>
            </div>
          </div>

          {/* tab bar */}
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
              <li className="me-2">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "Profile"
                      ? "text-blue-600 border-blue-600"
                      : "hover:text-gray-600 hover:border-gray-300"
                  }`}
                  onClick={() => handleTabClick("Profile")}
                >
                  Profile
                </button>
              </li>
              <li className="me-2">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "Bookings"
                      ? "text-blue-600 border-blue-600"
                      : "hover:text-gray-600 hover:border-gray-300"
                  }`}
                  onClick={() => handleTabClick("Bookings")}
                >
                  Bookings
                </button>
              </li>
              <li className="me-2">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "Flights"
                      ? "text-blue-600 border-blue-600"
                      : "hover:text-gray-600 hover:border-gray-300"
                  }`}
                  onClick={() => handleTabClick("Flights")}
                >
                  Flights
                </button>
              </li>
            </ul>
          </div>

          {/* content */}
          <div className={`${activeTab === "Profile" ? "block" : "hidden"}`}>
            <ProfileData />
          </div>
          <div className={`${activeTab === "Bookings" ? "block" : "hidden"}`}>
          <BookingHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
