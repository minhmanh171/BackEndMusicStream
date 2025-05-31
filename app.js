const express = require('express');
const app = express();
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const cloudinaryRoutes = require('./routes/cloudinary_route');
const songRoutes = require('./routes/song_route');
const userRoutes = require('./routes/user_route');
const playlistRoutes = require('./routes/playList_route');
const artistRoutes = require('./routes/artist_route');
const cors = require('cors');
app.use(cors());
connectDB();



app.use(express.json());
app.get('/', (req, res) => {
    return res.json({ message: 'Hello World!' });
});


app.use('/api/upload', cloudinaryRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/users', userRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/artist', artistRoutes);

//commnet
const commentRoutes = require('./routes/comment_rote');
app.use('/api/comments', commentRoutes);



//favorite
const favoriteRoutes = require('./routes/favorite_route');
app.use('/api/favorites', favoriteRoutes);

//album
const albumRoutes = require('./routes/album_route.js');
app.use('/api/album', albumRoutes);

//type
const typeRoute = require('./routes/type_route.js');
app.use('/api/type', typeRoute);

//ai
const aichat = require('./routes/Ai_route.js');
app.use('/ai', aichat);

//chatbox
const chatbox = require('./routes/chatbox_route.js');
app.use('/api/chatbox', chatbox);


app.listen(4000, () => {
    console.log('Server is running on port 4000');

})