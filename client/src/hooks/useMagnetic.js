import { useState, useEffect } from 'react';

/**
 * Hook to create a magnetic pull effect towards an element
 * @param {number} strength - How strong the pull is (default 0.3)
 */
export const useMagnetic = (strength = 0.3) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Calculate center of the element
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from mouse to center
    const x = (clientX - centerX) * strength;
    const y = (clientY - centerY) * strength;
    
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return {
    position,
    handleMouseMove,
    handleMouseLeave
  };
};
