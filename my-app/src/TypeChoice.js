import React from "react";

const TypeChoice = ({ onChoiceSelected }) => {
  const handleChoice = (choice) => { //for getting the choice
    onChoiceSelected(choice); 
  };

  return ( //getting the choice 
    <div id="type-choice">
      <h1>What type of PC do you want?</h1>
      <button onClick={() => handleChoice("Gaming")}>Gaming</button>
      <button onClick={() => handleChoice("Production")}>Production</button>
    </div>
  );
};

export default TypeChoice;
