import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { change_albums } from "../store/slice/userSlice"; // Import Redux action
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { Header } from "./Header";
import { FaTrashAlt } from 'react-icons/fa'; // ✅ Import Trash icon from react-icons

const AlbumGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Initialize useNavigate()

  // Load albums and user ID from Redux store
  const albums = useSelector((state) => state.user.albums);
  const userid = useSelector((state) => state.user.userid); // Get user ID from Redux

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null); // To store album info for deletion

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle album submission
  const handleAddAlbum = async (e) => {
    e.preventDefault();
    
    if (!newTitle || !selectedFile) {
      alert("Please enter a title and select an image.");
      return;
    }

    setLoading(true);
    
    // Prepare form data
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("image", selectedFile);
    formData.append("userid", userid); // Add user ID to request body

    try {
      // Use fetch() instead of axios
      const response = await fetch("http://localhost:4000/addalbum", {
        method: "POST",
        body: formData, // Send as FormData
      });

      const data = await response.json();

      if (data.success) {
        const newAlbum = {
          title: data.album.title,
          url: data.album.cover,
          publicid: data.album.publicid, // Get uploaded image URL from backend response
        };

        // Update Redux state
        dispatch(change_albums([...albums, newAlbum]));

        // Reset state
        setNewTitle("");
        setSelectedFile(null);
        setShowModal(false);
      } else {
        alert("Failed to add album. Please try again.");
      }
    } catch (error) {
      console.error("Error adding album:", error);
      alert("Error uploading album.");
    }

    setLoading(false);
  };

  // Handle album deletion
  const handleDeleteAlbum = async () => {
    setShowDeleteModal(false); // Close delete confirmation modal

    try {
      const response = await fetch("http://localhost:4000/deletealbum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid,
          title: albumToDelete.title,
          publicid: albumToDelete.publicid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove album from Redux state
        const updatedAlbums = albums.filter(
          (album) => album.publicid !== albumToDelete.publicid
        );
        dispatch(change_albums(updatedAlbums));
      } else {
        alert("Failed to delete album. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting album:", error);
      alert("Error deleting album.");
    }
  };

  // ✅ Navigate to album details page
  const handleAlbumClick = (title) => {
    const encodedTitle = encodeURIComponent(title); // Encode title for URL safety
    navigate(`/album/${encodedTitle}`);
  };

  return (
    <>
      <Header />
      <div className="container my-4">
        <h2 className="mb-4">Albums</h2>

        {/* Albums Grid */}
        <div className="row">
          {albums.map((album, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div
                className="card"
                style={{ cursor: "pointer", position: "relative" }}
                onClick={() => handleAlbumClick(album.title)} // ✅ Navigate on click
              >
                <img src={album.url} className="card-img-top" alt={album.title} />
                
                {/* Delete Icon */}
                <FaTrashAlt
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from being triggered
                    setAlbumToDelete(album); // Set album to delete
                    setShowDeleteModal(true); // Show delete confirmation modal
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    fontSize: "1.5rem",
                    color: "red",
                    cursor: "pointer",
                  }}
                />
                
                <div className="card-body">
                  <h5 className="card-title">{album.title}</h5>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Album Button (Last Grid Item) */}
          <div className="col-md-4 mb-4">
            <div
              className="d-flex align-items-center justify-content-center border rounded"
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#f8f9fa",
                cursor: "pointer",
              }}
              onClick={() => setShowModal(true)}
            >
              <h1 className="text-secondary">+</h1>
            </div>
          </div>
        </div>

        {/* Modal for Creating a New Album */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create New Album</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleAddAlbum} encType="multipart/form-data">
              <div className="mb-3">
                <label htmlFor="albumTitle" className="form-label">Title:</label>
                <input
                  type="text"
                  id="albumTitle"
                  className="form-control"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="albumCover" className="form-label">Upload Cover Image:</label>
                <input
                  type="file"
                  id="albumCover"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="ms-2" disabled={loading}>
                  {loading ? "Uploading..." : "Add Album"}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Album</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete the album "{albumToDelete?.title}"?</p>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" className="ms-2" onClick={handleDeleteAlbum}>
                Delete
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default AlbumGrid;
