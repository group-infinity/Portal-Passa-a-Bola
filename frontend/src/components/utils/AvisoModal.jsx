import React, { useEffect } from "react";
import { X } from "lucide-react";

const AvisoModal = ({ isOpen, onClose, title, children, imageUrl }) => {
  useEffect(() => {
    const mainContent = document.getElementById("main-content");
    if (isOpen) {
      mainContent?.setAttribute("aria-hidden", "true");
    } else {
      mainContent?.removeAttribute("aria-hidden");
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
        className={`opacity-50 absolute inset-0 h-dvh bg-black transition-opacity duration-300 ease-in-out`}
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
          className="absolute top-3 right-3 z-10 p-1 text-gray-500 hover:text-gray-800"
          aria-label="Fechar modal"
        >
          <X className="size-6" />
        </button>

        <h2 id="aviso-modal-title" className="text-2xl font-bold text-gray-800">{title}</h2>

        <div className="text-gray-600">
          {children}
        </div>

        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="QrCode"
              className="w-full h-auto max-h-60 object-contain rounded"
            />
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-[#BA1B31] px-4 py-2 font-bold text-white transition-colors hover:bg-[#7D1220]"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvisoModal;