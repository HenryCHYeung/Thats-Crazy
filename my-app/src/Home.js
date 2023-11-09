import React, { useState } from "react";
import TypeChoice from './TypeChoice.js';
import './App.css';
import PriceChoice from "./PriceChoice.js";

function Home() { //Home page which contains initial starting variables
  const [startBut, setStartBut] = useState(false); //for the Start button
  const [userChoice, setUserChoice] = useState(null); //for the choice between gaming and production

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

  const handleStartClick = () => { // For the start button
    setStartBut(true);
  };

  const handleChoiceSelected = (choice) => { //Function handling typeChoice
    setUserChoice(choice);
  };

  return (//Making stuff invisible + the conditional rendering between home, StorageChoice and typeChoice, home is just made invisible for simplicity.
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
