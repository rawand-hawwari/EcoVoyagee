import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

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
      // setPreviewSrc("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const updateData = (e) => {
    if (userData||userData.length>0) {
      axios.put("http://localhost:3999/updateUserData", userData, {
        headers: headers,
      });
      fetchData();
    }
  };
  return (
    <div>
      <div className="relative text-gray-900 py-20 px-0 w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1529718836725-f449d3a52881?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] ">
        <div class="w-full pt-4 pr-5 pb-6 pl-5 my-0 mx-auto space-y-5 sm:py-8 md:py-12 sm:space-y-8 md:space-y-16 max-w-7xl">
          <div class="flex flex-col items-center sm:px-5 md:flex-row">
            <div class="flex flex-col items-start justify-center w-full h-full pt-6 pr-0 pb-6 pl-0 mb-6 md:mb-0 ">
              <div
                class="flex flex-col items-start justify-center h-full space-y-3 transform md:pr-10 lg:pr-16 md:space-y-5"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[420px]"></div>
      <div className="flex bg-gray-100 justify-center absolute top-1/4 left-1/2 transform -translate-x-1/2 border border-solid p-6 md:p-8 w-3/4 rounded-3xl mb-40 h-[700px]">
        <div className="w-full h-full">
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
          <div className="flex flex-col justify-center items-center w-full md:mt-5">
            <div className="w-full md:w-2/3 flex flex-col justify-center items-center gap-2">
              <label className="px-3 self-start">Name</label>
              <div className="flex w-full gap-5">
                <div className="relative w-full">
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={
                      userData.length !== 0
                        ? userData.first_name
                        : user.first_name
                    }
                    onChange={(e) => handleChange(e)}
                    disabled={firstName}
                    className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      !firstName && updateData(e);
                      setFirstName(!firstName);
                    }}
                    className="absolute inset-y-0 end-0 flex items-center pe-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className={`w-6 h-6 ${!firstName && "text-sky-900"}`}
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                </div>
                <div className="relative w-full">
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={
                      userData.length !== 0
                        ? userData.last_name
                        : user.last_name
                    }
                    onChange={(e) => handleChange(e)}
                    disabled={lastName}
                    className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      !lastName && updateData(e);
                      setLastName(!lastName);
                    }}
                    className="absolute inset-y-0 end-0 flex items-center pe-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className={`w-6 h-6 ${!lastName && "text-sky-900"}`}
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <label className="px-3 self-start">Country</label>
              <div className="relative w-full">
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={
                    userData.length !== 0 ? userData.country : user.country
                  }
                  onChange={(e) => handleChange(e)}
                  disabled={country}
                  className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    !country && updateData(e);
                    setCountry(!country);
                  }}
                  className="absolute inset-y-0 end-0 flex items-center pe-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className={`w-6 h-6 ${!country && "text-sky-900"}`}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
              </div>
              <label className="px-3 self-start">Email Address</label>
              <div className="relative w-full">
                <input
                  type="text"
                  name="email"
                  placeholder="Email Address"
                  value={userData.length !== 0 ? userData.email : user.email}
                  onChange={(e) => handleChange(e)}
                  disabled={email}
                  className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    !email && updateData(e);
                    setEmail(!email);
                  }}
                  className="absolute inset-y-0 end-0 flex items-center pe-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className={`w-6 h-6 ${!email && "text-sky-900"}`}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
