import React, { useState } from "react";
import Results from "./Results.js";
import "./App.css";

function PriceChoice({ userChoice, gamingPrices, productionPrices }) { //three arguments passed from Home
  const selectedPrices = userChoice === "Gaming" ? gamingPrices : productionPrices;  //conditional thingy that renders gaming or production depending on the choice
  const [selectedPrice, setSelectedPrice] = useState(null); //for price 
  const [showResults, setShowResults] = useState(false); //for showing results, this might be unneccessary tbh, may need revision

  const handlePriceSelection = (price) => { //sets price, shows results
    setSelectedPrice(price);
    setShowResults(true);
  };

  return ( //more conditional rendering! We are chosing between the priceChoice and Results
    <div id='price'>
    {showResults ? (
      <div>
        <Results 
          userChoice={userChoice}
          selectedPrice={selectedPrice}
        />
        </div>
      ) : (
        <div>
            <h1>What price are you looking for?</h1>
            {selectedPrices.map((price, index) => ( //map out buttons depending on array that is used
                <button key={index} onClick={() => handlePriceSelection(price)}>
                    {price}
                </button>
                ))}
        </div>
      )}
    </div>
  );
}

export default PriceChoice;