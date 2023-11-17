import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import PaymentForm from "./PaymentForm.js";

function Results({ userChoice, selectedPrice, selectedStorage }) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  axios
    .post("/finished", {            // POST request to send user inputs to server
      userChoice, selectedStorage, selectedPrice})
    .then((response) => {           // Receives response from server after running algorithm
      if (!response.data) {
        console.log("No PC available based on your specifications. That's crazy!");
      } else {
        console.log(response.data);
        console.log("/public/images/CPU/" + response.data.CPU.Name + ".jpg");
        console.log("/public/images/GPU/" + response.data.GPU.Name + ".jpg");
      }
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
          <p>Selected Price: ${selectedPrice}</p>
          <p>PART INFO HERE</p>
          <button onClick={goToPaymentForm}>Proceed to Payment</button>
        </div>
      )}
    </div>
  );
}

export default Results;