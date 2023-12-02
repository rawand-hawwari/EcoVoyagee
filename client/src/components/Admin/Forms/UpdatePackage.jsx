import React, { useEffect, useState, useRef } from "react";
import { usePage } from "../../Context/SelectedPageContext";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../Context/AuthContext";

const UpdatePackage = ({ id }) => {
  const [formData, setFormData] = useState([]);
  const { onSelectedPage, page } = usePage();

  const [highlight, setHighlight] = useState([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const [itineraryInput, setItineraryInput] = useState("");
  const [inclusion, setInclusion] = useState([]);
  const [inclusionInput, setInclusionInput] = useState("");
  const [exclusion, setExclusion] = useState([]);
  const [exclusionInput, setExclusionInput] = useState("");
  const {headers} = useAuth();

  useEffect(() => {
    axios
      .get(`http://localhost:3999/getPackagesById/${id}`)
      .then((response) => {
        // Handle the response data here
        setFormData(response.data[0]);
        const newData = { ...response.data[0] };
        // delete newData["is_deleted"];
        // delete newData["packages_id"];
        // setFormData(newData);
        // setFormData({
        //     title: response.data[0].title,
        //     cost: response.data[0].cost,
        //     destination:response.data[0].destination
        //  } )
        setItinerary(Object.values(response.data[0].itinerary));
        setHighlight(Object.values(response.data[0].highlights));
        setInclusion(Object.values(response.data[0].inclusions));
        setExclusion(Object.values(response.data[0].exclusions));
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
        [name]: e.target.file,
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
    formData.itinerary = Object.fromEntries(
      itinerary.map((item, index) => [`Day ${index + 1}`, item])
    );
    formData.inclusions = Object.fromEntries(
      inclusion.map((item, index) => [`Inc ${index + 1}`, item])
    );
    formData.exclusions = Object.fromEntries(
      exclusion.map((item, index) => [`Exc ${index + 1}`, item])
    );
    formData.highlights = Object.fromEntries(
      highlight.map((item, index) => [`high ${index + 1}`, item])
    );
    console.log(formData);
    axios.put(`http://localhost:3999/updatePackages/${id}`, formData, {headers:headers}).then((response) => {
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
  };
  const handleClose = (e) => {
    e.preventDefault();
    setFormData([]);
    onSelectedPage("dashboard");
  };
  const addTag = (e, input) => {
    e.preventDefault();
    if (input === "highlight") {
      if (highlightInput.trim() !== "" && !highlight.includes(highlightInput)) {
        setHighlight([...highlight, highlightInput]);
        setHighlightInput("");
      }
    } else if (input === "itinerary") {
      if (itineraryInput.trim() !== "" && !itinerary.includes(itineraryInput)) {
        setItinerary([...itinerary, itineraryInput]);
        setItineraryInput("");
      }
    } else if (input === "inclusion") {
      if (inclusionInput.trim() !== "" && !inclusion.includes(inclusionInput)) {
        setInclusion([...inclusion, inclusionInput]);
        setInclusionInput("");
      }
    } else if (input === "exclusion") {
      if (exclusionInput.trim() !== "" && !exclusion.includes(exclusionInput)) {
        setExclusion([...exclusion, exclusionInput]);
        setExclusionInput("");
      }
    }
  };

  const removeTag = (index, input) => {
    if (input === "highlight") {
      const updatedHighlight = [...highlight];
      updatedHighlight.splice(index, 1);
      setHighlight(updatedHighlight);
    } else if (input === "itinerary") {
      const updatedItinerary = [...itinerary];
      updatedItinerary.splice(index, 1);
      setItinerary(updatedItinerary);
    } else if (input === "inclusion") {
      const updatedInclusion = [...inclusion];
      updatedInclusion.splice(index, 1);
      setInclusion(updatedInclusion);
    } else if (input === "exclusion") {
      const updatedExclusion = [...exclusion];
      updatedExclusion.splice(index, 1);
      setExclusion(updatedExclusion);
    }
  };
  // console.log(formData);
  return (
    <div>
      <div className="flex flex-col justify-center top-64 items-center lg:ml-28 h-full w-auto">
        <div className="lg:w-2/3 w-full bg-gray-200 p-6 rounded shadow-lg h-auto m-6">
          <form action="" onSubmit={(e) => handleSubmit(e)}>
            <div className="p-6 w-full">
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl text-sky-900 font-bold text-center mb-4 cursor-pointer">
                  Update Package
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

                {/* title */}
                <div className="text-start">
                  <label className="text-sm font-medium text-sky-900">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData&&formData.title}
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
                    name="overview"
                    rows="4"
                    value={formData&&formData.overview}
                    class="block p-2.5 w-full my-2 text-sm rounded-lg border border-[#0c4a6e69] outline-none"
                    placeholder="Enter a description or an overview about the place..."
                    required
                    onChange={(e) => handleChange(e)}
                  ></textarea>
                </div>

                {/* highlight */}
                <div className="text-start">
                  <label className="block text-sm font-medium text-gray-700">
                    Highlights
                  </label>
                  <div className="mt-1">
                    <div className="flex">
                      <input
                        type="text"
                        value={highlightInput}
                        onChange={(e) => setHighlightInput(e.target.value)}
                        className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                        placeholder="Add a tag..."
                      />
                      <button
                        onClick={(e) => {
                          addTag(e, "highlight");
                        }}
                        className="m-2 py-3 px-5 border-2 border-sky-900 bg-sky-900 hover:bg-white rounded-2xl text-white hover:text-sky-900"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap">
                      {highlight.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 border border-blue-300 text-blue-800 rounded-md px-2 py-1 m-1 flex items-center"
                        >
                          <span className="mr-1">{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(index, "highlight")}
                            className="text-blue-500 hover:text-blue-700 focus:outline-none"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* itinerary */}
                <div className="text-start">
                  <label className="block text-sm font-medium text-gray-700">
                    Itinerary
                  </label>
                  <div className="mt-1">
                    <div className="flex">
                      <input
                        type="text"
                        value={itineraryInput}
                        onChange={(e) => setItineraryInput(e.target.value)}
                        className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                        placeholder="Add a tag..."
                      />
                      <button
                        onClick={(e) => {
                          addTag(e, "itinerary");
                        }}
                        className="m-2 py-3 px-5 border-2 border-sky-900 bg-sky-900 hover:bg-white rounded-2xl text-white hover:text-sky-900"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap">
                      {itinerary.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 border border-blue-300 text-blue-800 rounded-md px-2 py-1 m-1 flex items-center"
                        >
                          <span className="mr-1">{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(index, "itinerary")}
                            className="text-blue-500 hover:text-blue-700 focus:outline-none"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* inclusions */}
                <div className="text-start">
                  <label className="block text-sm font-medium text-gray-700">
                    Inclusions
                  </label>
                  <div className="mt-1">
                    <div className="flex">
                      <input
                        type="text"
                        value={inclusionInput}
                        onChange={(e) => setInclusionInput(e.target.value)}
                        className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                        placeholder="Add a tag..."
                      />
                      <button
                        onClick={(e) => {
                          addTag(e, "inclusion");
                        }}
                        className="m-2 py-3 px-5 border-2 border-sky-900 bg-sky-900 hover:bg-white rounded-2xl text-white hover:text-sky-900"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap">
                      {inclusion.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 border border-blue-300 text-blue-800 rounded-md px-2 py-1 m-1 flex items-center"
                        >
                          <span className="mr-1">{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(index, "inclusion")}
                            className="text-blue-500 hover:text-blue-700 focus:outline-none"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* exclusion */}
                <div className="text-start">
                  <label className="block text-sm font-medium text-gray-700">
                    Exclusions
                  </label>
                  <div className="mt-1">
                    <div className="flex">
                      <input
                        type="text"
                        value={exclusionInput}
                        onChange={(e) => setExclusionInput(e.target.value)}
                        className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                        placeholder="Add a tag..."
                      />
                      <button
                        onClick={(e) => {
                          addTag(e, "exclusion");
                        }}
                        className="m-2 py-3 px-5 border-2 border-sky-900 bg-sky-900 hover:bg-white rounded-2xl text-white hover:text-sky-900"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap">
                      {exclusion.map((tag, index) => (
                        <div
                          key={index}
                          className="bg-blue-100 border border-blue-300 text-blue-800 rounded-md px-2 py-1 m-1 flex items-center"
                        >
                          <span className="mr-1">{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(index, "exclusion")}
                            className="text-blue-500 hover:text-blue-700 focus:outline-none"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* country */}
                <div className="text-start">
                  <label className="block text-sm font-medium text-gray-700">
                  Country
                  </label>
                  <div className="mt-1">
                    <div className="flex">
                      <input
                        type="text"
                        name="country"
                        value={formData&&formData.country}
                        onChange={(e) => handleChange(e)}
                        className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>

                {/* cost */}
                <div className="text-start">
                  <label className="text-sm font-medium text-sky-900">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost"
                    placeholder="Enter the country the place in"
                    value={formData&&formData.cost}
                    required
                    onChange={(e) => handleChange(e)}
                    className="block text-sm py-3 px-4 my-2 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                  />
                </div>
              </div>

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

export default UpdatePackage;
