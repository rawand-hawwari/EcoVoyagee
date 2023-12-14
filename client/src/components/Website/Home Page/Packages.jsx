import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "aos/dist/aos.css";
import AOS from "aos";

const Packages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Only run the animation once
    });

    axios
      .get("http://localhost:3999/getPackages")
      .then((response) => {
        // Handle the response data here
        setPackages(response.data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="mb-16 mx-3">
      <h1 className="text-third-color text-4xl md:text-start md:mx-32 font-bold py-10">
        Travel Packages
      </h1>
      <div className="mx-auto">
        {packages.length !== 0 && (
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
            <div data-aos="fade-right" className="w-full md:w-auto">
              <article className=" flex flex-col flex-nowrap shadow-lg max-w-3xl md:w-[600px] group transform duration-500 hover:-translate-y-1 bg-second-color border-transparent-first-color border-2">
                <img
                  className="w-full h-72 object-cover"
                  src={packages[0].imagePAC[0]}
                  alt={packages[0].title}
                />
                <div className="h-auto w-full flex flex-col justify-between">
                  <div className="p-5 text-start">
                    <h1 className="text-2xl font-semibold text-Base-color">
                      {packages[0].title}
                    </h1>
                    <p className="text-md overflow-hidden max-h-28 text-Base-color mt-2 leading-relaxed">
                      {packages[0].overview}
                    </p>
                    <p className="text-md overflow-hidden max-h-28 text-Base-color mt-2 leading-relaxed">
                      Destination: {packages[0].country}
                    </p>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-transparent-first-color">
                    <div>
                      <p className="text-lg text-Base-color font-bold">
                        {packages[0].cost} JOD
                      </p>
                    </div>
                    <Link to={`/package/${packages[0].packages_id}`}>
                      <button className="py-2 px-5 bg-fourth-color hover:bg-second-color text-second-color hover:text-fourth-color border border-fourth-color md:text-lg rounded-lg shadow-md">
                        Read more
                      </button>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
            <div
              data-aos="fade-left"
              className="flex flex-col gap-8 lg:gap-4 items-center"
            >
              {packages.map((data, id) => (
                <>
                  {id < 3 && id !== 0 && (
                    <div key={id}>
                      <article className=" flex flex-wrap sm:flex-nowrap shadow-lg border-2 bg-second-color border-transparent-first-color mx-auto max-w-3xl md:w-[500px] group transform duration-500 hover:-translate-y-1">
                        <img
                          className="w-full md:w-52 h-auto md:h-[245px]"
                          src={data.imagePAC[0]}
                          alt={data.title}
                        />
                        <div className="h-[245px] w-full flex flex-col justify-between">
                          <div className="p-5 text-start">
                            <h1 className="text-2xl font-semibold text-Base-color">
                              {data.title}
                            </h1>
                            <p className="text-md overflow-hidden max-h-28 text-third-color mt-2 leading-relaxed">
                              Destination: {data.country}
                            </p>
                          </div>
                          <div className="flex justify-between items-center p-5 bg-transparent-first-color">
                            <div>
                              <p className="text-lg text-Base-color font-bold">
                                {data.cost} JOD
                              </p>
                            </div>
                            <Link to={`/package/${data.packages_id}`}>
                              <button className="py-2 px-5 bg-fourth-color hover:bg-second-color text-second-color hover:text-fourth-color border border-fourth-color md:text-lg rounded-lg shadow-md">
                                Read more
                              </button>
                            </Link>
                          </div>
                        </div>
                      </article>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
