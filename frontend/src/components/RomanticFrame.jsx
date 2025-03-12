import React from 'react';

const RomanticFrame = ({ children }) => {
  // Large heart style for the main hearts
  const heartStyleLarge = {
    position: 'absolute',
    fontSize: '40px',
    pointerEvents: 'none',
    zIndex: 1,
  };

  // Small heart style for additional hearts
  const heartStyleSmall = {
    position: 'absolute',
    fontSize: '20px',
    pointerEvents: 'none',
    zIndex: 1,
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Large hearts */}
      <span style={{ ...heartStyleLarge, top: 0, left: '50%', transform: 'translate(-50%, -50%)' }}>❤️</span>
      <span style={{ ...heartStyleLarge, bottom: 0, left: '50%', transform: 'translate(-50%, 50%)' }}>❤️</span>
      <span style={{ ...heartStyleLarge, left: 0, top: '50%', transform: 'translate(-50%, -50%)' }}>❤️</span>
      <span style={{ ...heartStyleLarge, right: 0, top: '50%', transform: 'translate(50%, -50%)' }}>❤️</span>

      {/* Additional small hearts */}
      <span style={{ ...heartStyleSmall, top: 0, left: '25%', transform: 'translate(-50%, -50%)' }}>❤️</span>
      <span style={{ ...heartStyleSmall, top: 0, left: '75%', transform: 'translate(-50%, -50%)' }}>❤️</span>
      <span style={{ ...heartStyleSmall, bottom: 0, left: '25%', transform: 'translate(-50%, 50%)' }}>❤️</span>
      <span style={{ ...heartStyleSmall, bottom: 0, left: '75%', transform: 'translate(-50%, 50%)' }}>❤️</span>
      <span style={{ ...heartStyleSmall, left: 0, top: '25%', transform: 'translate(-50%, -50%)' }}>❤️</span>
      <span style={{ ...heartStyleSmall, left: 0, top: '75%', transform: 'translate(-50%, -50%)' }}>❤️</span>
      <span style={{ ...heartStyleSmall, right: 0, top: '25%', transform: 'translate(50%, -50%)' }}>❤️</span>
      <span style={{ ...heartStyleSmall, right: 0, top: '75%', transform: 'translate(50%, -50%)' }}>❤️</span>

      {/* Content container */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'white',
          padding: '3px',
          borderRadius: '10px',
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default RomanticFrame;
