'use client';

import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    title: "Practice MCQs",
    description: "Test your knowledge with our comprehensive question bank",
    image: "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg",
    fallbackColor: "bg-gray-900"
  },
  {
    title: "Track Progress",
    description: "Monitor your improvement with detailed analytics",
    image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg",
    fallbackColor: "bg-gray-900"
  },
  {
    title: "Compete & Learn",
    description: "Join the leaderboard and compete with others",
    image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
    fallbackColor: "bg-gray-900"
  }
];

export default function HomeSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[300px] rounded-2xl overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Fallback background color */}
          <div className={`absolute inset-0 ${slide.fallbackColor}`} />
          
          {/* Background Image */}
          {slide.image && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: 'center',
              }}
            />
          )}
          
          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="px-8 md:px-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {slide.title}
              </h2>
              <p className="text-lg text-white/90 max-w-lg">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white w-6' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
} 