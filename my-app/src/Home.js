import React from 'react';
import ModalButton from './ModalButton';
import './Home.css';


function Home() {
  
  return (//Making stuff invisible + the conditional rendering between home, StorageChoice and typeChoice, home is just made invisible for simplicity.
  <div id='home'>
    <div className='homeContainer'>
      <span>
      <img className='homeChibi' src='/home.png'/> 
      </span>
      <h1 className='homeText'>Build Your Dream PC With Our Selected PC Parts!</h1>
      <img className='deviceImg' src='/pcStock.png'/>
      <span className='homeText'>
        <ModalButton/>
      </span>
    </div>
  </div>
  );
}

export default Home;
