import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [types, setTypes] = useState(null);
  const [selectedType, setSelectedType] = useState("Select type");
  const [selected, setSelected] = useState("Select");

  // dropdown for accommodations type
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const toggleTypeMenu = () => {
    setTypeMenuOpen(!typeMenuOpen);
  };
  // end of dropdown

  // dropdown for rating
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  // end of dropdown

  const [filterOpen, setFilterOpen] = useState(false);
  const openFilter = () => {
    setFilterOpen(!filterOpen);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    axios
      .get("http://localhost:3999/getPackages")
      .then((response) => {
        // Handle the response data here
        setPackages(response.data);
        // setTypes(response.data.destinations_type);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    // if (packages.length !== 0) {
    //   const newTypes = packages.map(
    //     (package) => package.destinations_type
    //   );
    //   setTypes(newTypes);
    // }
    // if (types !== null) {
    //   const uniqueArray = [...new Set(types)];
    //   setTypes(uniqueArray);
    // }
  }, [packages]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center">
        <div className="">
          <div
            className={`${
              filterOpen ? "h-auto" : "h-16 overflow-hidden"
            } md:overflow-visible md:h-auto my-16 mx-3 border gap-4 flex-wrap p-3 flex justify-center md:flex-col`}
          >
            <div className="w-full flex justify-between">
              <h2 className="mb-3 text-start text-sky-700 text-xl font-bold">
                Filter
              </h2>
              <svg
                onClick={openFilter}
                class={`w-4 h-auto ${
                  filterOpen ? "hidden" : "block"
                } md:hidden`}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {" "}
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <polyline points="16 4 20 4 20 8" />{" "}
                <line x1="14" y1="10" x2="20" y2="4" />{" "}
                <polyline points="8 20 4 20 4 16" />{" "}
                <line x1="4" y1="20" x2="10" y2="14" />{" "}
                <polyline points="16 20 20 20 20 16" />{" "}
                <line x1="14" y1="14" x2="20" y2="20" />{" "}
                <polyline points="8 4 4 4 4 8" />{" "}
                <line x1="4" y1="4" x2="10" y2="10" />
              </svg>
              <svg
                onClick={openFilter}
                class={`w-4 h-auto ${
                  filterOpen ? "block" : "hidden"
                } md:hidden`}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {" "}
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <polyline points="5 9 9 9 9 5" />{" "}
                <line x1="3" y1="3" x2="9" y2="9" />{" "}
                <polyline points="5 15 9 15 9 19" />{" "}
                <line x1="3" y1="21" x2="9" y2="15" />{" "}
                <polyline points="19 9 15 9 15 5" />{" "}
                <line x1="15" y1="9" x2="21" y2="3" />{" "}
                <polyline points="19 15 15 15 15 19" />{" "}
                <line x1="15" y1="15" x2="21" y2="21" />
              </svg>
            </div>
            <div className="w-full">
              <form class="flex items-center">
                <label for="simple-search" class="sr-only">
                  Search
                </label>
                <div class="relative w-full">
                  <input
                    type="text"
                    id="simple-search"
                    class="bg-white border border-gray-300 text-sky-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search branch name..."
                  />
                </div>
                <button
                  type="submit"
                  class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span class="sr-only">Search</span>
                </button>
              </form>
            </div>
            <div className="w-full">
              <p className="mb-3 text-lg text-start">Price</p>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                id="first_name"
                className="bg-white border border-gray-300 text-sky-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></input>
            </div>
            <div className="w-full">
              <p className="mb-3 text-lg text-start">Rating</p>
              <div className="relative inline-block text-left w-full">
                <div>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                    onClick={toggleMenu}
                  >
                    {selected}
                    <svg
                      className={`-mr-1 h-5 w-5 text-gray-400 transform ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {menuOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      <button
                        onClick={() => {
                          setSelected("Select");
                          toggleMenu();
                        }}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => {
                          setSelected("5 Stars");
                          toggleMenu();
                        }}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        5 Stars
                      </button>
                      <button
                        onClick={() => {
                          setSelected("4 Stars");
                          toggleMenu();
                        }}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        4 Stars
                      </button>
                      <button
                        onClick={() => {
                          setSelected("3 Stars");
                          toggleMenu();
                        }}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        3 Stars
                      </button>
                      <button
                        onClick={() => {
                          setSelected("2 Stars");
                          toggleMenu();
                        }}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        2 Stars
                      </button>
                      <button
                        onClick={() => {
                          setSelected("1 Star");
                          toggleMenu();
                        }}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        1 Star
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <p className="mb-3 text-lg text-start">Amenities</p>
              <div className="container max-w-full ml-8 mt-6 text-base font-sans">
                <div class="flex items-center mb-4">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    value=""
                    class="w-4 h-4 text-sky-900 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="default-checkbox"
                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Free Wi-Fi
                  </label>
                </div>
                <div class="flex items-center mb-4">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    value=""
                    class="w-4 h-4 text-sky-900 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="default-checkbox"
                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Free parking
                  </label>
                </div>
                <div class="flex items-center mb-4">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    value=""
                    class="w-4 h-4 text-sky-900 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    for="default-checkbox"
                    class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Pool
                  </label>
                </div>
              </div>
            </div>
            <div className="w-full">
              <p className="mb-3 text-lg text-start">Type</p>
              <div className="relative inline-block text-left w-full">
                <div>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={typeMenuOpen}
                    aria-haspopup="true"
                    onClick={toggleTypeMenu}
                  >
                    {selectedType}
                    <svg
                      className={`-mr-1 h-5 w-5 text-gray-400 transform ${
                        typeMenuOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {typeMenuOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      <button
                        onClick={() => {
                          setSelectedType("Select type");
                          toggleTypeMenu();
                        }}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        Select type
                      </button>
                      <button
                        onClick={() => {
                          setSelectedType("Indoors");
                          toggleTypeMenu();
                        }}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        Indoors
                      </button>
                      <button
                        onClick={() => {
                          setSelectedType("Outdoors");
                          toggleTypeMenu();
                        }}
                        className="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabIndex="-1"
                        id="menu-item-0"
                      >
                        Outdoors
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="my-16 mx-8">
          <div className="flex flex-col gap-8">
            {packages.map((data, id) => (
              <div key={id}>
                <article className=" flex flex-wrap sm:flex-nowrap shadow-lg border border-sky-200 mx-auto max-w-3xl md:w-[600px] group transform duration-500 hover:-translate-y-1 mb-2">
                  <img
                    className="w-full sm:w-52 h-auto"
                    src="https://i.ibb.co/Kr4b0zJ/152013403-10158311889099633-8423107287930246533-o.jpg"
                    alt=""
                  />
                  <div className="h-auto w-full flex flex-col justify-between">
                    <div className="p-5 text-start">
                      <h1 className="text-2xl font-semibold text-sky-900">
                        {data.title}
                      </h1>
                      <p className="text-md overflow-hidden max-h-28 text-gray-400 mt-2 leading-relaxed">
                        {data.overview}
                      </p>
                      <p className="text-md overflow-hidden max-h-28 text-gray-400 mt-2 leading-relaxed">
                        Destination: {data.destination}
                      </p>
                    </div>
                    <div className="flex justify-between items-center p-5 bg-gray-100">
                      <div>
                        <p className="text-lg text-gray-700 font-bold">
                          {data.cost} JOD
                        </p>
                      </div>
                      <Link to={`/package/${data.packages_id}`}>
                        <button className="py-2 px-5 bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 md:text-lg rounded-lg shadow-md">
                          Read more
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Packages;
// needs pagination and get all the data not just 3
