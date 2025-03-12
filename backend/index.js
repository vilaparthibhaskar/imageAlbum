const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const userModel = require('./model/userModal');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('./middleware/authanication');
const path = require('path');
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

require('dotenv').config();



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


mongoose.connect(`mongodb+srv://bhaskarvilapar:${process.env.MONGO_PW}@cluster0.npm84.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => {
    console.log("Mongodb connection succesful");
}).catch((e) => {
    console.log(e);
})

const app = express();

app.use(
    cors({
      origin: "*", 
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE"]
    })
  );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    next();
  });

app.get('/', async (req, res, next) => {
    res.send('hi');
    next()
});


app.get('/albums', async (req, res) => {
  try {
      const { userid } = req.body;

      if (!userid) {
          return res.status(400).json({ error: 'User ID is required' });
      }

      const user = await User.findById(userid);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const albumNames = user.albums.map(album => album.title); // Extract album titles
      res.status(200).json({ albums: albumNames });

  } catch (error) {
      console.error('Error fetching albums:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/albums/:title", async (req, res) => {
  try {
    const { userid } = req.query; // Extract userid from query parameters
    const { title } = req.params; // Extract title from URL

    if (!userid) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // ✅ Find the user in the database
    const user = await userModel.findById(userid);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Find the album that matches the title
    const album = user.albums.find((album) => album.title === title);

    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    // ✅ Return the album's photos (array of objects with `url` and `caption`)
    res.json({ success: true, photos: album.photos });

  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/uploadpic", upload.single("image"), async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const { userid, title, caption } = req.body;

    // Validate user id and file existence
    if (!userid) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image upload failed" });
    }

    // Upload image buffer to Cloudinary using the upload_stream API
    console.log("Uploading to Cloudinary...");
    const cloudinaryResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "albums" }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }).end(req.file.buffer);
    });

    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
    }
    console.log("Cloudinary upload successful:", cloudinaryResult.secure_url);

    // Find the user
    const user = await userModel.findById(userid);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log("User found:", user);

    // Find the album by title (assumes album title is unique)
    let album = user.albums.find(album => album.title === title);
    if (!album) {
      // If album doesn't exist, create a new album with an empty photos array.
      album = {
        title,
        cover: cloudinaryResult.secure_url, // Optionally use this image as the album cover
        photos: [],
        publicid:''
      };
      user.albums.push(album);
    }
    
    // Push the new photo to the album's photos array including public_id
    album.photos.push({ url: cloudinaryResult.secure_url, caption, publicid: cloudinaryResult.public_id });
    
    // Save the updated user document
    await user.save();

    console.log("Photo added to album successfully!");
    res.json({ 
      success: true, 
      photo: { 
        url: cloudinaryResult.secure_url, 
        caption, 
        publicid: cloudinaryResult.public_id 
      } 
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




app.post("/addalbum", upload.single("image"), async (req, res) => {
  try {
    console.log("Received body:", req.body);
    
    const { userid, title } = req.body;

    if (!userid) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Find the user
    const user = await userModel.findById(userid);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log("User found:", user);

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image upload failed" });
    }

    console.log("Uploading to Cloudinary...");

    // Upload image to Cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "albums" }, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }).end(req.file.buffer); // Pass the image buffer to Cloudinary
    });

    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
    }

    console.log("Cloudinary upload successful:", cloudinaryResult.secure_url);

    // Create new album object including the public_id
    const newAlbum = {
      title: title, // Keep the original title
      cover: cloudinaryResult.secure_url, // Use Cloudinary URL as cover
      photos: [],
      publicid: cloudinaryResult.public_id, // Include public ID for the cover image
    };

    // Add album to user's collection (Only after successful upload)
    user.albums.push(newAlbum);
    await user.save();

    console.log("Album saved successfully!");
    console.log(newAlbum);

    res.json({ 
      success: true, 
      album: newAlbum 
    });
  } catch (error) {
    console.error("Error adding album:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.post('/login', async (req, res) => {
  try {

      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).send('email and password are required.');
      }
      const user = await userModel.findOne({ email });
      if (!user) {
          return res.status(403).send('Invalid username or password.');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(403).send('Invalid email or password.');
      }
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRATION,
      });
      
      const albumDetails = user.albums.map(album => ({
        title: album.title,
        url: album.cover,
        publicid: album.publicid 
    }));

      res.json({ token, user, albums:albumDetails });
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal server error.');
  }
});

app.post('/signup', async (req, res, next) => {
  try{
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
      return res.status(400).send('All fields are required.');
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
      return res.status(400).send('Email already taken.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new userModel({name, password: hashedPassword, email});
  await user.save();
  res.status(201).send('User registered successfully.');
  }
  catch(error){
      console.error('Error during signup:', error);
      res.status(500).send('Internal server error.');
  }
})

app.post("/deletealbum", async (req, res) => {
  const { userid, title, publicid } = req.body;

  if (!userid || !title || !publicid) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // First, find the user and the album
    const user = await userModel.findOne({ _id: userid });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find the album to delete from the albums array
    const albumIndex = user.albums.findIndex((album) => album.publicid === publicid);

    if (albumIndex === -1) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    // Get the album photos
    const albumToDelete = user.albums[albumIndex];

    // Delete images in the photos array (if any)
    for (const photo of albumToDelete.photos) {
      const cloudinaryResponse = await cloudinary.uploader.destroy(photo.publicid);
      if (cloudinaryResponse.result !== "ok") {
        console.error(`Failed to delete photo with publicid: ${photo.publicid}`);
        // Continue attempting to delete other photos even if one fails
      }
    }

    // Now delete the album cover image
    const cloudinaryResponseCover = await cloudinary.uploader.destroy(albumToDelete.publicid);
    if (cloudinaryResponseCover.result !== "ok") {
      console.error(`Failed to delete album cover with publicid: ${albumToDelete.publicid}`);
    }

    // Remove the album from the albums array
    user.albums.splice(albumIndex, 1);

    // Save the updated user document
    await user.save();

    return res.status(200).json({ success: true, message: "Album and photos deleted successfully." });

  } catch (error) {
    console.error("Error deleting album:", error);
    return res.status(500).json({ success: false, message: "Error deleting album." });
  }
});


// Route for deleting an image from a user's album
app.post('/deleteimage', async (req, res) => {
  const { userid, title, publicid } = req.body;
  console.log(userid, title, publicid)

  if (!userid || !title || !publicid) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Find the user by user ID
    const user = await userModel.findOne({ _id: userid });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the album by title
    const album = user.albums.find((album) => album.title === title);
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    // Find the image in the album's photos array
    const photoIndex = album.photos.findIndex((photo) => photo.publicid === publicid);
    if (photoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Image not found in the album' });
    }

    // Delete the image from Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.destroy(publicid);

    if (cloudinaryResponse.result !== 'ok') {
      return res.status(500).json({ success: false, message: 'Failed to delete image from Cloudinary' });
    }

    // Remove the image from the album's photos array
    album.photos.splice(photoIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ success: false, message: 'Error deleting image' });
  }
});

app.listen("4000", () =>{
    console.log("listening to port 4000");
})
