import React, { useState } from 'react';
import PartDetails from './PartDetails';
import axios from 'axios';

const PartList = () => {
  const [selectedPart, setSelectedPart] = useState(null);
  const [partDetails, setPartDetails] = useState(null);
  
  const fetchData = async (part) => {
    try {
      const response = await axios.post('/parts', { part });
      console.log(response.data);
  
      // Assuming the array is available directly in response.data
      setPartDetails(response.data);
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
      {selectedPart === 'CPU' && partDetails && (
        <div>
          {partDetails.map(cpu => (
            <PartDetails key={cpu.Name} part={cpu} type={selectedPart} />
          ))}
        </div>
      )}

      <h4>GPUs</h4>
      <button onClick={() => showParts('GPU')}>
        {selectedPart === 'GPU' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'GPU' && partDetails && (
        <div>
          {partDetails.map(gpu => (
            <PartDetails key={gpu.Name} part={gpu} type={selectedPart} />
          ))}
        </div>
      )}

      <h4>Cases</h4>
      <button onClick={() => showParts('Cases')}>
        {selectedPart === 'Cases' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'Cases' && partDetails && (
        <div>
          {partDetails.map(cased => (
            <PartDetails key={cased.Name} part={cased} type={selectedPart} />
          ))}
        </div>
      )}

      <h4>Motherboards</h4>
      <button onClick={() => showParts('Motherboard')}>
        {selectedPart === 'Motherboard' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'Motherboard' && partDetails && (
        <div>
          {partDetails.map(motherboard => (
            <PartDetails key={motherboard.Name} part={motherboard} type={selectedPart} />
          ))}
        </div>
      )}

      <h4>RAM</h4>
      <button onClick={() => showParts('RAM')}>
        {selectedPart === 'RAM' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'RAM' && partDetails && (
        <div>
          {partDetails.map(ram => (
            <PartDetails key={ram.Name} part={ram} type={selectedPart} />
          ))}
        </div>
      )}

      <h4>PSUs</h4>
      <button onClick={() => showParts('PSU')}>
        {selectedPart === 'PSU' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'PSU' && partDetails && (
        <div>
          {partDetails.map(psu => (
            <PartDetails key={psu.Name} part={psu} type={selectedPart} />
          ))}
        </div>
      )}
      <h4>Storage</h4>
      <button onClick={() => showParts('Storage')}>
        {selectedPart === 'Storage' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'Storage' && partDetails && (
        <div>
          {partDetails.map(storage => (
            <PartDetails key={storage.Name} part={storage} type={selectedPart} />
          ))}
        </div>
      )}

      <h4>CPU Cooler</h4>
      <button onClick={() => showParts('CPUCooler')}>
        {selectedPart === 'Cooler' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'CPUCooler' && partDetails && (
        <div>
          {partDetails.map(cooler => (
            <PartDetails key={cooler} part={cooler} type={selectedPart} />
          ))}
        </div>
      )}

      <h4>Laptops</h4>
      <button onClick={() => showParts('Laptop')}>
        {selectedPart === 'Laptop' ? 'Hide' : 'Show'}
      </button>
      {selectedPart === 'Laptop' && partDetails && (
        <div>
          {partDetails.map(laptop => (
            <PartDetails key={laptop.Name} part={laptop} type={selectedPart}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartList;
