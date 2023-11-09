import React, { useState } from "react";
import Results from "./Results.js";
import StorageChoice from "./StorageChoice.js"; // Make sure to import StorageChoice


function PriceChoice({ userChoice, gamingPrices, productionPrices }) {
  const selectedPrices =
    userChoice === "Gaming" ? gamingPrices : productionPrices;
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showStorageChoice, setShowStorageChoice] = useState(true);
  const [selectedStorage, setSelectedStorage] = useState(null);

  const handlePriceSelection = (price) => {
    setSelectedPrice(price);
    setShowResults(true);
  };

  const handleStorageSelected = (storage) => {
    // Handle the storage selection here if needed
    setShowStorageChoice(false);
    setSelectedStorage(storage); // Add this line to store the selected storage
  };

  return (
    <div id="price">
      {showResults ? (
        <div>
          <Results
            userChoice={userChoice}
            selectedPrice={selectedPrice}
            selectedStorage={selectedStorage}
          />
        </div>
      ) : showStorageChoice ? (
        <div>
          <StorageChoice
            onStorageSelected={handleStorageSelected}
          />
        </div>
      ) : (
        <div>
          <h1>What price are you looking for?</h1>
          {selectedPrices.map((price, index) => (
            <button
              key={index}
              onClick={() => handlePriceSelection(price)}
            >
              {price}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export default PriceChoice;