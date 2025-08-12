import React from 'react';
import "../stylesFolder/FloatingShapes.css"
const FloatingCode = ({ code, top, left }) => {
  const animationDuration = `${5 + Math.random() * 10}s`;
  
  return (
    <div 
      className="floating-code"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        animationDuration: animationDuration
      }}
    >
      {code}
    </div>
  );
};

export default FloatingCode;