import React from 'react';
import './orderCard.css';

function openLink(url) {
  window.open(url, '_blank');
}

function Ordercard({component,name,img,price,storage}) {
  const amazonLink='https://www.amazon.com/s?k='+name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss';
  return (
    <div className="orderSize">
      <span className="contentContainer" onClick={() => openLink(amazonLink)}>
        <img src={`/images/${component}/${img}.jpg`} alt={`${name} Image`} className="orderImg" />
        <span>{component}: {name} </span>
        {storage && <span>{storage}</span>}
        <span>Price: ${price.toFixed(2)}</span>
        {storage && <span>Storage: {storage}</span>}
      </span>
    </div>
  );
}

export default Ordercard;
