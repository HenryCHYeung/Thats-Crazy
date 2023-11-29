import React from 'react';
import './orderCard.css';
//This component is the same idea as Card.js but has a diffrent css to display correctly on checkout page
function openLink(url) {
  window.open(url, '_blank');
}


function Ordercard({component,name,img,price,storage}) {
  const amazonLink='https://www.amazon.com/s?k='+name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss';
  let componentN = component;
  if(component=='Cases'){
    componentN = "Case";
  }else if (component=="CPUCooler"){
    componentN = "CPU Cooler";
  }
  return (
    <div className="orderSize">
      <span className="contentContainer" onClick={() => openLink(amazonLink)}>
        <img src={`/images/${component}/${img}.jpg`} alt={`${name} Image`} className="orderImg2" />
        <span id='compNameC'>{componentN}: {name} </span>
        {storage && component=="Laptop" && <span id='storageC'>Storage: {storage}</span>}
        <span id='priceC'>Price: ${price.toFixed(2)}</span>
      </span>
    </div>
  );
}

export default Ordercard;
