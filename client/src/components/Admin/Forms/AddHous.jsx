import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePage } from "../../Context/SelectedPageContext";
import { Dropdown } from "flowbite-react";
import { Checkbox, Label } from "flowbite-react";
import Swal from "sweetalert2";
import { useAuth } from "../../Context/AuthContext";

const AddHouse = () => {
  const [formData, setFormData] = useState([]);
  const { onSelectedPage, page } = usePage();
  const [selected, setSelected] = useState("Select rating");
  const [selectedType, setSelectedType] = useState("inside");
  const [isPool, setIsPool] = useState(false);
  const [isFreeWifi, setIsFreeWifi] = useState(false);
  const [isParking, setParking] = useState(false);
  const {headers} = useAuth();
  

  const dropdownStyles = {
    backgroundColor: "#ffffff",
    color: "#0369a1",
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const amenities = [];
    if(isPool){
      amenities.push("Pool");
    }
    if(isFreeWifi){
      amenities.push("Free Wi-Fi");
    }
    if(isParking){
      amenities.push("Free Parking");
    }
    setFormData({
      ...formData,
      type: selectedType==="inside"?"inside":"outside",
      amenities: amenities,
    })
    if(selected !== "Select rating"){
      setFormData({
        ...formData,
        rating: selected.replace(/\D/g, ''),
      })
      axios.post(`http://localhost:3999/addAccommodation`, formData, {headers:headers}).then((response) => {
        Swal.fire({
          title: "Success!",
          text: "Item has been updated.",
          icon: "success",
        });
        setFormData([]);
        onSelectedPage("dashboard");
        setFormData([]);
      }).catch((err)=>{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton:
              "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
          },
        });
      });
    }
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
                  Add new accommodation
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
                    value={formData.title}
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
                    value={formData.accommodation_details}
                    class="block p-2.5 w-full my-2 text-sm rounded-lg border border-[#0c4a6e69] outline-none"
                    placeholder="Enter a description or an overview about the place..."
                    required
                    onChange={(e) => handleChange(e)}
                  ></textarea>
                </div>

                
                {/* price */}
                <div className="text-start">
                  <label className="text-sm font-medium text-sky-900">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="pricing"
                    placeholder="Enter the country the place in"
                    value={formData.pricing}
                    required
                    onChange={(e) => handleChange(e)}
                    className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                  />
                </div>

                {/* location */}
                <div className="flex flex-col md:flex-row text-start gap-5">
                  <div className="w-full md:w-auto">
                    <label className="text-sm font-medium text-sky-900">
                      City
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="City"
                      value={formData.location}
                      required
                      onChange={(e) => handleChange(e)}
                      className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                    />
                  </div>
                  <div className="w-full md:w-auto">
                    <label className="text-sm font-medium text-sky-900">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      required
                      onChange={(e) => handleChange(e)}
                      className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                    />
                  </div>
                </div>

                {/* type */}
                <div className="text-start">
                  <div className="my-2">
                    <label className="text-sm font-medium text-sky-900">
                      Type
                    </label>
                  </div>
                  <div className="flex flex-col md:flex-row text-start gap-8">
                    <div className="flex">
                      <input
                        className="relative h-5 w-5 rounded-full border-2 border-solid border-sky-700 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-sky-700 checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-sky-700 checked:after:bg-sky-700 checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="radio"
                        name="type"
                        id="indoor"
                        value="inside"
                        checked={selectedType === "inside"}
                        onChange={() => setSelectedType("inside")}
                      />
                      <label
                        className="inline-block pl-[0.15rem] hover:cursor-pointer"
                        htmlFor="indoor"
                      >
                        Indoor
                      </label>
                    </div>
                    <div className="flex">
                      <input
                        className="relative h-5 w-5 rounded-full border-2 border-solid border-sky-700 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-sky-700 checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-sky-700 checked:after:bg-sky-700 checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                        type="radio"
                        name="type"
                        id="outdoor"
                        value="outside"
                        checked={selectedType === "outside"}
                        onChange={() => setSelectedType("outside")}
                      />
                      <label
                        className="inline-block pl-[0.15rem] hover:cursor-pointer"
                        htmlFor="outdooe"
                      >
                        Outdoor
                      </label>
                    </div>
                  </div>
                </div>

                {/* rating */}
                <div className="text-start">
                  <div className="my-2">
                    <label className="text-sm font-medium text-sky-900">
                      Rating
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
                          setSelected("5 Stars");
                        }}
                      >
                        5 Stars
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelected("4 Stars");
                        }}
                      >
                        4 Stars
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelected("3 Stars");
                        }}
                      >
                        3 Stars
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelected("2 Stars");
                        }}
                      >
                        2 Stars
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelected("1 Stars");
                        }}
                      >
                        1 Stars
                      </Dropdown.Item>
                    </Dropdown>
                  </div>
                </div>

                {/* amenities */}
                <div className="text-start">
                <label className="text-sm font-medium text-sky-900">
                    Amenities
                  </label>
                  <div className="flex flex-wrap justify-around">
                    <div className="flex items-center gap-2">
                      <Checkbox id="Wifi" onClick={()=>setIsFreeWifi(!isFreeWifi)} />
                      <Label htmlFor="Wifi">Free Wi-Fi</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="parking" onClick={()=>setParking(!isParking)} />
                      <Label htmlFor="parking">Free parking</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="pool" onClick={()=>setIsPool(!isPool)}/>
                      <Label htmlFor="pool">Pool</Label>
                    </div>
                  </div>
                </div>
              </div>
              {/* buttons */}
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="mt-4 m-2 py-2 px-5 border-2 border-sky-900 bg-sky-900 hover:bg-white rounded-2xl text-white hover:text-sky-900"
                >
                  Add
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

export default AddHouse;
