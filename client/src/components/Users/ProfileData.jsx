import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const ProfileData = () => {
  const [user, setUser] = useState([]);
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

  useEffect(() => {
    fetchData();
  }, [headers]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };
  const updateData = (e) => {
    if (userData || userData.length > 0) {
      axios.put("http://localhost:3999/updateUserData", userData, {
        headers: headers,
      });
      fetchData();
    }
  };
  return (
    <div>
      <div className="flex flex-col justify-center items-center w-full md:mt-5">
        <div className="w-full md:w-2/3 flex flex-col justify-center items-center gap-2">
          {/* update user name */}
          <label className="px-3 self-start">Name</label>
          <div className="flex w-full gap-5">
            <div className="relative w-full">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={
                  userData.length !== 0 ? userData.first_name : user.first_name
                }
                onChange={(e) => handleChange(e)}
                disabled={firstName}
                className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
              />
              <button
                type="button"
                onClick={(e) => setFirstName(!firstName)}
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
                  userData.length !== 0 ? userData.last_name : user.last_name
                }
                onChange={(e) => handleChange(e)}
                disabled={lastName}
                className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
              />
              <button
                type="button"
                onClick={(e) => setLastName(!lastName)}
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

          {/* update user country */}
          <label className="px-3 self-start">Country</label>
          <div className="relative w-full">
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={userData.length !== 0 ? userData.country : user.country}
              onChange={(e) => handleChange(e)}
              disabled={country}
              className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
            />
            <button
              type="button"
              onClick={(e) => setCountry(!country)}
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

          {/* update user email */}
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
              onClick={(e) => setEmail(!email)}
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

          {/* change password */}
          <div></div>

          <button
            onClick={(e) => updateData(e)}
            className="py-3 w-64 text-xl text-white hover:text-sky-900 bg-sky-900 border-2 hover:bg-white border-sky-900 rounded-2xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileData;
