import React from 'react';
import './orderCard.css';

function openLink(url) {
  window.open(url, '_blank');
}

function Ordercard({component,name,img,price}) {
  const amazonLink='https://www.amazon.com/s?k='+name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss';
  return (
    <div className="orderSize">
      <span className="contentContainer" onClick={() => openLink(amazonLink)}>
      <img src={`/images/${component}/${img}.jpg`} alt={`${name} Image`} class="orderImg" />
        <span>{component}: {name}</span>
        <span>Price: ${price.toFixed(2) }</span>
      </span>
    </div>
  );
}

export default Ordercard;

/**
 *  <img src={`/images/${component}/${img}.jpg`} alt={`${name} Image`} class="imgSize" />
 */