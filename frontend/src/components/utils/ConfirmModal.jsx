import React, { useEffect } from "react";
import { X } from "lucide-react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, txt }) => {
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (isOpen) {
      mainContent?.setAttribute("aria-hidden", "true");
    } else {
      mainContent?.removeAttribute("aria-hidden");
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      mainContent?.removeAttribute("aria-hidden");
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex h-screen w-screen items-center justify-center p-4"
      onClick={onClose}
    >
      <span
        className={`absolute inset-0 h-dvh bg-black opacity-50 transition-opacity duration-300 ease-in-out`}
      ></span>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="aviso-modal-title"
        className="relative flex w-full max-w-lg flex-col gap-4 rounded-lg bg-white p-6 shadow-lg"
        onClick={handleModalContentClick}
      >
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 z-10 p-1 text-gray-500 hover:text-gray-800"
          aria-label="Fechar modal"
        >
          <X className="size-6" />
        </button>

        <h2 id="aviso-modal-title" className="text-2xl font-bold text-gray-800">
          {title}
        </h2>

        <div className="text-gray-600">{txt}</div>

        <div className="mt-4 flex gap-2.5 justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer rounded bg-[rgba(0,0,0,0.25)] px-4 py-2 font-bold text-white transition-colors hover:bg-[rgba(0,0,0,0.5)]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded bg-[#6EAA38] px-4 py-2 font-bold text-white transition-colors hover:bg-[#7D1220]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
