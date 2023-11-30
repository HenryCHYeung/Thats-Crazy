// PartList.js

import React, { useState, useEffect } from 'react';
import PartDetails from './PartDetails';
import axios from 'axios';
import './PartList.css'; // Import the CSS file

const PartList = () => {
  const [selectedPart, setSelectedPart] = useState('CPU'); // Set CPU as default
  const [partDetails, setPartDetails] = useState(null);
  const [fade, setFade] = useState(false);

  const sections = ['CPU', 'GPU', 'Cases', 'Motherboard', 'RAM', 'PSU', 'Storage', 'CPUCooler', 'Laptop'];

  useEffect(() => {
    // Fetch data for the default selected part (CPU)
    fetchData(selectedPart);
  }, [selectedPart]); // Dependency array ensures this effect runs only once, similar to componentDidMount

  const fetchData = async (part) => {
    try {
      setFade(true); // Trigger fade-out effect
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for fade-out transition
      const response = await axios.post('/parts', { part });
      console.log(response.data);
      setPartDetails(response.data);
      setFade(false); // Trigger fade-in effect
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSectionClick = async (part) => {
    if (selectedPart !== part) {
      setFade(true); // Trigger fade-out effect
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for fade-out transition
      setSelectedPart(part);
      await fetchData(part);
      setFade(false); // Trigger fade-in effect
    }
  };

  const getSectionLabel = (section) => {
    // Map section labels as needed
    const sectionLabels = {
      CPUCooler: 'CPU Cooler',
      // Add other mappings as needed
    };
  
    return sectionLabels[section] || section;
  };
  

  return (
    <div id='partlist'>
      <h3 className='partLabel'>All Parts</h3>

      <div className="section-links">
        {sections.map((part) => (
          <button
          key={part}
          onClick={() => handleSectionClick(part)}
          className={selectedPart === part ? 'active' : ''}
        >
          {getSectionLabel(part)}
        </button>
      ))}
      </div>

      <div className="part-container">
        <div className={`part-list ${fade ? 'fade-out' : ''}`}>
          {selectedPart && partDetails && (
            <div>
              {partDetails.map((part) => (
                <PartDetails key={part.Name} part={part} type={selectedPart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartList;