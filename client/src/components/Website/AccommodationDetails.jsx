import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import { useBooking } from "../Context/BookingContext";
import { useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

const AccommodationDetails = () => {
  const { id } = useParams();
  // const [room, setRoom] = useState("Standard");
  const { bookData, onBooking } = useBooking();
  const [activeIndex, setActiveIndex] = useState(0);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const history = useNavigate();
  const [booking, setBooking] = useState({
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    cost: 0,
    accommodation_id: 0,
  });
  const [accommodation, setAccommodation] = useState(null);
  const [similarPlace, setSimilarPlace] = useState([]);

  const [currentImage, setCurrentImage] = useState(0);
  const nextSlide = () => {
    if (accommodation) {
      if (currentImage === accommodation.imageurl.length - 1) {
        setCurrentImage(0);
      } else {
        setCurrentImage(currentImage + 1);
      }
    }
  };
  const prevSlide = () => {
    if (accommodation) {
      if (currentImage === 0) {
        setCurrentImage(accommodation.imageurl.length - 1);
      } else {
        setCurrentImage(currentImage - 1);
      }
    }
  };
  //   end carousel images
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    axios
      .get(`http://localhost:3999/getAccommodationsByID/${id}`)
      .then((response) => {
        // Handle the response data here
        setAccommodation(response.data[0]);
        booking.cost = response.data[0].pricing;
        // setTypes(response.data.destinations_type);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3999/getAccommodations`)
      .then((response) => {
        // setSimilarPlace(response.data[0]);
        if (accommodation) {
          let filtered = response.data.filter(
            (item) => item.country === accommodation.country
          );
          filtered = filtered.filter(
            (item) => item.accommodation_id !== accommodation.accommodation_id
          );
          setSimilarPlace(filtered);
        }
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, [accommodation]);

  function handleChange(e) {
    const { name, value } = e.target;
    setBooking({
      ...booking,
      [name]: value,
    });
  }
  
  async function handleSubmit(e) {
    e.preventDefault();
    let total =
    booking.adults * booking.cost + (booking.children * booking.cost) / 2;
    booking.cost = total;
    booking.accommodation_id = id;
    booking.date_to=endDate;
    booking.date_from=startDate;
    
    console.log(booking);
    try {
      onBooking(booking);
      history(`/rooms/${id}`);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="text-Base-color">
      {/* images */}
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="slide"
      >
        <div className="relative h-[420px] overflow-hidden rounded-lg">
          {accommodation &&
            accommodation.imageurl.map((image, id) => (
              <div
                key={id}
                className={`duration-700 ease-in-out ${
                  currentImage === id ? "block" : "hidden"
                }`}
                data-carousel-item
              >
                <img
                  src={image}
                  className="absolute block w-full object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt={accommodation.title}
                />
              </div>
            ))}
        </div>
        <button
          onClick={() => prevSlide()}
          type="button"
          className="absolute top-0 left-5 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-second-color/30 group-hover:bg-second-color/40 group-focus:ring-4">
            <svg
              className="w-4 h-4 text-second-color rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          onClick={() => nextSlide()}
          type="button"
          className="absolute top-0 right-5 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-second-color/30 group-hover:bg-second-color/40 group-focus:ring-4">
            <svg
              className="w-4 h-4 text-second-color dark:text-gray-800 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>

      <div className="flex flex-col justify-center items-center my-10">
        <div className="w-2/3">
          {accommodation && (
            <div className="flex flex-col gap-10">
              {/* title */}
              <h1 className="text-third-color text-start text-3xl font-bold">
                {accommodation.title}
              </h1>
              <h5 className="text-start text-xl">
                {accommodation.accommodation_details}
              </h5>
              <div className="flex justify-between">
                {/* amenities */}
                <div className="flex flex-col gap-6">
                  <h1 className="text-third-color text-start text-3xl font-bold">
                    Amenities
                  </h1>
                  <ol className="text-start text-xl list-disc list-inside">
                    {accommodation.amenities.map((data, id) => (
                      <li key={id}>{data}</li>
                    ))}
                  </ol>
                  <h1 className="text-third-color text-start text-3xl font-bold">
                    Price
                  </h1>
                  <h5 className="text-start text-xl">
                    {accommodation.pricing} JOD
                  </h5>
                </div>
                {/* location */}
                <div className="w-1/2">
                  <h5 className="text-start text-third-color text-2xl font-bold">
                    Location
                  </h5>
                  <iframe
                    title="Google Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217782.0981603825!2d34.446245060239825!3d31.473441914110314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14fd7f054e542767%3A0x7ff98dc913046392!2sGaza!5e0!3m2!1sen!2sus!4v1699644333625!5m2!1sen!2sus"
                    allowFullScreen
                  />
                </div>
              </div>
              {/* others */}
              <div className="py-12">
                {similarPlace && similarPlace.length > 0 && (
                  <>
                    <h5 className="text-start text-third-color text-2xl font-bold pb-10">
                      Other Accommodations in {accommodation.country}
                    </h5>
                    <div className="flex flex-col md:flex-row flex-wrap gap-8 justify-start items-center mx-auto">
                      {similarPlace &&
                        similarPlace.length > 0 &&
                        similarPlace.map((item, id) => (
                          <Link
                            key={id}
                            to={`/accommodation/${item.accommodation_id}`}
                          >
                            <article
                              className="w-[20rem] shadow-xl bg-cover bg-center overflow-hidden h-[410px] transform duration-500 hover:-translate-y-2 cursor-pointer group"
                              style={{
                                backgroundImage: `url(${item.imageurl[0]})`,
                              }}
                            >
                              <div className="text-start bg-transparent-fourth-color hover:bg-transparent-second-color bg-opacity-20 h-full px-5 flex flex-wrap flex-col pt-44 hover:bg-opacity-75 transform duration-300">
                                <h1 className="text-second-color text-2xl mb-5 transform translate-y-20 group-hover:translate-y-0 duration-300">
                                  {item.title}
                                </h1>
                                <div className="w-16 h-2 bg-fourth-color rounded-full mb-5 transform translate-y-20 group-hover:translate-y-0 duration-300"></div>
                                <p className="my-3 py-3 opacity-0 max-h-[90px] overflow-hidden text-second-color text-xl group-hover:opacity-80 transform duration-500">
                                  {item.accommodation_details}
                                </p>
                              </div>
                            </article>
                          </Link>
                        ))}
                    </div>
                  </>
                )}
              </div>

              {/* comments */}
              <div className="py-12">
                <Comments id={id} type="Accommodations"></Comments>
              </div>

              {/* booking form */}
              <div className="p-3 border border-third-color rounded-xl bg-transparent-first-color">
                <form action="" onSubmit={handleSubmit}>
                  <div className="flex justify-center items-start md:items-center">
                    <div className="py-12 px-12 w-full">
                      <h1 className="text-3xl text-third-color font-bold text-center mb-4 cursor-pointer">
                        Book a room
                      </h1>
                      <div className="space-y-4 flex flex-col justify-center items-center">
                        {/* name */}
                        <label className="px-3 self-start">Name</label>
                        <div className="flex w-full gap-5">
                          <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={booking.first_name}
                            onChange={handleChange}
                            className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                          />
                          <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={booking.last_name}
                            onChange={handleChange}
                            className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                          />
                        </div>

                        {/* address */}
                        <label className="px-3 self-start">Address</label>
                        <input
                          type="text"
                          name="address"
                          placeholder="Address"
                          value={booking.address}
                          onChange={handleChange}
                          className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                        />

                        {/* phone number */}
                        <label className="px-3 self-start">Phone</label>
                        <input
                          type="number"
                          name="phone"
                          placeholder="Phone"
                          value={booking.phone}
                          onChange={handleChange}
                          className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                        />

                        {/* date from-to
                        <label className="px-3 self-start">Date</label>
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

                        guests
                        <label className="px-3 self-start">Guests</label>
                        <div className="flex self-start w-1/2 gap-5 items-center">
                          <label className="px-3">Adults:</label>
                          <input
                            type="number"
                            name="adults"
                            placeholder="Adults"
                            value={booking.adults}
                            onChange={handleChange}
                            required
                            className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                          />
                          <label className="px-3">Children:</label>
                          <input
                            type="number"
                            name="children"
                            placeholder="Children"
                            value={booking.children}
                            onChange={handleChange}
                            className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                          />
                        </div> */}
                      </div>
                      <div className="text-center mt-6">
                        <button
                          type="submit"
                          className="py-3 w-64 text-xl text-second-color hover:text-fourth-color bg-fourth-color border-2 hover:bg-second-color border-fourth-color rounded-2xl"
                        >
                          Select Room
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetails;
