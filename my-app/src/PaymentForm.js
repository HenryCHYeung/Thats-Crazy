import React, { useState } from "react";
import "./App.css";


function PaymentForm() {
  const [submitted, setSubmitted] = useState(false); // for the final bit of conditional rendering!

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from actually submitting (for demonstration purposes)
    setSubmitted(true);
  };

  return ( //final bit of condtional rendering! a placeholder form followed by a basic thingy
    <div id="payment">
      {submitted ? (
        <h1>Done!</h1>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" />
          </label>
          <label>
            Card Number:
            <input type="text" />
          </label>
          <label>
            Expiration Date:
            <input type="text" />
          </label>
          <label>
            Security Number:
            <input type="text" />
          </label>
          <input type="submit" value="Submit" />
        </form>
      )}
    </div>
  );
}

export default PaymentForm;
