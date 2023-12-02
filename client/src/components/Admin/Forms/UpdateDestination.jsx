import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePage } from "../../Context/SelectedPageContext";
import { Dropdown } from "flowbite-react";
import { useAuth } from "../../Context/AuthContext";
import Swal from "sweetalert2";

const UpdateDestination = ({ id }) => {
  const [formData, setFormData] = useState([]);
  const { onSelectedPage, page } = usePage();
  const [selected, setSelected] = useState("Select Type");
  const { headers } = useAuth();

  const dropdownStyles = {
    backgroundColor: "#ffffff",
    color: "#0369a1",
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3999/getDestinationsByID/${id}`)
      .then((response) => {
        // Handle the response data here
        setFormData(response.data[0]);
        setSelected(response.data[0]&&response.data[0].destinations_type);
        // setTypes(response.data.destinations_type);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        [name]: e.target.files,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleType = (type) => {
    if (type !== "Select Type") {
      setFormData({
        ...formData,
        destinations_type: type,
      });
    }
    setSelected(type);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = {
      title: formData.title,
      details: formData.details,
      location: formData.location,
      country: formData.country,
      destinations_type: formData.destinations_type,
    };
    axios
      .put(`http://localhost:3999/updateDestinations/${id}`, formDataToSend, {
        headers: headers,
      })
      .then((response) => {
        Swal.fire({
          title: "Success!",
          text: "Item has been updated.",
          icon: "success",
        });
        setFormData([]);
        onSelectedPage("dashboard");
      });
  };
  const handleClose = (e) => {
    e.preventDefault();
    setFormData([]);
    onSelectedPage("dashboard");
  };
  return (
    <div>
      <div className="flex flex-col justify-center top-64 items-center lg:ml-28 h-full w-auto">
        <div className="lg:w-2/3 w-full bg-gray-200 p-6 rounded shadow-lg h-auto m-6">
          <form action="" onSubmit={handleSubmit}>
            <div className="p-6 w-full">
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl text-sky-900 font-bold text-center mb-4 cursor-pointer">
                  Update destination
                </h1>
              </div>
              <div className="space-y-4">
                {/* image */}
                <div className="text-start">
                  <label
                    class="block mb-2 text-sm font-medium text-sky-900"
                    for="multiple_files"
                  >
                    Upload Image
                  </label>
                  <input
                    class="block w-full text-md file:bg-sky-900 file:hover:bg-white file:border-sky-900 file:text-white file:hover:text-sky-900  text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none file:py-2 file:px-4"
                    name="image"
                    onChange={(e) => handleChange(e)}
                    type="file"
                    multiple
                  />
                </div>

                {/* title */}
                <div className="text-start">
                  <label className="text-sm font-medium text-sky-900">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData && formData.title}
                    placeholder="Place Name"
                    onChange={(e) => handleChange(e)}
                    required
                    className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                  />
                </div>

                {/* overview */}
                <div className="text-start">
                  <label className="text-sm font-medium text-sky-900">
                    Overview
                  </label>
                  <textarea
                    name="activity_details"
                    rows="4"
                    value={formData && formData.details}
                    class="block p-2.5 w-full my-2 text-sm rounded-lg border border-[#0c4a6e69] outline-none"
                    placeholder="Enter a description or an overview about the place..."
                    required
                    onChange={(e) => handleChange(e)}
                  ></textarea>
                </div>

                {/* city */}
                <div className="text-start">
                  <label className="text-sm font-medium text-sky-900">
                    City
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="City"
                    value={formData && formData.location}
                    required
                    onChange={(e) => handleChange(e)}
                    className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                  />
                </div>

                {/* country */}
                <div className="text-start">
                  <label className="text-sm font-medium text-sky-900">
                    City
                  </label>
                  <input
                    type="text"
                    name="country"
                    placeholder="City"
                    value={formData && formData.country}
                    required
                    onChange={(e) => handleChange(e)}
                    className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                  />
                </div>

                {/* Type */}
                <div className="text-start">
                  <div className="my-2">
                    <label className="text-sm font-medium text-sky-900">
                      Type
                    </label>
                  </div>
                  <div>
                    <Dropdown
                      label={selected}
                      placement="right-start"
                      style={dropdownStyles}
                    >
                      <Dropdown.Item
                        onClick={() => {
                          handleType("Beach");
                        }}
                      >
                        Beach
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handleType("Mountain");
                        }}
                      >
                        Mountain
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handleType("Forest");
                        }}
                      >
                        Forest
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handleType("City");
                        }}
                      >
                        City
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                </div>
              </div>
              {/* buttons */}
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="mt-4 m-2 py-2 px-5 border-2 border-sky-900 bg-sky-900 hover:bg-white rounded-2xl text-white hover:text-sky-900"
                >
                  Update
                </button>
                <button
                  type="clear"
                  onClick={(e) => handleClose(e)}
                  className="mt-4 m-2 py-2 px-5 border-2 border-sky-900 text-sky-900 rounded-2xl hover:bg-white"
                >
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDestination;
