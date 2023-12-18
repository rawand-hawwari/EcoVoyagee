import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import { useBooking } from "../Context/BookingContext";
import { useNavigate } from "react-router-dom";

import DatetimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RoomDetailsModal from "./RoomDetailsModal";
import Swal from "sweetalert2";

const Rooms = () => {
  const { id } = useParams();
  //   const [room, setRoom] = useState("Standard");
  const { bookData, onBooking } = useBooking();
  //   const [activeIndex, setActiveIndex] = useState(0);

  const [date_from, setdate_from] = useState(new Date());
  const [date_to, setdate_to] = useState(new Date());
  const [roomDetails, setRoomDetails] = useState(false);
  const [roomModal, setRoomModal] = useState([]);
  const [index, setIndex] = useState(0);
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
  const history = useNavigate();
  const [adults, setAdults] = useState(1);
  const [roomsNum, setRoomsNum] = useState(1);
  const [children, setChildren] = useState(0);
  const [total, setTotal] = useState(0);


  const [booking, setBooking] = useState({
    first_name: bookData.first_name,
    last_name: bookData.last_name,
    address: bookData.address,
    phone: bookData.phone,
    adults: bookData.adults || 1,
    rooms: bookData.rooms || 1,
    children: bookData.children || 0,
    cost: bookData.cost,
    date_from: bookData.date_from || 0,
    date_to: bookData.date_to || 0,
    accommodation_id: bookData.accommodation_id,
    rooms_ids: bookData.rooms_ids || [],
  });
  // console.log(bookData);
  const [rooms, setRooms] = useState([]);

  //   const [similarPlace, setSimilarPlace] = useState([]);

  //   end carousel images
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });


    axios
      .post(`http://localhost:3999/getFilteredRooms`, {
        date_from,
        date_to,
        accommodation_id: id, // Include accommodation_id in the request
      })
      .then((response) => {
        // Handle the response data here
        let data = response.data;
        setRooms(data);
        console.log(response.data);

      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, [date_from, date_to, bookData.accommodation_id]);


  const openModal = (id) => {
    setRoomModal(rooms.filter((room) => room.room_id === id));
    setRoomDetails(true);
    setIndex(id);
  };
  const closeModal = () => {
    setRoomDetails(false);
  };
  const dropdownPopover = () => {
    setDropdownPopoverShow(!dropdownPopoverShow);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    booking.cost = booking.rooms_ids.reduce((total, room) => {
      return total + room.price;
    }, 0);
    booking.date_to = date_to;
    booking.date_from = date_from;
    booking.adults = adults;
    booking.children = children;
    booking.rooms = roomsNum;
    // try {
    //   onBooking(booking);
    //   history(`/payment`);
    // } catch (error) {
    //   console.error("Error:", error);
    // }
    console.log(booking);
  }
  const handleRoomSelect = (index) => {
    if (booking.rooms_ids.length < roomsNum) {
      booking.rooms_ids.push(rooms[index]);
      setTotal(
        booking.rooms_ids.reduce((total, room) => {
          return total + room.price;
        }, 0)
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Can't select more rooms than selected number",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "bg-fourth-color hover:bg-second-color text-second-color hover:text-fourth-color border border-fourth-color py-2 px-4 rounded",
        },
      });
    }
  };
  return (
    <div className="text-Base-color">
      <div className="flex flex-col justify-center items-center gap-5 my-10">
        {/* searching */}
        <div className="flex flex-wrap justify-center items-center gap-5 w-full">
          {/* pick rooms and # of guests */}
          <div className="relative">
            <button
              id="dropdownInformationButton"
              data-dropdown-toggle="dropdownInformation"
              className="text-Base-color bg-white hover:bg-transparent-first-color border border-third-color font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
              type="button"
              onClick={() => dropdownPopover()}
            >
              {adults} Adults {children} Children {roomsNum} Rooms
            </button>

            <div
              id="dropdownInformation"
              className={`z-10 absolute ${dropdownPopoverShow ? "block" : "hidden"
                } bg-white divide-y divide-gray-100 rounded-lg shadow w-full`}
            >
              <div className="px-4 py-3 text-sm text-Base-color flex justify-between items-center">
                <h1>Adults</h1>
                <fieldset className="input-number-wrapper group flex items-center">
                  <button
                    id="decremnt"
                    className="decremnt-left-large bg-third-color text-second-color p-2 rounded-l border border-third-color hover:bg-white hover:text-third-color"
                    onClick={() => {
                      adults != 1 && setAdults(adults - 1);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.25 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <input
                    className="p-1.5 w-16 text-center border border-third-color"
                    type="text"
                    value={adults}
                    onChange={(e) =>
                      setAdults(parseInt(e.target.value, 10) || 1)
                    }
                    inputmode="numeric"
                  ></input>
                  <button
                    id="increment"
                    className="increment-right-large bg-third-color text-second-color p-2 rounded-r border border-third-color hover:bg-white hover:text-third-color"
                    onClick={() => {
                      setAdults(adults + 1);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </fieldset>
              </div>
              <div className="px-4 py-3 text-sm text-Base-color flex justify-between items-center">
                <h1>Children</h1>
                <fieldset className="input-number-wrapper group flex items-center">
                  <button
                    id="decremnt"
                    className="decremnt-left-large bg-third-color text-second-color p-2 rounded-l border border-third-color hover:bg-white hover:text-third-color"
                    onClick={() => {
                      children != 0 && setChildren(children - 1);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.25 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <input
                    className="p-1.5 w-16 text-center border border-third-color"
                    type="text"
                    value={children}
                    onChange={(e) =>
                      setChildren(parseInt(e.target.value, 10) || 0)
                    }
                    inputmode="numeric"
                  ></input>
                  <button
                    id="increment"
                    className="increment-right-large bg-third-color text-second-color p-2 rounded-r border border-third-color hover:bg-white hover:text-third-color"
                    onClick={() => {
                      setChildren(children + 1);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </fieldset>
              </div>
              <div className="px-4 py-3 text-sm text-Base-color flex justify-between items-center">
                <h1>Rooms</h1>
                <fieldset className="input-number-wrapper group flex items-center">
                  <button
                    id="decremnt"
                    className="decremnt-left-large bg-third-color text-second-color p-2 rounded-l border border-third-color hover:bg-white hover:text-third-color"
                    onClick={() => {
                      roomsNum != 1 && setRoomsNum(roomsNum - 1);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.25 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <input
                    className="p-1.5 w-16 text-center border border-third-color"
                    type="text"
                    value={roomsNum}
                    onChange={(e) =>
                      setRoomsNum(parseInt(e.target.value, 10) || 1)
                    }
                    inputmode="numeric"
                  ></input>
                  <button
                    id="increment"
                    className="increment-right-large bg-third-color text-second-color p-2 rounded-r border border-third-color hover:bg-white hover:text-third-color"
                    onClick={() => {
                      setRoomsNum(roomsNum + 1);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </fieldset>
              </div>
            </div>
          </div>
          {/* pick date */}
          <div className="flex items-center">
            <label className="px-3">From:</label>
            <DatetimePicker
              selected={date_from}
              onChange={(date) => setdate_from(date)}
              selectsStart
              date_from={date_from}
              date_to={date_to}
              // dateFormat="yyyy-mm-dd"
              placeholderText="Start Date"
              className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none focus:border-third-color"
            />

            <label className="px-3">To:</label>
            <DatetimePicker
              selected={date_to}
              name="date_to"
              onChange={(date) => setdate_to(date)}
              selectsEnd
              date_from={date_from}
              date_to={date_to}
              minDate={date_from}
              placeholderText="End Date"
              className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none focus:border-third-color"
            />
          </div>
          {/* search button */}
          <button
            onClick={(e) => handleSearch(e)}
            className="border-fourth-color border-2 hover:bg-second-color bg-fourth-color hover:text-fourth-color text-second-color font-bold py-2 px-4 rounded-md"
          >
            Search
          </button>
        </div>
        {/* rooms list */}
        <div className="flex flex-col lg:flex-row">
          <div className="text-Base-color text-start flex flex-col gap-10 lg:m-10">
            {rooms &&
              rooms.map((room, index) => (
                <div
                  key={index}
                  className="flex flex-col lg:flex-row justify-center items-center gap-3"
                >
                  <img
                    src={room.image}
                    alt="room image"
                    className="w-full lg:w-1/2"
                  />
                  <div className="bg-transparent-first-color w-full lg:w-1/2 px-4 py-8">
                    <div className="flex flex-wrap justify-between pb-4">
                      <div>
                        <h1 className="text-3xl md:text-4xl">
                          {room.room_type}
                        </h1>
                        <p className="flex items-center p-1">
                          <span>{room.guests}</span>{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 mx-1"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <p className=" flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 mx-1 text-fourth-color"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{room.view} View</span>
                          </p>
                          <button
                            className="underline text-fourth-color"
                            onClick={() => openModal(room.room_id)}
                          >
                            More details
                          </button>
                        </div>
                      </div>
                      <div className="flex items-baseline text-Base-color mb-5">
                        <span className="text-4xl font-extrabold tracking-tight">
                          {room.price}
                        </span>
                        <span className="text-3xl font-semibold">JOD</span>
                      </div>
                    </div>
                    <button
                      className="p-2.5 ms-2 text-sm font-medium text-second-color bg-fourth-color rounded-lg border border-fourth-color hover:bg-second-color hover:text-fourth-color"
                      onClick={() => handleRoomSelect(index)}
                    >
                      Select this room
                    </button>
                  </div>
                  {roomDetails && (
                    <RoomDetailsModal onClose={closeModal}>
                      <h1 className="text-3xl text-start text-third-color">
                        Room details
                      </h1>
                      <hr className="py-1" />
                      <p className="text-2xl md:text-3xl text-Base-color">
                        {roomModal[0].room_type}
                      </p>
                      <p>{roomModal[0].room_description}</p>
                      <p className="flex items-center">
                        <span>View: </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-4 h-4 mx-1"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{roomModal[0].view} View</span>
                      </p>
                      <p className="flex items-center">
                        <span>Size: </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-4 h-4 mx-1"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                          />
                        </svg>

                        <span>{roomModal[0].size}</span>
                      </p>
                      <p className="flex flex-wrap gap-2">
                        <span>Amenities: </span>
                        {roomModal &&
                          roomModal[0].amenities.map((item, id) => (
                            <span key={id} className="text-Base-color">
                              {item}
                            </span>
                          ))}
                      </p>
                    </RoomDetailsModal>
                  )}
                  <div id="details"></div>
                </div>
              ))}
          </div>
          <div className="float-right bg-white border relative p-5 border-third-color lg:w-1/4 h-44 lg:mx-5 my-6 text-start">
            <h1 className="text-third-color text-2xl md:text-4xl">Summary</h1>
            <hr className="my-3" />
            <button className="text-fourth-color">Add room</button>
            <button
              className="bg-fourth-color absolute -bottom-3 left-1/2 transform -translate-x-1/2 hover:bg-white text-white hover:text-fourth-color border border-fourth-color rounded px-3 py-2 w-4/5"
              onClick={(e) => handleSubmit(e)}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;