import React from "react";

export default function ModalConfirm({ show, onClose, onConfirm, title, message }) {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-dialog-centered"> {/* 📌 Agregamos esta clase */}
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title || "Confirm Action"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message || "Are you sure you want to proceed?"}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
