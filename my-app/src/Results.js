import React, {useState} from "react";
import "./App.css";
import PaymentForm from "./PaymentForm.js";

function Results({ userChoice, selectedPrice }) {
    const [showPaymentForm, setShowPaymentForm] = useState(false); //for conditional rendering


    return ( //even more conditional rendering! between the results and the payment form, NOTE: need to actually implement the algorithm!
      <div>
        {!showPaymentForm ? (
        <div id="results" className={!showPaymentForm ? "" : "invisible"}>
             <h1>Results</h1>
             <p>User Choice: {userChoice}</p>
             <p>Selected Price: {selectedPrice}</p>
             <p>PART INFO HERE</p>
             <button onClick={() => setShowPaymentForm(true)}>Proceed to Payment</button>
        </div>
        ) : (
          <PaymentForm />
        )}
      </div>
    );
  }
  
export default Results;
