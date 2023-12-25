import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const DestinationDetails = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [filteredDestination, setFilteredDestination] = useState([]);
  const location = useLocation();

  useEffect(() => {
    axios
      .get(`http://localhost:3999/getDestinationsByID/${id}`)
      .then((response) => {
        // Handle the response data here
        setDestination(response.data[0]);
        // setTypes(response.data.destinations_type);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, [location.pathname]);
  useEffect(() => {
    axios.get("http://localhost:3999/getDestinations").then((response) => {
      if (destination && destination.length !== 0) {
        let filtered = response.data.filter(
          (item) => item.country === destination.country
        );
        filtered = filtered.filter(
          (item) => item.destinations_id !== destination.destinations_id
        );
        setFilteredDestination(filtered);
      }
    });
  }, [destination]);
  return (
    <div>
      <div
        className="w-full h-96 bg-cover bg-[50%] bg-fixed"
        style={{
          backgroundImage: `url(${
            destination && destination.destinationimage
          })`,
          backgroundSize: "cover",
        }}
      ></div>
      <div className="flex flex-col justify-center items-center my-10">
        <div className="w-2/3">
          {destination && (
            <div className="flex flex-col gap-10">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-third-color text-start text-3xl font-bold">
                  {destination.title}
                </h1>
                <Link
                  to={`/flights?destination=${destination.destinations_id}`}
                  className="border-fourth-color border-2 hover:bg-second-color bg-fourth-color hover:text-fourth-color text-second-color font-bold py-2 px-6 rounded"
                >
                  Book your flight
                </Link>
              </div>
              <h5 className="text-start text-xl text-Base-color">{destination.details}</h5>
              <h5 className="text-start text-third-color text-2xl font-bold">
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
              {filteredDestination && filteredDestination.length !== 0 ? (
                <>
                  <h5 className="text-start text-thord-color text-2xl font-bold text-third-color">
                    Other destinations in {destination.country}
                  </h5>
                  <div className="flex flex-col md:flex-row flex-wrap gap-3 justify-start items-center">
                    {filteredDestination.map((item, id) =>
                      id < 3 ? (
                        <Link
                          key={item.destinations_id}
                          to={`/destination/${item.destinations_id}`}
                        >
                          <article className="max-w-[20rem] shadow-xl bg-cover bg-center overflow-hidden h-[410px] transform duration-500 hover:-translate-y-2 cursor-pointer group" style={{backgroundImage:`url(${item.destinationimage})`,backgroundSize: "cover",}}>
                            <div className="text-start hover:bg-transparent-second-color bg-transparent-fourth-color bg-opacity-20 h-full px-5 flex flex-wrap flex-col pt-44 hover:bg-opacity-75 transform duration-300">
                              <h1 className="text-second-color text-2xl mb-5 transform translate-y-20 group-hover:translate-y-0 duration-300">
                                {item.title}
                              </h1>
                              <div className="w-16 h-2 bg-fourth-color rounded-full mb-5 transform translate-y-20 group-hover:translate-y-0 duration-300"></div>
                              <p className="my-3 py-3 opacity-0 max-h-[95px] overflow-hidden text-second-color text-xl group-hover:opacity-80 transform duration-500">
                                {item.details}
                              </p>
                            </div>
                          </article>
                        </Link>
                      ) : (
                        <></>
                      )
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
