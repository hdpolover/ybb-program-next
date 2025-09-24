import React from "react";
import { Modal, ModalBody } from "reactstrap";

interface ConfirmModalProps {
  show?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  icon?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel", 
  type = 'danger',
  icon
}) => {
  const getIconClass = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'danger':
        return "ri-delete-bin-line text-danger";
      case 'warning':
        return "ri-error-warning-line text-warning";
      case 'info':
        return "ri-information-line text-info";
      case 'success':
        return "ri-check-line text-success";
      default:
        return "ri-question-line text-muted";
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return "btn-danger";
      case 'warning':
        return "btn-warning";
      case 'info':
        return "btn-info";
      case 'success':
        return "btn-success";
      default:
        return "btn-primary";
    }
  };

  return (
    <Modal fade={true} isOpen={show} toggle={onCancel} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <i className={`display-5 ${getIconClass()}`}></i>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>{title}</h4>
            <p className="text-muted mx-4 mb-0">
              {message}
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light material-shadow-none"
            data-bs-dismiss="modal"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn w-sm ${getButtonClass()} material-shadow-none`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmModal;