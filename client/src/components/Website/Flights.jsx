import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import BookFlightModal from "./BookFlightModal";
import { useBooking } from "../Context/BookingContext";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const location = useLocation();
  const [destinations, setDestinations] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const destination = queryParams.get("destination");
  const [bookFilght, setBookFilght] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const { bookData, onBooking } = useBooking();
  const navigate = useNavigate();
  const openFilter = () => {
    setFilterOpen(!filterOpen);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    axios
      .get(`http://localhost:3999/getFlightsPaginated/${currentPage}`)
      .then((response) => {
        setPagination(response.data);
        let newData = response.data.map((data) => ({
          ...data,
          depart: new Date(data.depart_date).toLocaleDateString("en-GB"),
          return: new Date(data.return_date).toLocaleDateString("en-GB"),
        }));
        // Handle the response data here
        if (destination) {
          const filtered = newData.filter(
            (data) => data.destinations_id == destination
          );
          setFlights(filtered);
        } else {
          setFlights(newData);
        }
        axios.get(`http://localhost:3999/getDestinations`).then((response) => {
          setDestinations(response.data);
        });
        setFilteredFlights(newData);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, []);
  // useEffect(() => {
  //   const queryParams = new URLSearchParams(location.search);
  //   const destination = queryParams.get("destination");
  //   axios
  //     .get("http://localhost:3999/getFlightsPaginated", { page: currentPage })
  //     .then((response) => {
  //       setPagination(response.data);
  //       let newData = response.data.data.map((data) => ({
  //         ...data,
  //         depart: new Date(data.depart_date).toLocaleDateString("en-GB"),
  //         return: new Date(data.return_date).toLocaleDateString("en-GB"),
  //       }));
  //       // Handle the response data here
  //       if (destination) {
  //         const filtered = newData.filter(
  //           (data) => data.destinations_id === destination
  //         );
  //         setFlights(filtered);
  //       } else {
  //         setFlights(newData);
  //       }
  //       axios.get(`http://localhost:3999/getDestinations`).then((response) => {
  //         setDestinations(response.data);
  //       });
  //       setFilteredFlights(newData);
  //     })
  //     .catch((error) => {
  //       // Handle errors here
  //       console.error("Error:", error);
  //     });
  // }, [currentPage]);
  // for destination title
  // {destinations &&
  //   destinations.map(
  //     (item) =>
  //       item.destinations_id ===
  //         flight.destinations_id && `${item.title}`
  //   )}

  const openModal = (cost) => {
    setBookFilght(true);
    setPrice(cost);
  };
  const closeModal = () => {
    setBookFilght(false);
  };
  const bookingFlight = (id, seat) => {
    let cost = 0;
    if (seat === "Economy") {
      cost = price;
    } else if (seat === "Business") {
      cost = price * 3;
    } else if (seat === "First") {
      cost = price * 5;
    }
    onBooking({
      ...bookData,
      cost: cost,
      flights_id: id,
    });
    navigate("/payment");
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;

    // Calculate the range of page numbers to display
    let start = Math.max(1, currentPage - 1);
    const end = Math.min(pagination.totalPages, start + maxPagesToShow - 1);
    if (end === pagination.totalPages) {
      start = pagination.totalPages - 2;
    }
    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`mx-1 px-3 py-1 rounded ${
            i === currentPage ? "bg-sky-700 text-white" : "text-sky-900"
          }`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    axios
      .get(`http://localhost:3999/getFlightsPaginated/${pageNumber}`)
      .then((response) => {
        setPagination(response.data);
        let newData = response.data.data.map((data) => ({
          ...data,
          depart: new Date(data.depart_date).toLocaleDateString("en-GB"),
          return: new Date(data.return_date).toLocaleDateString("en-GB"),
        }));
        // Handle the response data here
        if (destination) {
          const filtered = newData.filter(
            (data) => data.destinations_id === destination
          );
          setFlights(filtered);
        } else {
          setFlights(newData);
        }
        axios.get(`http://localhost:3999/getDestinations`).then((response) => {
          setDestinations(response.data);
        });
        setFilteredFlights(newData);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };
  return (
    <div className="flex flex-col md:flex-row justify-center">
      <div>
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
              class={`w-4 h-auto ${filterOpen ? "hidden" : "block"} md:hidden`}
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
              class={`w-4 h-auto ${filterOpen ? "block" : "hidden"} md:hidden`}
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
        </div>
      </div>
      <div className="md:w-2/3 w-full">
        <div className="flex flex-col my-3 md:my-16 w-full justify-center items-center md:justify-start md:items-start gap-5 min-h-[844px]">
          {flights &&
            flights.map((flight, id) => (
              <div key={id} className=" w-11/12 mx-5">
                <div className="flex flex-col py-3 px-5 md:mx-10 md:py-5 md:px-7 bg-gray-200 rounded-md w-full">
                  <h1 className="text-start text-3xl flex items-center gap-3 pb-4">
                    Jordan
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                    {destinations &&
                      destinations.map(
                        (item) =>
                          item.destinations_id === flight.destinations_id &&
                          `${item.country}`
                      )}
                  </h1>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-1 w-full">
                    <div className="w-full flex flex-col justify-center items-center md:w-1/3 p-5">
                      <img
                        src={flight.imagecomp}
                        alt="Airline"
                        className="h-32 object-cover w-32 md:w-4/5"
                      />
                      <h1>
                        <strong>Operated by:</strong> {flight.operatedby}
                      </h1>
                    </div>
                    <div className="w-full md:w-1/3 p-5">
                      <div className="felx flex-col justify-start items-center">
                        {/* <h1 className="text-start">Depart: {flight.depart}</h1> */}
                        <div className="flex justify-between items-center gap-5">
                          <h1 className="text-xl">
                            <strong>{flight.depart_time.boarding}</strong>
                          </h1>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="w-10 h-10 text-xl text-gray-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <h1 className="text-xl">
                            <strong>{flight.depart_time.arrival}</strong>
                          </h1>
                        </div>
                      </div>
                      <br />
                      <div className="felx flex-col justify-start items-center">
                        {/* <h1 className="text-start">Return: {flight.return}</h1> */}
                        <div className="flex justify-between items-center gap-5">
                          <h1 className="text-xl">
                            <strong>{flight.return_time.boarding}</strong>
                          </h1>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="w-10 h-10 text-xl text-gray-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <h1 className="text-xl">
                            <strong>{flight.return_time.arrival}</strong>
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div className="w-full text-2xl md:w-1/3 md:text-3xl p-5">
                      <h1>{flight.best} JOD</h1>
                      <button
                        onClick={(e) => openModal(flight.best)}
                        className="sm:mt-3 my-2 py-2 px-5 bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 md:text-lg rounded-lg shadow-md"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
                {bookFilght && (
                  <BookFlightModal onClose={closeModal}>
                    <h1 className="text-3xl text-center text-sky-900">
                      Book Your Flight
                    </h1>
                    <div className="flex flex-wrap justify-center my-5 items-center gap-5">
                      <div class="w-auto max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                          Economy class
                        </h5>
                        <div class="flex items-baseline text-gray-900 dark:text-white">
                          <span class="text-3xl font-semibold">$</span>
                          <span class="text-5xl font-extrabold tracking-tight">
                            {price}
                          </span>
                          <span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                            Per Person
                          </span>
                        </div>
                        <div class="space-y-5 my-7"></div>
                        <button
                          onClick={(e) =>
                            bookingFlight(flight.flights_id, "Economy")
                          }
                          type="button"
                          class="text-white bg-sky-900 hover:bg-white hover:text-sky-900 border-2 border-sky-900 font-medium rounded-lg text-sm px-5 py-2 inline-flex justify-center w-full text-center"
                        >
                          Book Now
                        </button>
                      </div>
                      <div class="w-auto max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                          Business class
                        </h5>
                        <div class="flex items-baseline text-gray-900 dark:text-white">
                          <span class="text-3xl font-semibold">$</span>
                          <span class="text-5xl font-extrabold tracking-tight">
                            {price * 3}
                          </span>
                          <span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                            Per Person
                          </span>
                        </div>
                        <div class="space-y-5 my-7"></div>
                        <button
                          onClick={(e) =>
                            bookingFlight(flight.flights_id, "Business")
                          }
                          type="button"
                          class="text-white bg-sky-900 hover:bg-white hover:text-sky-900 border-2 border-sky-900 font-medium rounded-lg text-sm px-5 py-2 inline-flex justify-center w-full text-center"
                        >
                          Book Now
                        </button>
                      </div>
                      <div class="w-auto max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                          First class
                        </h5>
                        <div class="flex items-baseline text-gray-900 dark:text-white">
                          <span class="text-3xl font-semibold">$</span>
                          <span class="text-5xl font-extrabold tracking-tight">
                            {price * 5}
                          </span>
                          <span class="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                            Per Person
                          </span>
                        </div>
                        <div class="space-y-5 my-7"></div>
                        <button
                          onClick={(e) =>
                            bookingFlight(flight.flights_id, "First")
                          }
                          type="button"
                          class="text-white bg-sky-900 hover:bg-white hover:text-sky-900 border-2 border-sky-900 font-medium rounded-lg text-sm px-5 py-2 inline-flex justify-center w-full text-center"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </BookFlightModal>
                )}
                <div id="root"></div>
              </div>
            ))}
        </div>
        {/* min-h-[636px] */}
        <div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => currentPage !== 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-sky-900"
              variant="outlined"
              size="sm"
            >
              Previous
            </button>
            <div>{renderPageNumbers()}</div>
            <button
              onClick={() =>
                currentPage !== pagination.totalPages &&
                paginate(currentPage + 1)
              }
              disabled={currentPage === pagination.totalPages}
              className="text-sky-900"
              variant="outlined"
              size="sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flights;
