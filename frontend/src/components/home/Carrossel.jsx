import React, { useState, useEffect } from 'react';

const Carrossel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === items.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="w-full h-[25svh] relative overflow-hidden">
      <div
        className="h-full flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {items.map((item, index) => (
          <img
            key={index}
            src={item}
            alt=""
            className="min-w-full h-full object-cover"
          />
        ))}
      </div>
    </div>
  );
};

export default Carrossel;