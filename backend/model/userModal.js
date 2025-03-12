const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    photos: {
        type: [
            {
                url: {
                    type: String,
                    required: true,
                },
                caption: {
                    type: String,
                },
                publicid:{
                    type:String,
                    required: true
                }
            },
        ],
        default: [], // ✅ Ensures the array is empty by default
    },
    cover: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2024/04/19/03/27/frame-8705320_640.png',
    },
    publicid:{
        type:String,
        required: true
    }
});


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    albums: {
        type: [albumSchema],
        default: [],
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
