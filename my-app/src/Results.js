import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import PaymentForm from "./PaymentForm.js";

function Results({ userChoice, selectedPrice, selectedStorage }) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  console.log(userChoice)
  axios                 // POST request to send user inputs to server
    .post("/finished", {
      body: userChoice})
    .then((response) => {           // Receives response from server after running algorithm
      console.log(response.data);
    });

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