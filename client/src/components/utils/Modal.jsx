import React from 'react';

const Modal = ({ children, closeHandler }) => (
  <div className={`w3-modal ${children ? 'w3-show' : 'w3-hide'}`}>
    <div className="">
      <div className="w3-container">
        <span
          onClick={closeHandler}
          className="w3-closebtn"
        >
                  &times;
                </span>
        {children}
      </div>
    </div>
  </div>
);


Modal.propTypes = {
  children: React.PropTypes.element,
  closeHandler: React.PropTypes.func
};

Modal.defaultProps = {
  children: <div>ExampleModal</div>,
  closeHandler: () => null
};

export default Modal;
