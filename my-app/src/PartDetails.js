import React from 'react';
import "./PartDetails.css";
//This component show one part's detail
function openLink(url) {
  window.open(url, '_blank');
}

function PartDetails({ part, type }) {
  const { Name, Price, Socket, TDP, PerformanceScore, MemoryType, Wattage, Capacity, Storage, Category } = part;
  let imgName = Name.replace(/\s/g, '');
  let nameA = imgName.replace(/\|/g, '');
  let nameB = Name.replace(/\|/g, '');
  const amazonLink = 'https://www.amazon.com/s?k=' + nameB + '&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss';

  return (
    <div className="part-details-container">
      <span className="contentContainer" onClick={() => openLink(amazonLink)}>
        <img src={`/images/${type}/${nameA}.jpg`} alt={`${Name} Image`} className="orderImg" />
        <p className="part-name">Name: {Name}</p>
        <p className="part-info">Price: ${Price}</p>

        {Socket && <p className="part-info">Socket: {Socket}</p>}
        {TDP && <p className="part-info">TDP: {TDP}W</p>}
        {PerformanceScore && <p className="part-info">Performance Score: {PerformanceScore}</p>}
        {MemoryType && <p className="part-info">Memory Type: {MemoryType}</p>}
        {Wattage && <p className="part-info">Wattage: {Wattage}W</p>}
        {Capacity && <p className="part-info">Capacity: {Capacity}</p>}
        {Storage && <p className="part-info">Storage: {Storage}</p>}
        {Category && <p className="part-info">Category: {Category}</p>}
      </span>
    </div>
  );
}

export default PartDetails;
