import React from "react";

const TypeChoice = ({ onChoiceSelected, visible }) => {
  const handleChoice = (choice) => {
    onChoiceSelected(choice);
  };

  return (
    <div id="type-choice" className={visible ? "" : "invisible"}>
      <h1>What type of PC do you want?</h1>
      <button onClick={() => handleChoice("Gaming")}>Gaming</button>
      <button onClick={() => handleChoice("Production")}>Production</button>
    </div>
  );
};

export default TypeChoice;
