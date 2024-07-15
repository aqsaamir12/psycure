import React, { useEffect, useState } from "react";
import  "./Appointment.css";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

/**
 * Component for handling payment checkout.
 *
 * @component
 */
export default function CheckoutForm({setStatus}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

   /**
   * Handles form submission for processing payment.
   *
   * @param {Event} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      
      return;
    }

    setIsLoading(true);
    try {
       // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: 'if_required'
 
      });
  
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        toast.error(error.message)
      } else {
        toast.error(error.message)
        setMessage("An unexpected error occurred.");
      }
    } else {
      setStatus(true);
      toast.success("Payment succeeded!")
    }
  } catch (error) {
    // Handle exception
    toast.error(error.message)
    console.error("Error confirming payment:", error);
  }
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="check_out_history">

      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
          {console.log(isLoading)}
        </span>
      </button>
    </form>
  );
}