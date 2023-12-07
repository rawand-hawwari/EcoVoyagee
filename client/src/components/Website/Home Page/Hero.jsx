import React, { useEffect, useState } from "react";
import axios from "axios";
// import env from "../../../../env"

// import { Link } from "react-router-dom";

const Hero = () => {
  const [isSearch, setIsSearch] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [flights, setFlights] = useState([]);
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3999/getFlights`)
      .then((response) => {
        setFlights(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSearch(true);
    setSearchResult(
      flights.filter(
        (flight) =>
          flight.destination_name
            .toLowerCase()
            .includes(formData.destination.toLowerCase()) ||
          flight.best <= formData.price ||
          new Date(flight.departure_date * 1000).toDateString() >=
            new Date(formData.from).toDateString()
      )
    );
  };
  
  return (
    <>
      <section class="mb-16">
        <div class="relative overflow-hidden bg-cover bg-no-repeat bg-[50%] h-[500px] bg-[url('https://img1.wsimg.com/isteam/ip/044fec34-105c-4e2c-af48-6dfd21091910/man-walking-dog.webp')]">
          <div class="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden bg-fixed bg-[#0c4a6e69]">
            <div class="flex flex-col h-full items-center justify-center">
              <div class="px-6 text-white text-left md:px-12">
                <h1 class="mt-6 mb-16 text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl">
                  Plan Your Eco-Friendly Adventure <br />
                  <span className="text-base md:text-2xl xl:text-3xl font-normal">
                    Start Planning Your Eco-Friendly Trip Today!
                  </span>
                </h1>
              </div>
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex flex-col gap-6 md:flex-row items-center justify-center p-12 container mx-auto rounded-lg md:h-24 bg-[#7dafbfb3]"
              >
                <input
                  class="shadow rounded py-2 px-3 text-gray-700 w-full md:w-1/4"
                  type="text"
                  name="destination"
                  onChange={(e) => handleChange(e)}
                  placeholder="Where are you going?"
                />
                <input
                  class="shadow rounded py-2 px-3 text-gray-700 w-full md:w-1/4"
                  type="number"
                  name="price"
                  onChange={(e) => handleChange(e)}
                  placeholder="Enter your budget"
                />
                <input
                  class="shadow rounded py-2 px-3 text-gray-700 w-full md:w-1/4"
                  name="from"
                  type="date"
                  onChange={(e) => handleChange(e)}
                />
                <input
                  class="shadow rounded py-2 px-3 text-gray-700 w-full md:w-1/4"
                  name="to"
                  type="date"
                  onChange={(e) => handleChange(e)}
                />
                <button class="border-sky-900 border-2 hover:bg-white bg-sky-900 hover:text-sky-900 text-white font-bold py-2 px-4 rounded w-full md:w-1/4">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
        <div id="search"></div>
      </section>
    </>
  );
};

export default Hero;

// https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKBuDQK2W4V4Y2yCf2MDEPvssI6hgedJI4YjonejXWQTzuZoG_
// https://cdn-icons-png.flaticon.com/512/422/422943.png
// https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSjHxdx8Oi2h0W1pjroXEPVsbR_RLc0NdrpviVX95-azW0TA4Jf
