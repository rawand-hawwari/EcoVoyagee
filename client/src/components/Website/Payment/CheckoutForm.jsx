import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import CardSection from "./CardSection";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useBooking } from "../../Context/BookingContext";
import { useAuth } from "../../Context/AuthContext";

export default function CheckoutForm() {
  const [success, setSuccess] = useState(false);
  const { bookData, onBooking } = useBooking();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const stripe = useStripe();
  const elements = useElements();
  const token = cookies["token"];
  const { headers } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    console.log(bookData);
    const booking = {
      first_name: bookData.first_name,
      last_name: bookData.last_name,
      address: bookData.address,
      phone: bookData.phone,
      room_preference: bookData.room_preference,
      adults: bookData.adults,
      children: bookData.children,
      cost: bookData.cost,
    };
    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post(
          "http://localhost:3999/payment",
          {
            amount: bookData.cost * 100,
            id,
          },
          {
            headers: headers,
          }
        );

        if (response.data.success) {
          try {
            setSuccess(true);
            if (bookData.accommodation_id) {
              console.log(bookData.accommodation_id);
              const response = await axios.post(
                `http://localhost:3999/BookAccommodation/${bookData.accommodation_id}`,
                booking,
                {
                  headers: {
                    headers,
                  },
                }
              );
            } else if (bookData.packages_id) {
              console.log(bookData.packages_id);
              const response = await axios.post(
                `http://localhost:3999/BookPackage/${bookData.packages_id}`,
                booking,
                {
                  headers: {
                    headers,
                  },
                }
              );
            }

            Swal.fire({
              title: "Payment Successful!",
              icon: "success",
              showCancelButton: false,
              confirmButtonText: "OK",
              customClass: {
                confirmButton:
                  "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
              },
            });
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message,
              confirmButtonText: "OK",
              customClass: {
                confirmButton:
                  "bg-sky-900 hover:bg-white text-white hover:text-sky-900 border border-sky-900 py-2 px-4 rounded",
              },
            });
          }
        }
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <div>
      <form
        className="flex flex-col gap-3 border border-sky-700 p-5 bg-gray-200"
        onSubmit={handleSubmit}
      >
        <div className="p-5">
          <CardSection />
        </div>
        <button className="btn-pay py-2 px-4 w-1/3 text-md text-white hover:text-sky-900 bg-sky-900 border-2 hover:bg-white border-sky-900 rounded-2xl">
          Buy Now
        </button>
      </form>
    </div>
  );
}
