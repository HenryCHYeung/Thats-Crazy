import React from 'react';
import './Card.css';

function openLink(url) {
  window.open(url, '_blank');
}

function Componentcard({component,name,img,price}) {
  console.log(component,name,img,price);
  const amazonLink='https://www.amazon.com/s?k='+name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss';
  return (
    <div className="cardSize">
      <div className="contentContainer" onClick={() => openLink(amazonLink)}>
        <p>{component}: {name}</p>
        <p>Price: ${price}</p>
        <img src={`/images/${component}/${img}.jpg`} alt={`${name} Image`} class="imgSize" />
      </div>
    </div>
  );
}

export default Componentcard;
{/*
style={{position:'absolute',top:'30%',left:'10%',width:'40%', height:'40%'}}
style={{width:'40%', height:'40%'}}
*/}
{/*import Button from 'react-bootstrap/Button';
  <a href={'https://www.amazon.com/s?k='+name+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss'} target="_blank" rel="noopener noreferrer">
*/}