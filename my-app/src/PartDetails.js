import React from 'react';

function openLink(url) {
    window.open(url, '_blank');
  }


function PartDetails({part, type }) {
  const { Name, Price, Socket, TDP, PerformanceScore, MemoryType, Wattage, Capacity, Storage, Category } = part;
  let imgName=Name.replace(/\s/g, '');
  let nameA=imgName.replace(/\|/g,'');
  const amazonLink='https://www.amazon.com/s?k='+nameA+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss';

  return (
    <div>
      <span className="contentContainer" onClick={() => openLink(amazonLink)}>
      <p>Name: {Name} </p>
      <img src={`/images/${type}/${nameA}.jpg`} alt={`${Name} Image`} className="orderImg" />
      <p>Price: {Price} </p>

      {Socket && <p>Socket: {Socket} </p>}
      {TDP && <p>TDP: {TDP} </p>}
      {PerformanceScore && <p>Performance Score: {PerformanceScore} </p>}
      {MemoryType && <p>Memory Type: {MemoryType} </p>}
      {Wattage && <p>Wattage: {Wattage} </p>}
      {Capacity && <p>Capacity: {Capacity} </p>}
      {Storage && <p>Storage: {Storage} </p>}
      {Category && <p>Category: {Category} </p>}
      </span>
      <hr />
    </div>
  );
}

export default PartDetails;
