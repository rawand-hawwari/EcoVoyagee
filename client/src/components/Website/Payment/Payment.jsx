import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ElementsConsumer } from "@stripe/react-stripe-js";
import { useBooking } from "../../Context/BookingContext";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const STRIPE_PUBLISHABLE_KEY = "pk_test_51OF0wGLz8T2xmaTmlGyyYlzySbUQ8dh3nJbAQGxBYgRlfYResBCMAb7siQdaJ9jWO2OmXXrHFEaQ5uZW6at3zWP100OuLbiZEu"
const clientSecret =
  "sk_test_51OF0wGLz8T2xmaTmWCAba6QFU2beCyjnk9NJoy8sVRcmEy8XdQcSiOArBOredFlXHAay9162zzHSa9BMvO3EK2gs00KuCAJ0yH";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function Payment() {
  const { bookData, onBooking } = useBooking();

  return (
    <>
      <div className="flex flex-col md:flex-row gap-5 p-5 md:px-16 justify-center items-start min-h-screen">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl text-sky-900 font-bold text-start mb-4">
            Information
          </h1>
          <div className="text-start px-3 text-lg md:text-xl text-gray-950">
            <h1>Name: <strong>{bookData.first_name} {bookData.last_name}</strong></h1>
            <h1>Address: <strong>{bookData.address}</strong></h1>
            <h1>Phone number: <strong>{bookData.phone}</strong></h1>
            <h1></h1>
            <h1>Number of guests: <strong>{bookData.adults}</strong>Adults  {bookData.last_name===0?"":<span><strong>{bookData.children}</strong>Chlidren</span>}</h1>
            <h1>Total cost: <strong>{bookData.cost}JOD</strong></h1>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-auto">
          <h1 className="text-3xl text-sky-900 font-bold text-start mb-4">
            Payment
          </h1>
          {clientSecret && stripePromise && (
            <Elements stripe={stripePromise}>
              <ElementsConsumer>
                {({ stripe, elements }) => (
                  <CheckoutForm
                    stripe={stripe}
                    elements={elements}
                  />
                )}
              </ElementsConsumer>
            </Elements>
          )}
        </div>
      </div>
    </>
  );
}

export default Payment;
