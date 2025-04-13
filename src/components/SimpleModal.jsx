import React from "react";
import "../styles/simpleModal.css";

const SimpleModal = ({ isOpen, onClose, title, children, onConfirm, confirmText = "Confirmar", cancelText = "Cerrar"}) => {
  if (!isOpen) return null;

  return (
    <div className="simple-modal-overlay" onClick={onClose}>
      <div className="simple-modal" onClick={(e) => e.stopPropagation()}>
        <div className="simple-modal-header">
          <h2>{title}</h2>
        </div>
        <div className="simple-modal-content">
          {children}
        </div>
        <div className="simple-modal-footer">
          <button className="cancel" onClick={onClose}>
            {cancelText}
          </button>
          {onConfirm && (
            <button className="confirm" onClick={onConfirm}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;
