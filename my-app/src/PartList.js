import React, { useState } from 'react';
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
            <div key={cpu.Name}>
            <p>Name: {cpu.Name}</p>
            <p>Price: {cpu.Price}</p>
            <p>Socket: {cpu.Socket}</p>
            <p>TDP: {cpu.TDP}</p>
            <p>Performance Score: {cpu.PerformanceScore}</p>
        <hr />
      </div>
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
            <div key={gpu.Name}>
            <p>Name: {gpu.Name}</p>
            <p>Price: {gpu.Price}</p>
            <p>TDP: {gpu.TDP}</p>
            <p>Performance Score: {gpu.PerformanceScore}</p>
        <hr />
      </div>
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
            <div key={cased.Name}>
            <p>Name: {cased.Name}</p>
            <p>Price: {cased.Price}</p>
        <hr />
      </div>
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
            <div key={motherboard.Name}>
            <p>Name: {motherboard.Name}</p>
            <p>Price: {motherboard.Price}</p>
            <p>Socket: {motherboard.Socket}</p>
            <p>Memory Type: {motherboard.MemoryType}</p>
        <hr />
      </div>
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
            <div key={ram.Name}>
            <p>Name: {ram.Name}</p>
            <p>Price: {ram.Price}</p>
            <p>Memory Type: {ram.MemoryType}</p>
        <hr />
      </div>
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
            <div key={psu.Name}>
            <p>Name: {psu.Name}</p>
            <p>Price: {psu.Price}</p>
            <p>Wattage: {psu.Wattage}</p>
        <hr />
      </div>
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
            <div key={storage.Name}>
            <p>Name: {storage.Name}</p>
            <p>Price: {storage.Price}</p>
            <p>Capacity: {storage.Capacity}</p>
        <hr />
      </div>
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
            <div key={cooler.Name}>
            <p>Name: {cooler.Name}</p>
            <p>Price: {cooler.Price}</p>
        <hr />
      </div>
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
            <div key={laptop.Name}>
            <p>Name: {laptop.Name}</p>
            <p>Price: {laptop.Price}</p>
            <p>Storage: {laptop.Storage}</p>
            <p>Category: {laptop.Category}</p>
        <hr />
      </div>
    ))}
  </div>
      )}

    </div>
  );
};

export default PartList;
