import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Comments from "./Comments";
import { useBooking } from "../Context/BookingContext";
import { useNavigate } from "react-router-dom";

const AccommodationDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState("Standard");
  const { bookData, onBooking } = useBooking();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (index) => {
    setActiveIndex(index);
  };
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
    accommodation_id: 0,
  });
  const [accommodation, setAccommodation] = useState(null);
  const [similarPlace, setSimilarPlace] = useState([]);

  //   carousel images
  const images = [
    "https://cf2.bstatic.com/xdata/images/hotel/max1024x768/385542203.jpg?k=44f98623a32195ef2c7ce0fcd0f4d4fd99057a6277d1b54fc884f1756670396a&o=&hp=1",
    "https://cf2.bstatic.com/xdata/images/hotel/max1024x768/453833024.jpg?k=31d4a578139ec96d135c27eaf0ff787adce55b533ebffddddf8c31c6b6c8818e&o=&hp=1",
    "https://cf2.bstatic.com/xdata/images/hotel/max1024x768/432525446.jpg?k=d17d4e47362bc172ac80b56f63c11632b2c14407380636caae54bd3cb1d9dd2d&o=&hp=1",
    "https://cf2.bstatic.com/xdata/images/hotel/max1024x768/359056434.jpg?k=065fb27e9abcb4f61f1c6932e9cb57b2eb46af7f062c602522400b9f391166ca&o=&hp=1",
    "https://cf2.bstatic.com/xdata/images/hotel/max1024x768/326714529.jpg?k=b652add7e62b83cb51ab4849db4b7ef8a26bd9232b86488417e496aab1334479&o=&hp=1",
    "https://cf2.bstatic.com/xdata/images/hotel/max1024x768/351768928.jpg?k=574991b267087079b1b22cd655938369b1f0c485ed71c773ab182a2528cdd8fd&o=&hp=1",
    "https://cf2.bstatic.com/xdata/images/hotel/max1024x768/326714728.jpg?k=bbe441f4411b6d2e9d7465281c6da18f9900b39d09b4e4ed9230adced402a336&o=&hp=1",
  ];
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
  function handleChange(e) {
    const { name, value } = e.target;
    setBooking({
      ...booking,
      [name]: value,
    });
  }
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
    
    useEffect(()=>{
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
    },[accommodation])

  async function handleSubmit(e) {
    let total =
      booking.adults * booking.cost + (booking.children * booking.cost) / 2;
    if (booking.room_preference === "Delux") {
      total += 10;
    } else if (booking.room_preference === "Suite") {
      total += 20;
    }
    booking.cost = total;
    booking.accommodation_id = id;

    e.preventDefault();
    try {
      onBooking(booking);
      history("/payment");
    } catch (error) {
      console.error("Error:", error);
    }
  }
  // console.log(accommodation);
  return (
    <div>
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
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/40 group-focus:ring-4">
            <svg
              className="w-4 h-4 text-white rtl:rotate-180"
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
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/40 group-focus:ring-4">
            <svg
              className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
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
              <h1 className="text-sky-700 text-start text-3xl font-bold">
                {accommodation.title}
              </h1>
              <h5 className="text-start text-xl">
                {accommodation.accommodation_details}
              </h5>
              <div className="flex justify-between">
                {/* amenities */}
                <div className="flex flex-col gap-6">
                  <h1 className="text-sky-700 text-start text-3xl font-bold">
                    Amenities
                  </h1>
                  <ol className="text-start text-xl list-disc list-inside">
                    {accommodation.amenities.map((data, id) => (
                      <li key={id}>{data}</li>
                    ))}
                  </ol>
                  <h1 className="text-sky-700 text-start text-3xl font-bold">
                    Price
                  </h1>
                  <h5 className="text-start text-xl">
                    {accommodation.pricing} JOD
                  </h5>
                </div>
                {/* location */}
                <div className="w-1/2">
                  <h5 className="text-start text-sky-700 text-2xl font-bold">
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
                    <h5 className="text-start text-sky-700 text-2xl font-bold pb-10">
                      Other Accommodations in {accommodation.country}
                    </h5>
                    <div className="flex flex-col md:flex-row flex-wrap gap-8 justify-start items-center mx-auto">
                      {similarPlace&&similarPlace.length>0&& similarPlace.map((item, id)=>(
                        <Link key={id} to={`/accommodation/${item.accommodation_id}`}>
                        <article className="w-[20rem] shadow-xl bg-cover bg-center overflow-hidden h-[410px] transform duration-500 hover:-translate-y-2 cursor-pointer group" style={{ backgroundImage: `url(${item.imageurl[0]})`}}>
                          <div className="text-start hover:bg-[#12243a8f] bg-opacity-20 h-full px-5 flex flex-wrap flex-col pt-44 hover:bg-opacity-75 transform duration-300">
                            <h1 className="text-white text-2xl mb-5 transform translate-y-20 group-hover:translate-y-0 duration-300">
                              {item.title}
                            </h1>
                            <div className="w-16 h-2 bg-sky-700 rounded-full mb-5 transform translate-y-20 group-hover:translate-y-0 duration-300"></div>
                            <p className="my-3 py-3 opacity-0 max-h-[90px] overflow-hidden text-white text-xl group-hover:opacity-80 transform duration-500">
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
              <div className="py-12">
                <Comments id={id} type="Accommodations"></Comments>
              </div>
              <div className="p-3 border border-sky-700 rounded-xl bg-gray-100">
                <form action="" onSubmit={handleSubmit}>
                  <div className="min-h-screen flex justify-center items-start md:items-center">
                    <div className="py-12 px-12 w-full">
                      <div className="flex flex-col justify-center">
                        <h1 className="text-3xl text-sky-900 font-bold text-start mb-4 cursor-pointer">
                          Hotel booking
                        </h1>
                      </div>
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
                        <label className="px-3 self-start">
                          Room preference
                        </label>
                        <div className="flex flex-wrap gap-6 self-start px-3">
                          <div class="flex items-center">
                            <input
                              checked={room === "Standard"}
                              id="default-radio-1"
                              type="radio"
                              value=""
                              name="default-radio"
                              class="w-4 h-4 text-sky-900 bg-gray-100 border-gray-300"
                              onChange={() => {
                                setBooking({
                                  ...booking,
                                  room_preference: "Standard",
                                });
                                setRoom("Standard");
                              }}
                            />
                            <label
                              for="default-radio-1"
                              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              Standard
                            </label>
                          </div>
                          <div class="flex items-center">
                            <input
                              checked={room === "Delux"}
                              id="default-radio-2"
                              type="radio"
                              value=""
                              name="default-radio"
                              class="w-4 h-4 text-sky-900 bg-gray-100 border-gray-300"
                              onChange={() => {
                                setBooking({
                                  ...booking,
                                  room_preference: "Delux",
                                });
                                setRoom("Delux");
                              }}
                            />
                            <label
                              for="default-radio-2"
                              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              Delux
                            </label>
                          </div>
                          <div class="flex items-center">
                            <input
                              checked={room === "Suite"}
                              id="default-radio-2"
                              type="radio"
                              value=""
                              name="default-radio"
                              class="w-4 h-4 text-sky-900 bg-gray-100 border-gray-300"
                              onChange={() => {
                                setBooking({
                                  ...booking,
                                  room_preference: "Suite",
                                });
                                setRoom("Suite");
                              }}
                            />
                            <label
                              for="default-radio-2"
                              class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              Suite
                            </label>
                          </div>
                        </div>
                        <label className="px-3 self-start">Guests</label>
                        <div className="flex self-start w-1/2 gap-5">
                          <input
                            type="number"
                            name="adults"
                            placeholder="Adults"
                            value={booking.adults}
                            onChange={handleChange}
                            required
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

export default AccommodationDetails;
