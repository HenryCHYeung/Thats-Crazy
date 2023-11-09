import React, { useState } from "react";
import "./App.css";
import PaymentForm from "./PaymentForm.js";

function Results({ userChoice, selectedPrice, selectedStorage }) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const goToPaymentForm = () => {
    setShowPaymentForm(true);
  };

  return (
    <div>
      {showPaymentForm ? (
        <PaymentForm />
      ) : (
        <div id="results"> 
          <h1>Results</h1>
          <p>User Choice: {userChoice}</p>
          <p>Selected Storage: {selectedStorage}</p> 
          <p>Selected Price: {selectedPrice}</p>
          <p>PART INFO HERE</p>
          <button onClick={goToPaymentForm}>Proceed to Payment</button>
        </div>
      )}
    </div>
  );
}

export default Results;