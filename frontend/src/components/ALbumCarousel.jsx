import React, { useState, useEffect, useRef } from 'react';
import RomanticFrame from './RomanticFrame';
import FloatingHearts from './FloatingHearts';
import { getCarouselImageStyle, getFrontIndex } from '../helpers/carouselHelpers';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Modal, Button } from "react-bootstrap";
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa'; // ✅ Import Trash icon from react-icons
const apiUrl = import.meta.env.VITE_API_URL;



const ImageGallery = () => {
  const userid = useSelector((state) => state.user.userid);
  const { title } = useParams(); 
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  // State for the "Add Image" modal
  const [showModal, setShowModal] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [picToDelete, setPicToDelete] = useState(null); // To store album info for deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  

  


    // Handle album deletion
    const handleDeleteImage = async () => {
      setShowDeleteModal(false); // Close the delete confirmation modal
    
      try {
        const response = await fetch(`${apiUrl}/deleteimage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid,
            title: title,  // Title of the album
            publicid: picToDelete.publicid, // Public ID of the image to delete
          }),
        });
    
        const data = await response.json();
    
        if (data.success) {
          // Remove the image from the photos list
          setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.publicid !== picToDelete.publicid));
        } else {
          alert("Failed to delete image. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Error deleting image.");
      }
    };
    

    // useEffect(() => {
    //   setAngleStep(360 / photos.length)
    // }, [photos])
  

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${apiUrl}/albums/${title}?userid=${userid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        const data = await response.json();
        // Expected data format: { photos: [{ title, cover }, ...] }
        if (data.photos) {
          setPhotos(data.photos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, [userid, title]);


  useEffect(() => {
    setLiked(prev => {
      const newLiked = Array(photos.length).fill(false);
      for (let i = 0; i < Math.min(prev.length, photos.length); i++) {
        newLiked[i] = prev[i];
      }
      return newLiked;
    });
  }, [photos.length]);

  useEffect(() => {
    const currentFrontIndex = getFrontIndex(photos.length, rotation, 360 / photos.length);
    setRotation(currentFrontIndex * (360 / photos.length));
  }, [photos.length]);
  


  const [rotation, setRotation] = useState(0);
  const [liked, setLiked] = useState(Array(photos.length).fill(false));
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

  const handleback = () => {
    navigate('/albums')
  }

  // Sound effects.
  // const navSound = useRef(new Audio("https://www.soundjay.com/button/sounds/button-16.mp3"));
  // const likeSound = useRef(new Audio("https://www.soundjay.com/button/sounds/button-3.mp3"));

  // // Carousel settings.
  const angleStep = 360 / photos.length;
  const radius = 400;

  // // Get the front image index using our helper function.
  const frontIndex = getFrontIndex(photos.length, rotation, angleStep);

  const nextSlide = () => {
    // navSound.current.play();
    setRotation(prev => prev - angleStep);
  };

  const prevSlide = () => {
    // navSound.current.play();
    setRotation(prev => prev + angleStep);
  };

  const toggleLike = (index) => {
    // likeSound.current.play();
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

  // Handler for the image upload form submission.
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!newImage) {
      console.error("No image selected");
      return;
    }
    const formData = new FormData();
    formData.append('userid', userid);
    formData.append('title', title);
    formData.append('caption', newCaption);
    formData.append('image', newImage);

    try {
      const response = await fetch(`${apiUrl}/uploadpic`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const result = await response.json();
      console.log(result, 'upload result');

      // Optionally update your photos list here if the upload response returns the new photo.
      // For example:
      // setPhotos(prev => [...prev, result.newPhoto]);

      // Reset form and close modal.
      setNewCaption('');
      setNewImage(null);
      setShowModal(false);
      setPhotos((state) => [...state, {url:result.photo.url, caption:result.photo.caption, publicid:result.photo.publicid}])
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <>
    <Header/>
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


      {/* Modal Popup for Image Upload */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '300px',
              position: 'relative'
            }}
          >
            <h4>Add New Image</h4>
            <form onSubmit={handleImageSubmit}>
              <div className="mb-2">
                <label>Caption:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  required
                />
              </div>
              <div className="mb-2">
                <label>Image:</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setNewImage(e.target.files[0])}
                  accept="image/*"
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
        {photos.map((pic, index) => (
  <div
    key={index}
    style={getCarouselImageStyle(index, rotation, angleStep, radius)}
  >
    {/* Container for the image with relative positioning */}
    <div style={{ position: 'relative' }}>
      <RomanticFrame>
        <img
          src={pic.url}
          alt={`Slide ${index}`}
          style={{
            width: '150px',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '10px',
          }}
        />
      </RomanticFrame>

      {/* Trash Icon */}
      <FaTrashAlt
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click from being triggered
          setPicToDelete(pic); // Set pic to delete
          setShowDeleteModal(true); // Show delete confirmation modal
        }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '1.5rem',
          color: 'red',
          cursor: 'pointer',
          zIndex: 10, // Ensures the icon stays on top
        }}
      />

      {/* Display caption for the front image */}
      {index === frontIndex && (
        <div
        className='fw-boldg'
          style={{
            position: 'absolute',
            bottom: '-50px',
            width: '100%',
            textAlign: 'center',
            color: 'white',
            fontSize: '16px',
            textShadow: '0 0 5px rgba(0,0,0,0.7)',
          }}
        >
          {pic.caption}
        </div>
      )}

      {/* Like button overlay */}
      <div
        onClick={() => toggleLike(index)}
        title="Like"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px', // Move the like button to the top-left
          cursor: 'pointer',
          fontSize: '24px',
          color: liked[index] ? 'red' : 'white',
          textShadow: '0 0 3px rgba(0,0,0,0.5)',
          zIndex: 10, // Ensures the like button stays on top
        }}
      >
        <i className={`bi ${liked[index] ? 'bi-heart-fill' : 'bi-heart'}`}></i>
      </div>
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
        {musicMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>
      <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
        <button
          title="Add Image"
          className="btn btn-secondary"
          onClick={() => setShowModal(true)}
        >
          Add Image
        </button>
        <button
          onClick={handleback}
          title="Back"
          className="btn btn-secondary"
        >
          Back
        </button>

      </div>
      {/* Delete Confirmation Modal */}
              <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Album</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>Are you sure you want to delete the album "{picToDelete?.title}"?</p>
                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="danger" className="ms-2" onClick={handleDeleteImage}>
                      Delete
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
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
    </>
  );
};

export default ImageGallery;
