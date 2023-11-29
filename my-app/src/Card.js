import React from 'react';
import './Card.css';

function openLink(url) {
  window.open(url, '_blank');//opens a new window with the amazon url
}

function Componentcard({component,name,img,price,storage}) {
  let nameA=name.replace(/\|/g,'');// remove the spaces official name of the part(Asus 123)
  let componentN = component;//set part type (GPU,Motherboard)
  if(component=='Cases'){//check if part type is called cases
    componentN = "Case";//set the name to Case to display the correct title
  }else if (component=="CPUCooler"){//same idea of cases but with cooler
    componentN = "CPU Cooler";
  }
  const amazonLink='https://www.amazon.com/s?k='+nameA+'&crid=22RKV946NH24M&sprefix=MSIMPGX570GAMINGPROCARBONWIFI%2Caps%2C144&ref=nb_sb_noss'; //set the amazon link to search fro part
  return (
    <div className="cardSize">
      <div onClick={() => openLink(amazonLink)}> {/*runs the openLink function for the amazon link*/}
        <p>{componentN}: {name}</p>
        <p>Price: ${price}</p>
        {storage && <span>Storage: {storage}</span>} {/*check if storage value exist if true display span */}
        <img src={`/images/${component}/${img}.jpg`} alt={`${name} Image`} class="imgSize" /> {/*find and display image from public*/}
      </div>
    </div>
  );
}

export default Componentcard;
