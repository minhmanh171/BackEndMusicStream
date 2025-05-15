const express = require('express');
const app = express();
const { default: mongoose } = require('mongoose');

const connectDB = require('./config/db');
const cloudinaryRoutes = require('./routes/cloudinary_route');
const songRoutes = require('./routes/song_route');
const userRoutes = require('./routes/user_route');

const cors = require('cors');
app.use(cors());
connectDB();



app.use(express.json());
app.get('/', (req, res) => {
    return res.json({ message: 'Hello World!' });
});


app.use('/api', cloudinaryRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/users', userRoutes);
app.listen(4000, () => {
    console.log('Server is running on port 4000');

})