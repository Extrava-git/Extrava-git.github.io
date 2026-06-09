'use client';
import React, { useState } from 'react';

// --- Data for the Extrava image accordion ---
const accordionItems = [
  {
    id: 1,
    title: 'Precision Sensors',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw3OaMnPqh2t6mQ6OJZoS5lrsGXrg6WQnuUEqOFOVvlQ&s=10',
  },
  {
    id: 2,
    title: 'Real-Time Monitoring',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReyNLjzUvPtGHK-xnd24Iy2-ekYHaV3CBsiUVD0f99Bw&s=10',
  },
  {
    id: 3,
    title: 'Leakage Detection',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-iSs8r4BhBSCuyXILvohZsMOn0RtdAV2KeTVVwUsmbQ&s=10',
  },
  {
    id: 4,
    title: 'Clinical Workflow',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0rMA0aNDsNo7kqQ9FTl3tUFZ235Vga1fkXTGRyKvQNA&s=10',
  },
  {
    id: 5,
    title: 'Extrava Technology',
    imageUrl: '/logo.png', // Using local logo as the 5th item
  },
];

// --- Accordion Item Component ---
const AccordionItem = ({ item, isActive, onMouseEnter }: { item: typeof accordionItems[0], isActive: boolean, onMouseEnter: () => void }) => {
  return (
    <div
      className={`
        relative h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        ${isActive ? 'w-[400px]' : 'w-[60px]'}
      `}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = 'https://placehold.co/400x450/2d3748/ffffff?text=Image+Error'; }}
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Caption Text */}
      <span
        className={`
          absolute text-white text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0' 
              : 'w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90'
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
};


// --- Main Component ---
export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(4);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="container mx-auto px-4 py-12 md:py-24 bg-black">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side: Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tighter">
            Intelligent Infusion Monitoring
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto md:mx-0">
            Extrava aims to provide sub-millimeter precision in detection, helping nursing teams identify infusion issues earlier for better patient outcomes.
          </p>
          <div className="mt-8">
            <a
              href="#contact"
              className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Right Side: Image Accordion */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
            {accordionItems.map((item, index) => (
              <AccordionItem
                key={item.id}
                item={item}
                isActive={index === activeIndex}
                onMouseEnter={() => handleItemHover(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
