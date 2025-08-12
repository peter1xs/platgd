import React from 'react'

function FloatingShapes() {
  return(
    <div className="floating-shapes">
      <div className="shape circle" style={{ width: '80px', height: '80px', top: '10%', left: '5%', animationDelay: '0s' }}></div>
      <div className="shape triangle" style={{ top: '70%', left: '10%', animationDelay: '2s' }}></div>
      <div className="shape star" style={{ top: '20%', right: '10%', animationDelay: '1s' }}>★</div>
      <div className="shape circle" style={{ width: '60px', height: '60px', bottom: '10%', right: '15%', animationDelay: '3s' }}></div>
      <div className="shape circle" style={{ width: '60px', height: '60px', bottom: '10%', right: '15%', animationDelay: '3s' }}></div>
      <div className="shape triangle" style={{ top: '50%', right: '20%', animationDelay: '4s' }}></div>
      <div className="shape star" style={{ bottom: '20%', left: '20%', animationDelay: '5s' }}>★</div>
    </div>
  );
}

export default FloatingShapes