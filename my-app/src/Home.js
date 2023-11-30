import React from 'react';
import ModalButton from './ModalButton';
import './Home.css';


function Home() {
  
  return (
  <div id='home'>
    <div className='homeContainer'>
      <span>
        <img className='homeChibi' src='/home.png' alt='Home Chibi' /> 
      </span>
      <h1 className='homeText'>Build Your Dream PC With Our Selected PC Parts!</h1>
      <img className='deviceImg' src='/pcStock.png' alt='PC Stock'/>
      <span className='homeText'>
        <ModalButton/>
      </span>
    </div>
  </div>
  );
}

export default Home;
