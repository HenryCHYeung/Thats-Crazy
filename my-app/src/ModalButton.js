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
      <button className='homebutton'
        onClick={openModal}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >Start Rapid Build</button>
      <Modal isOpen={modalIsOpen} closeModal={closeModal} />
    </div>
  );
};

export default ModalButton;
