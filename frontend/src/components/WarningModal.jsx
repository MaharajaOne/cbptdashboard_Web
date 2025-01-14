import React from 'react';

const WarningModal = ({ isOpen, onClose }) => (
  isOpen ? (
    <div>
      <p>Are you sure you want to stop the task?</p>
      <button onClick={onClose}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  ) : null
);

export default WarningModal;
