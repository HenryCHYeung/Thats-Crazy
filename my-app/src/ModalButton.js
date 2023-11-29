// Button.js
import React, { useState } from 'react';
import Modal from './Modal';

const ModalButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  //this component is hides modal to be activated by button, Also when rendering it will build the rest of Modal.js
  return (
    <div>
      <button className='homebutton' style={{
        left:'40%',
        top:'60%',
        width:'30%', 
        height:'15%',
        fontSize:'1.5vw',
        color: isHovered ? 'lime' : 'black',
        transition: 'color 0.3s ease-in-out',
        }} 
        onClick={openModal}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >Try Rapid Build</button>
      <Modal isOpen={modalIsOpen} closeModal={closeModal} />
    </div>
  );
};

export default ModalButton;
