import React, { useState } from "react";
import Results from "./Results.js";
import "./App.css";

function PriceChoice({ userChoice, gamingPrices, productionPrices }) {
  const selectedPrices = userChoice === "Gaming" ? gamingPrices : productionPrices;
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handlePriceSelection = (price) => {
    setSelectedPrice(price);
    setShowResults(true);
  };

  return (
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
            {selectedPrices.map((price, index) => (
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