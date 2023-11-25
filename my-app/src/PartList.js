import React from 'react';


function PartList() {
  
  return (//Making stuff invisible + the conditional rendering between home, StorageChoice and typeChoice, home is just made invisible for simplicity.
  <div>
    <img style={{width:'20%',height:'30%'}} src='/partList.png'/>
    <h3>All Parts</h3>
    <h4>CPUs</h4>
    <button>Show</button>

    <h4>GPUs</h4>
    <button>Cases</button>

    <h4>Motherboards</h4>
    <button>RAM</button>

    <h4>PSUs</h4>
    <button>Show</button>

    <h4>Storage</h4>
    <button>Show</button>

    <h4>CPU Cooler</h4>
    <button>Show</button>

  </div>
  );
}

export default PartList;