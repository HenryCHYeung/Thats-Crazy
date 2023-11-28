import React from 'react';
import './Card.css';

function openLink(url) {
  window.open(url, '_blank');
}

function Componentcard({component,name,img,price,storage}) {
  let nameA=name.replace(/\|/g,'');
  let componentN = component;
  if(component=='Cases'){
    componentN = "Case";
  }else if (component=="CPUCooler"){
    componentN = "CPU Cooler";
  }
  const amazonLink='https://www.amazon.com/s?k='+nameA+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss';
  return (
    <div className="cardSize">
      <div onClick={() => openLink(amazonLink)}>
        <p>{componentN}: {name}</p>
        <p>Price: ${price}</p>
        {storage && <span>Storage: {storage}</span>}
        <img src={`/images/${component}/${img}.jpg`} alt={`${name} Image`} class="imgSize" />
      </div>
    </div>
  );
}

export default Componentcard;
