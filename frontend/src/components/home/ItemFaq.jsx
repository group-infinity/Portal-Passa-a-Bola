import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const ItemFaq = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleItem = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full rounded-sm border-1 border-[rgba(0,0,0,0.25)]">
      <button
        onClick={toggleItem}
        className="flex w-full items-center justify-between p-6 cursor-pointer"
      >
        <p className="text-left max-w-[80%] font-bold">{title}</p>

        <ChevronDown
          className={`size-8 text-[rgba(0,0,0,0.25)] transition-transform duration-150 ease-in-out ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 pt-0">
            <p>{content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemFaq;
