import React, { useState } from 'react';
import axios from 'axios';

const PartList = () => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [partDetails, setPartDetails] = useState(null);

  const fetchData = async (part) => {
    try {
      const response = await axios.post('/parts', {part});
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const showParts = async (part) => {
    if (selectedPart === part) {
      // If the button is clicked again, hide the details
      setSelectedPart(null);
      setPartDetails(null);
    } else {
      // Otherwise, show the details for the selected part
      setSelectedPart(part);
      await fetchData(part);
    }
  };

  return (
    <div>
      <img style={{width:'20%',height:'30%'}} src='/partList.png'/>

      <h3>All Parts</h3>

      <h4>CPUs</h4>
      <button onClick={() => showParts('CPU')}>
        {selectedPart === 'CPU' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'CPU' && partDetails && <p>{partDetails}</p>}

      <h4>GPUs</h4>
      <button onClick={() => showParts('GPU')}>
        {selectedPart === 'GPU' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'GPU' && partDetails && <p>{partDetails}</p>}

      <h4>Cases</h4>
      <button onClick={() => showParts('Cases')}>
        {selectedPart === 'Case' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'Case' && partDetails && <p>{partDetails}</p>}

      <h4>Motherboards</h4>
      <button onClick={() => showParts('Motherboard')}>
        {selectedPart === 'Motherboard' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'Motherboard' && partDetails && <p>{partDetails}</p>}

      <h4>RAM</h4>
      <button onClick={() => showParts('RAM')}>
        {selectedPart === 'RAM' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'RAM' && partDetails && <p>{partDetails}</p>}

      <h4>PSUs</h4>
      <button onClick={() => showParts('PSU')}>
        {selectedPart === 'PSU' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'PSU' && partDetails && <p>{partDetails}</p>}

      <h4>Storage</h4>
      <button onClick={() => showParts('Storage')}>
        {selectedPart === 'Storage' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'Storage' && partDetails && <p>{partDetails}</p>}

      <h4>CPU Cooler</h4>
      <button onClick={() => showParts('CPUCooler')}>
        {selectedPart === 'Cooler' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'Cooler' && partDetails && <p>{partDetails}</p>}
    </div>
  );
};

export default PartList;
