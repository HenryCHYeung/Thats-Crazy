// Button.js
import React, { useState } from 'react';
import Modal from './Modal';

const ModalButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Build Your PC Now!</button>
      <Modal isOpen={modalIsOpen} closeModal={closeModal} />
    </div>
  );
};

export default ModalButton;
