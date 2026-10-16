import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ title, onClose, children }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    dialog?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  const handleClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        onClose();
    }
  };

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="modal-title"
      onCancel={onClose}
      onClick={handleClick}
    >
      <div className={styles.heading}>
        <h2 id="modal-title">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close dialog">
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
};
