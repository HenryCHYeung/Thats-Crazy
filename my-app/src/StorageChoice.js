import React, { useState } from "react";

function StorageChoice({ onStorageSelected }) {
  const storageOptions = ["500 GB", "1 TB", "2 TB"];
  const [showStorageChoice, setShowStorageChoice] = useState(true);

  const handleStorageSelection = (storage) => {
    if (typeof onStorageSelected === "function") {
      onStorageSelected(storage);
      setShowStorageChoice(false); // Hide StorageChoice after selection
    }
  };

  return (
    <div id="storage">
      {showStorageChoice ? (
        <div>
          <h1>Choose Storage</h1>
          {storageOptions.map((storage, index) => (
            <button
              key={index}
              onClick={() => handleStorageSelection(storage)}
            >
              {storage}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default StorageChoice;
