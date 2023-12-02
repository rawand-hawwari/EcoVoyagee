import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  iconStyle: "solid",
  // hidePostalCode: false,
  style: {
    base: {
      iconColor: "#0369a1",
      color: "#0c4a6e",
      fontSize: "20px",
      fontFamily: '"Open Sans", sans-serif',
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#6b7280"
      },
    },
    invalid: {
      color: "#e5424d",
      ":focus": {
        color: "#303238"
      }
    }
  }
};

function CardSection() {
    return <CardElement options={CARD_ELEMENT_OPTIONS} />;
  }
  export default CardSection;