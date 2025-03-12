import React, { useState, useEffect, useRef } from 'react';
import RomanticFrame from './RomanticFrame';
import FloatingHearts from './FloatingHearts';
import s1 from '../images/s1.jpeg';
import s2 from '../images/s2.jpeg';
import s3 from '../images/s3.jpeg';
import s4 from '../images/s4.jpeg';
import s5 from '../images/s5.jpeg';
import s6 from '../images/s6.jpeg';
import s7 from '../images/s7.jpeg';
import s8 from '../images/s8.jpeg';
import { getCarouselImageStyle, getFrontIndex } from '../helpers/carouselHelpers';

const ImageGallery = () => {
  const images = [s1, s2, s3, s4, s5, s6, s7, s8];
  const captions = [
    "Your smile lights up my world",
    "Every moment with you is a treasure",
    "You are my endless love",
    "My heart beats for you",
    "You make life beautiful",
    "Together forever, hand in hand",
    "Love is in the air",
    "Every day is Valentine's with you"
  ];

  const [rotation, setRotation] = useState(0);
  const [liked, setLiked] = useState(Array(images.length).fill(false));
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [theme, setTheme] = useState('pastel');
  const galleryRef = useRef(null);

  // Background music setup.
  const backgroundMusic = useRef(new Audio("https://www.bensound.com/bensound-music/bensound-slowmotion.mp3"));
  useEffect(() => {
    backgroundMusic.current.loop = true;
    backgroundMusic.current.volume = 0.3;
    if (!musicMuted) {
      backgroundMusic.current.play().catch(err => console.log("Autoplay blocked", err));
    }
    return () => {
      backgroundMusic.current.pause();
    };
  }, [musicMuted]);

  useEffect(() => {
    if (!musicMuted) {
      backgroundMusic.current.play().catch(err => console.log("Play error", err));
    }
  }, [isFullScreen, musicMuted]);

  const themeBackgrounds = {
    pastel: 'https://via.placeholder.com/1920x1080/ff9a9e/fad0c4?text=Pastel+Mode',
    roseGold: 'https://via.placeholder.com/1920x1080/b76e79/f7cac9?text=RoseGold+Mode',
    dark: 'https://via.placeholder.com/1920x1080/333/555?text=Dark+Mode',
    neon: 'https://via.placeholder.com/1920x1080/39FF14/FF073A?text=Neon+Mode',
  };

  useEffect(() => {
    if (isFullScreen && galleryRef.current) {
      galleryRef.current.style.backgroundImage = `url('${themeBackgrounds[theme]}')`;
      galleryRef.current.style.backgroundSize = 'cover';
      galleryRef.current.style.backgroundPosition = 'center';
    } else if (galleryRef.current) {
      galleryRef.current.style.backgroundImage = '';
    }
  }, [isFullScreen, theme]);

  const toggleMusic = () => {
    if (musicMuted) {
      backgroundMusic.current.play().catch(err => console.log("Play error", err));
    } else {
      backgroundMusic.current.pause();
    }
    setMusicMuted(!musicMuted);
  };

  // Sound effects.
  const navSound = useRef(new Audio("https://www.soundjay.com/button/sounds/button-16.mp3"));
  const likeSound = useRef(new Audio("https://www.soundjay.com/button/sounds/button-3.mp3"));

  // Carousel settings.
  const angleStep = 360 / images.length;
  const radius = 400;

  // Get the front image index using our helper function.
  const frontIndex = getFrontIndex(images.length, rotation, angleStep);

  const nextSlide = () => {
    navSound.current.play();
    setRotation(prev => prev - angleStep);
  };

  const prevSlide = () => {
    navSound.current.play();
    setRotation(prev => prev + angleStep);
  };

  const toggleLike = (index) => {
    likeSound.current.play();
    setLiked(prev => {
      const newLiked = [...prev];
      newLiked[index] = !newLiked[index];
      return newLiked;
    });
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      galleryRef.current.requestFullscreen().then(() => setIsFullScreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    }
  };

  const themesArr = ['pastel', 'roseGold', 'dark', 'neon'];
  const toggleTheme = () => {
    const currentIndex = themesArr.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themesArr.length;
    setTheme(themesArr[nextIndex]);
  };

  const themeStyles = {
    pastel: {
      navButtonBackground: 'linear-gradient(45deg, #ff9a9e, #ff6b81)',
      heartColor: 'rgba(255, 105, 180, 0.8)',
    },
    roseGold: {
      navButtonBackground: 'linear-gradient(45deg, #b76e79, #f7cac9)',
      heartColor: 'rgba(183, 110, 121, 0.8)',
    },
    dark: {
      navButtonBackground: 'linear-gradient(45deg, #333, #555)',
      heartColor: 'rgba(255, 255, 255, 0.8)',
    },
    neon: {
      navButtonBackground: 'linear-gradient(45deg, #39FF14, #FF073A)',
      heartColor: 'rgba(57, 255, 20, 0.8)',
    },
  };

  return (
    <div
      ref={galleryRef}
      className="container mb-4 p-4 rounded shadow"
      style={{
        maxWidth: '1000px',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto'
      }}
    >
      {/* Floating hearts background */}
      <FloatingHearts theme={theme} heartColor={themeStyles[theme].heartColor} />

      <div className="text-center mb-4">
        <h2 className="text-white">3D Carousel Image Gallery</h2>
      </div>

      {/* Carousel container */}
      <div
        style={{
          position: 'relative',
          width: '600px',
          height: '400px',
          margin: '0 auto',
          perspective: '1000px'
        }}
      >
        {images.map((img, index) => (
          <div key={index} style={getCarouselImageStyle(index, rotation, angleStep, radius)}>
            <RomanticFrame>
              <img
                src={img}
                alt={`Slide ${index}`}
                style={{
                  width: '150px',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '10px'
                }}
              />
            </RomanticFrame>
            {/* Display caption for the front image */}
            {index === frontIndex && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-30px',
                  width: '100%',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '16px',
                  textShadow: '0 0 5px rgba(0,0,0,0.7)'
                }}
              >
                {captions[index]}
              </div>
            )}
            {/* Like button overlay */}
            <div
              onClick={() => toggleLike(index)}
              title="Like"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                fontSize: '24px',
                color: liked[index] ? 'red' : 'white',
                textShadow: '0 0 3px rgba(0,0,0,0.5)'
              }}
            >
              <i className={`bi ${liked[index] ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-center align-items-center mt-3">
        <button
          onClick={prevSlide}
          title="Previous"
          className="btn rounded-circle me-3"
          style={{
            width: '50px',
            height: '50px',
            background: themeStyles[theme].navButtonBackground,
            border: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
        <button
          onClick={nextSlide}
          title="Next"
          className="btn rounded-circle ms-3"
          style={{
            width: '50px',
            height: '50px',
            background: themeStyles[theme].navButtonBackground,
            border: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>

      {/* Other Controls */}
      <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
        <button
          onClick={toggleFullScreen}
          title="Toggle Full Screen"
          className="btn btn-secondary"
        >
          {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
        </button>
        <button
          onClick={toggleTheme}
          title="Switch Theme"
          className="btn btn-secondary"
        >
          {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode <i className="bi bi-brush"></i>
        </button>
        <button
          onClick={toggleMusic}
          title="Mute/Unmute Music"
          className="btn btn-secondary"
        >
          {musicMuted ? <i className="bi bi-volume-mute"></i> : <i className="bi bi-volume-up"></i>}
        </button>
      </div>
      <style>{`
        .like-button:active {
          transform: scale(1.3);
          transition: transform 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ImageGallery;
