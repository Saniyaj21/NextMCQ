'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    'https://placehold.co/1200x600/3498db/ffffff?text=Welcome+to+MCQ+Platform',
    'https://placehold.co/1200x600/e74c3c/ffffff?text=Practice+Tests',
    'https://placehold.co/1200x600/2ecc71/ffffff?text=Track+Your+Progress'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            fill
            style={{ objectFit: 'cover' }}
            priority={index === 0}
            quality={90}
          />
        </div>
      ))}
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider; 