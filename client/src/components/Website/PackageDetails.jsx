import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import { useBooking } from "../Context/BookingContext";
import { useNavigate } from "react-router-dom";

const PackageDetails = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState([]);
  const { bookData, onBooking } = useBooking();
  const [itinerary, setItinerary] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [exclusions, setExclusions] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const history = useNavigate();

  const [booking, setBooking] = useState({
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    adults: 0,
    children: 0,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setBooking({
      ...booking,
      [name]: value,
    });
  }
  async function handleSubmit(e) {
    let total =
      booking.adults * booking.cost + (booking.children * booking.cost) / 2;
    booking.cost = total;
    booking.packages_id = id;

    e.preventDefault();
    try {
      onBooking(booking);
      history("/payment");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    axios
      .get(`http://localhost:3999/getPackagesById/${id}`)
      .then((response) => {
        // Handle the response data here
        setPackageData(response.data[0]);
        booking.cost = response.data[0].cost;
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, []);
  useEffect(() => {
    setItinerary(packageData.itinerary);
    setInclusions(packageData.inclusions);
    setExclusions(packageData.exclusions);
    setHighlights(packageData.highlights);
  }, [packageData]);

  function renderAttributes(obj) {
    return (
      <>
        {Object.keys(obj).map((key, id) =>
          obj === itinerary ? (
            <li key={id} className="pb-3">
              <strong>{key}:</strong> {obj[key]}
            </li>
          ) : (
            <li key={id} className="pb-3">
              {obj[key]}
            </li>
          )
        )}
      </>
    );
  }

  return (
    <div>
      <div className="w-full h-96 bg-cover bg-[50%] bg-[url('https://cdn.pixabay.com/photo/2017/06/04/16/32/new-york-2371488_960_720.jpg')]"></div>
      <div className="flex flex-col justify-center items-center my-10">
        <div className="w-2/3">
          {packageData && (
            <div className="flex flex-col gap-10">
              {/* title */}
              <h1 className="text-sky-900 text-start text-3xl font-bold">
                {packageData.title}{" "}
                <span className="text-gray-500 text-xl font-normal">
                  {itinerary ? (
                    Object.keys(itinerary).length === 1 ? (
                      "Day"
                    ) : (
                      `${Object.keys(itinerary).length} Days`
                    )
                  ) : (
                    <></>
                  )}
                </span>
              </h1>
              {/* overview */}
              <h5 className="text-start text-xl">
                <span className="text-2xl text-sky-700 font-bold">
                  Overview
                </span>{" "}
                <br />
                {packageData.overview}
              </h5>
              {/* Itinerary */}
              <h5 className="text-start text-xl">
                <span className="text-2xl text-sky-700 font-bold">
                  Itinerary
                </span>{" "}
                <br />
              </h5>

              <ol className="text-start text-xl px-5">
                {itinerary && Object.keys(itinerary).length > 0 ? (
                  renderAttributes(itinerary)
                ) : (
                  <li className="pb-3">No itinerary data available.</li>
                )}
              </ol>
              {/* highlights */}
              <h5 className="text-start text-xl">
                <span className="text-2xl text-sky-700 font-bold">
                  Highlights
                </span>{" "}
                <br />
              </h5>
              <ol className="text-start text-xl px-5 list-disc list-inside">
                {highlights && Object.keys(highlights).length > 0 ? (
                  renderAttributes(highlights)
                ) : (
                  <li>No itinerary data available.</li>
                )}
              </ol>
              {/* details */}
              <h1 className="text-sky-900 text-start text-3xl font-bold">
                Trip details
              </h1>
              {/* cost */}
              <h5 className="text-2xl text-start text-sky-700 font-bold">
                Cost
              </h5>
              <h5 className="text-start text-xl px-3">
                {packageData.cost} JOD per person
              </h5>

              {/* inclusion */}
              <h5 className="text-2xl text-start text-sky-700 font-bold">
                Inclusions
              </h5>
              <ol className="text-start text-xl px-5 list-disc list-inside">
                {inclusions && Object.keys(inclusions).length > 0 ? (
                  renderAttributes(inclusions)
                ) : (
                  <li>No itinerary data available.</li>
                )}
              </ol>

              {/* exclusions */}
              <h5 className="text-2xl text-start text-sky-700 font-bold">
                Exclusions
              </h5>
              <ol className="text-start text-xl px-5 list-disc list-inside">
                {exclusions && Object.keys(exclusions).length > 0 ? (
                  renderAttributes(exclusions)
                ) : (
                  <li>No itinerary data available.</li>
                )}
              </ol>
              {/* location */}
              <h5 className="text-start text-sky-700 text-2xl font-bold">
                Location
              </h5>
              <iframe
                title="Google Map"
                width="100%"
                height="100%"
                // frameBorder="0"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217782.0981603825!2d34.446245060239825!3d31.473441914110314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14fd7f054e542767%3A0x7ff98dc913046392!2sGaza!5e0!3m2!1sen!2sus!4v1699644333625!5m2!1sen!2sus"
                allowFullScreen
              />
              {/* reviews */}
              <div className="py-12">
                <Comments id={id} type="Packages"></Comments>
              </div>

              <div>
                <h5 className="text-2xl text-start text-sky-700 font-bold mb-5">
                  Book your trip
                </h5>
                <form
                  action=""
                  onSubmit={handleSubmit}
                  className="bg-gray-100 border border-sky-700 rounded-xl"
                >
                  <div className="min-h-screen flex justify-center items-start md:items-center">
                    <div className="p-8 w-full">
                      <div className="space-y-4 flex flex-col justify-center items-center">
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
                        <label className="px-3 self-start">Address</label>
                        <input
                          type="text"
                          name="address"
                          placeholder="Address"
                          value={booking.address}
                          onChange={handleChange}
                          className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                        />
                        <label className="px-3 self-start">Phone</label>
                        <input
                          type="number"
                          name="phone"
                          placeholder="Phone"
                          value={booking.phone}
                          onChange={handleChange}
                          className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                        />
                        <label className="px-3 self-start">Guests</label>
                        <div className="flex self-start w-1/2 gap-5">
                          <input
                            type="number"
                            name="adults"
                            placeholder="Adults"
                            value={booking.adults}
                            onChange={handleChange}
                            className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                          />
                          <input
                            type="number"
                            name="children"
                            placeholder="Children"
                            value={booking.children}
                            onChange={handleChange}
                            className="block text-sm py-3 px-4 rounded-lg w-full border border-[#0c4a6e69] outline-none"
                          />
                        </div>
                      </div>
                      <div className="text-center mt-6">
                        <button
                          type="submit"
                          className="py-3 w-64 text-xl text-white hover:text-sky-900 bg-sky-900 border-2 hover:bg-white border-sky-900 rounded-2xl"
                        >
                          Book
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

export default PackageDetails;
