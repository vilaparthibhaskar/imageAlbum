import React from 'react';

const FloatingHearts = ({ heartColor }) => {
  const hearts = Array.from({ length: 10 }).map(() => ({
    left: Math.random() * 100,
    animationDelay: Math.random() * 5,
    size: 20 + Math.random() * 30,
  }));

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
        }
      `}</style>
      {hearts.map((heart, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${heart.left}%`,
            bottom: '-50px',
            fontSize: `${heart.size}px`,
            animation: 'floatUp 8s linear infinite',
            animationDelay: `${heart.animationDelay}s`,
            color: heartColor,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
