import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import { useBooking } from "../Context/BookingContext";
import { useNavigate } from "react-router-dom";

import DatetimePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RoomDetailsModal from "./RoomDetailsModal";

const Rooms = () => {
  const { id } = useParams();
  //   const [room, setRoom] = useState("Standard");
  const { bookData, onBooking } = useBooking();
  //   const [activeIndex, setActiveIndex] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [roomDetails, setRoomDetails] = useState(false);
  const [roomModal, setRoomModal] = useState([]);
  const [index, setIndex] = useState(0);

  const history = useNavigate();
  const [booking, setBooking] = useState({
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    room_preference: "Standard",
    adults: 0,
    children: 0,
    cost: 0,
    date_from: 0,
    date_to: 0,
    accommodation_id: 0,
  });
  const [rooms, setRooms] = useState([]);
  //   const [similarPlace, setSimilarPlace] = useState([]);

  //   end carousel images
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    axios
      //   .get(`http://localhost:3999/rooms/${id}`)
      .get(`http://localhost:3009/rooms`)
      .then((response) => {
        // Handle the response data here
        let data = response.data;
        setRooms(data.filter((item) => item.accommodation_id == id));
        // setTypes(response.data.destinations_type);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, [id]);

  const openModal = (id) => {
    console.log(id);
    setRoomModal(rooms.filter((room) => room.room_id === id));
    setRoomDetails(true);
    setIndex(id);
    // setPrice(flightToBook[0].best);
    // setEconomy(flightToBook[0].economy);
    // setBusiness(flightToBook[0].business);
    // setFirst(flightToBook[0].first);
  };
  const closeModal = () => {
    setRoomDetails(false);
  };
  console.log(roomModal);
  //   function handleChange(e) {
  //     const { name, value } = e.target;
  //     setBooking({
  //       ...booking,
  //       [name]: value,
  //     });
  //   }

  //   async function handleSubmit(e) {
  //     e.preventDefault();
  //     let total =
  //       booking.adults * booking.cost + (booking.children * booking.cost) / 2;
  //     booking.cost = total;
  //     booking.accommodation_id = id;
  //     booking.date_to = endDate;
  //     booking.date_from = startDate;

  //     console.log(booking);
  //     try {
  //       onBooking(booking);
  //       history(`/rooms/${id}`);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   }
  return (
    <div className="text-Base-color">
      <div className="flex flex-col justify-center items-center gap-5 my-10">
        {/* searching */}
        <div>
          <div>
            <div className="flex self-start w-1/2 gap-5 items-center">
              <label className="px-3">Adults:</label>
              <input
                type="number"
                name="adults"
                placeholder="Adults"
                value={booking.adults}
                required
                className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
              />
              <label className="px-3">Children:</label>
              <input
                type="number"
                name="children"
                placeholder="Children"
                value={booking.children}
                className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4 w-full items-center">
            <label className="px-3">From:</label>
            <DatetimePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              // dateFormat="yyyy-mm-dd"
              placeholderText="Start Date"
              className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none focus:border-third-color"
            />

            <label className="px-3">To:</label>
            <DatetimePicker
              selected={endDate}
              name="date_to"
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
              className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none focus:border-third-color"
            />
          </div>
        </div>
        {/* rooms list */}
        <div className="text-Base-color text-start flex flex-col gap-10">
          {rooms &&
            rooms.map((room, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row justify-center items-center gap-3"
              >
                <img
                  src={room.image}
                  alt="room image"
                  className="w-full md:w-1/3"
                />
                <div className="bg-transparent-first-color w-full md:w-1/3 h-1/3 px-4 py-8">
                  <div className="flex flex-wrap justify-between pb-4">
                    <div>
                      <h1 className="text-3xl md:text-4xl">{room.room_type}</h1>
                      <p className="flex items-center p-1">
                        <span>{room.guests}</span>{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          class="w-4 h-4 mx-1"
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
                            class="w-6 h-6 mx-1 text-fourth-color"
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
                        {/* {room&& room.amenities.map((item,id)=>(
                        <p key={id}>{item}</p>
                    ))} */}
                        <button
                          className="underline text-fourth-color"
                          onClick={() => openModal(room.room_id)}
                        >
                          More details
                        </button>
                      </div>
                    </div>
                    <div className="flex items-baseline text-Base-color mb-5">
                      <span class="text-4xl font-extrabold tracking-tight">
                        {room.price}
                      </span>
                      <span class="text-3xl font-semibold">JOD</span>
                      <span class="ms-1 text-xl font-normal text-third-color dark:text-gray-400">
                        Per Person
                      </span>
                    </div>
                  </div>
                  <button className="p-2.5 ms-2 text-sm font-medium text-second-color bg-fourth-color rounded-lg border border-fourth-color hover:bg-second-color hover:text-fourth-color">
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
                        class="w-4 h-4 mx-1"
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
                        class="w-4 h-4 mx-1"
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
      </div>
    </div>
  );
};

export default Rooms;
