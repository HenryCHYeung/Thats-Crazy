import React, { useState } from "react";
import TypeChoice from './TypeChoice.js';
import './App.css';
import PriceChoice from "./PriceChoice.js";

function Home() {
  // Define gamingPrices and productionPrices here
  const gamingPrices = ["$800", "$1000", "$1300", "$1500", "$2000"];
  const productionPrices = [
    "$1300",
    "$1500",
    "$1700",
    "$2000",
    "$2500",
    "$3000",
    "$3500",
  ];

  const [startBut, setStartBut] = useState(false);
  const [userChoice, setUserChoice] = useState(null);

  const handleStartClick = () => {
    setStartBut(true);
  };

  const handleChoiceSelected = (choice) => {
    setUserChoice(choice);
  };

  return (
    <div>
      <div id="home" className={startBut ? "invisible" : ""}>
        <h1>Welcome to the Building Site!</h1>
        <button id="start" onClick={handleStartClick}>Start</button>
      </div>

      {startBut && userChoice ? (
        <PriceChoice
          userChoice={userChoice}
          gamingPrices={gamingPrices}
          productionPrices={productionPrices}
        />
      ) : (
        <TypeChoice
          onChoiceSelected={handleChoiceSelected}
          visible={startBut}
        />
      )}
    </div>
  );
}

export default Home;
