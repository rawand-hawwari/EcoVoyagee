import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePage } from "../../Context/SelectedPageContext";
import { useAuth } from "../../Context/AuthContext";
import Swal from "sweetalert2";
import { Dropdown } from "flowbite-react";

const UpdateFlight = ({ id }) => {
  const [formData, setFormData] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const { onSelectedPage } = usePage();
  const [title, setTitle] = useState("");
  const [departTime, setDepartTime] = useState([]);
  const [returnTime, setReturnTime] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { headers } = useAuth();
  const [time, setTime] = useState("");
  const dropdownStyles = {
    backgroundColor: "#ffffff",
    color: "#0369a1",
    width: "100%",
    textAlign: "start",
  };
  useEffect(() => {
    // fetch flight data
    let newData = [];
    axios.get(`http://localhost:3999/getFlightsByID/${id}`).then((response) => {
      newData = response.data[0];
      // newData = {
      //   ...newData,
      //   depart: new Date(newData.depart_date).toLocaleDateString(
      //     "en-GB"
      //   ),
      //   return: new Date(newData.return_date).toLocaleDateString(
      //     "en-GB"
      //   ),
      // };
      if (newData) {
        newData.depart = new Date(newData.depart_date)
          .toISOString()
          .split("T")[0];
        newData.return = new Date(newData.return_date)
          .toISOString()
          .split("T")[0];
        const [hoursStr, minutesStr] = newData.average.split(" ");
        setTime({
          hours: parseInt(hoursStr),
          minutes: parseInt(minutesStr),
        });
        setDepartTime({
          boarding: newData.depart_time.boarding,
          arrival: newData.depart_time.arrival,
        });
        setReturnTime({
          boarding: newData.return_time.boarding,
          arrival: newData.return_time.arrival,
        });
      }
      // setFiltered(newData);
      setFormData(newData);
    });

    // fetch destinations
    axios.get("http://localhost:3999/getDestinations").then((response) => {
      setDestinations(response.data);
      response.data.map((place) => {
        if (newData) {
          if (place.destinations_id == newData.destinations_id) {
            setTitle(place.title);
          }
        }
      });
    });
  }, [id]);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      });
    } else if (name === "boardingD") {
      setDepartTime({
        ...departTime,
        boarding: value,
      });
    } else if (name === "arrivalD") {
      setDepartTime({
        ...departTime,
        arrival: value,
      });
    } else if (name === "boardingR") {
      setReturnTime({
        ...returnTime,
        boarding: value,
      });
    } else if (name === "arrivalR") {
      setReturnTime({
        ...returnTime,
        arrival: value,
      });
    } else if (name === "hours") {
      setTime({
        ...time,
        hours: value,
      });
    } else if (name === "minutes") {
      setTime({
        ...time,
        minutes: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // handle destination choose
  const handleDestination = (id, title) => {
    setFormData({
      ...formData,
      destinations_id: id,
    });
    setTitle(title);
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    let dataToSend = {
      ...formData,
      average: `${time.hours}h ${time.minutes}m`,
      depart_time: departTime,
      return_time: returnTime,
    };
    axios
      .post(`http://localhost:3999/updateFlight/${id}`, formData, {
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
        setFormData([]);
      })
      .catch((err) => {
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
          <form action="" onSubmit={(e) => handleSubmit(e)}>
            <div className="p-6 w-full">
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl text-sky-900 font-bold text-center mb-4 cursor-pointer">
                  Update Flight
                </h1>
              </div>
              <div className="space-y-4">
                {/* upload image */}
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

                {/* destination */}
                <div className="text-start">
                  <div className="my-2">
                    <label className="text-sm font-medium text-sky-900">
                      Destination
                    </label>
                  </div>
                  <div>
                    <Dropdown
                      label={title ? title : "Select Destination"}
                      placement="bottom"
                      style={dropdownStyles}
                    >
                      <div className="h-36 overflow-auto">
                        {destinations &&
                          destinations.map((place, id) => (
                            <Dropdown.Item
                              key={id}
                              onClick={() => {
                                handleDestination(
                                  place.destinations_id,
                                  place.title
                                );
                              }}
                            >
                              {place.title}
                            </Dropdown.Item>
                          ))}
                      </div>
                    </Dropdown>
                  </div>
                </div>

                {/* price */}
                <div className="text-start">
                  <label className="text-sm font-medium text-sky-900">
                    Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="best"
                    value={formData && formData.best}
                    placeholder="Price"
                    onChange={(e) => handleChange(e)}
                    required
                    className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                  />
                </div>

                {/* operated by */}
                <div className="text-start">
                  <label className="text-sm font-medium text-sky-900">
                    Operated by
                  </label>
                  <input
                    type="text"
                    name="operatedby"
                    value={formData && formData.operatedby}
                    placeholder="Enter Airline"
                    onChange={(e) => handleChange(e)}
                    required
                    className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                  />
                </div>

                {/* average */}
                <div className="text-start">
                  <label className="text-sm font-medium text-sky-900">
                    Flight Average
                  </label>
                  <div className="flex flex-wrap gap-5 w-full">
                    <div className="w-full md:w-2/5 flex flex-nowrap items-center gap-3">
                      <input
                        type="number"
                        name="hours"
                        value={time.hours}
                        placeholder="Enter Airline"
                        onChange={(e) => handleChange(e)}
                        required
                        className="block text-sm py-3 px-4 my-2 rounded-lg border border-[#0c4a6e69] outline-none"
                      />
                      <label className="text-sm font-medium text-sky-900">
                        hours
                      </label>
                    </div>
                    <div className="w-full md:w-2/5 flex flex-nowrap items-center gap-3">
                      <input
                        type="number"
                        name="minutes"
                        value={time.minutes}
                        placeholder="Enter Airline"
                        onChange={(e) => handleChange(e)}
                        required
                        className="block text-sm py-3 px-4 my-2 rounded-lg border border-[#0c4a6e69] outline-none"
                      />
                      <label className="text-sm font-medium text-sky-900">
                        minutes
                      </label>
                    </div>
                  </div>
                </div>

                {/* seats */}
                <div className="text-start">
                  <h1 className="text-sm font-medium pb-3 text-sky-900">
                    Flight Seats
                  </h1>
                  <div className="flex flex-wrap gap-5 w-full">
                    <div>
                      <label className="text-sm font-medium text-start text-sky-900">
                        Economy Class
                      </label>
                      <input
                        type="number"
                        name="economy"
                        value={formData&&formData.economy}
                        placeholder="Enter Airline"
                        onChange={(e) => handleChange(e)}
                        required
                        className="block text-sm py-3 px-4 my-2 rounded-lg border border-[#0c4a6e69] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-start text-sky-900">
                        Business Class
                      </label>
                      <input
                        type="number"
                        name="business"
                        value={formData&&formData.business}
                        placeholder="Enter Airline"
                        onChange={(e) => handleChange(e)}
                        required
                        className="block text-sm py-3 px-4 my-2 rounded-lg border border-[#0c4a6e69] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-start text-sky-900">
                        First Class
                      </label>
                      <input
                        type="number"
                        name="first"
                        value={formData&&formData.first}
                        placeholder="Enter Airline"
                        onChange={(e) => handleChange(e)}
                        required
                        className="block text-sm py-3 px-4 my-2 rounded-lg border border-[#0c4a6e69] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* depart */}
                <div className="text-start">
                  <label className="block text-sm font-medium text-gray-700">
                    Depart
                  </label>
                  <div className="flex flex-wrap gap-5">
                    <div className="">
                      <input
                        name="depart_date"
                        value={formData && formData.depart}
                        onChange={(e) => {
                          formData.depart = e.target.value;
                          handleChange(e);
                        }}
                        class="shadow rounded my-2 h-auto py-2 px-3 text-gray-700 w-full"
                        type="date"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="boardingD"
                        value={departTime && departTime.boarding}
                        placeholder="00:00"
                        onChange={(e) => handleChange(e)}
                        required
                        className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                      />
                      <input
                        type="text"
                        name="arrivalD"
                        value={departTime && departTime.arrival}
                        placeholder="00:00"
                        onChange={(e) => handleChange(e)}
                        required
                        className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* return */}
                <div className="text-start">
                  <label className="block text-sm font-medium text-gray-700">
                    Return
                  </label>
                  <div className="flex flex-wrap gap-5">
                    <div>
                      <input
                        name="return_date"
                        value={formData && formData.return}
                        onChange={(e) => {
                          formData.return = e.target.value;
                          handleChange(e);
                        }}
                        class="shadow rounded py-2 my-2 px-3 text-gray-700 w-full"
                        type="date"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="boardingR"
                        value={returnTime && returnTime.boarding}
                        placeholder="00:00"
                        onChange={(e) => handleChange(e)}
                        required
                        className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                      />
                      <input
                        type="text"
                        name="arrivalR"
                        value={returnTime && returnTime.arrival}
                        placeholder="00:00"
                        onChange={(e) => handleChange(e)}
                        required
                        className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

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

export default UpdateFlight;
