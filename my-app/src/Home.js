import React from 'react';
import ModalButton from './ModalButton';
import './Home.css';

function Home() {
  
  return (//Making stuff invisible + the conditional rendering between home, StorageChoice and typeChoice, home is just made invisible for simplicity.
  <div>
    <img className='logo' src='/Rapid_Rigs.png'/>
    <ModalButton/>
  </div>
  );
}

export default Home;
