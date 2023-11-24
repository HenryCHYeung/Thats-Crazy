import React from 'react';
import ModalButton from './ModalButton';
import './Home.css';


function Home() {
  
  return (//Making stuff invisible + the conditional rendering between home, StorageChoice and typeChoice, home is just made invisible for simplicity.
  <div>
    <div className='homeContainer'>
      <span>
      <img className='homeChibi' src='/home.png'/> 
      </span>
      <span className='homeText'>
        <h1>Build Your Dream PC With Our Selected PC Parts!</h1>
        <h3>Not Sure Where to Start?</h3>
        <h3>No Problem!</h3>
        <ModalButton/>
        <img className='deviceImg' src='/pcStock.png'/> 
      </span>
    </div>
      <div className='footer'>
      </div>
  </div>
  );
}

export default Home;
