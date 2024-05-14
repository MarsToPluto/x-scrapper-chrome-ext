// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Create Express app
const app = express();
app.use(cors())
// MongoDB Atlas connection string
const mongoURI = 'mongodb://127.0.0.1:27017/X';
// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define MongoDB schema
const Schema = mongoose.Schema;
const dataSchema = new Schema({
    name: String,
    tweetText: String,
    isVerified: {type:Boolean,default:false},
    stats: {type:Object,default:{}},
    extras: {
        rawLink: String,
        tweetID: {type:String,unique:true},
        visitLink: String,
        avatar: String,
        username: String
    },
    insertedAt: { type: Date, default: Date.now },
    timestamp: Date,
    image: String,
    postImages: Object,
});
// Create MongoDB model
const Data = mongoose.model('tweets', dataSchema);

// Express middleware for parsing JSON
app.use(express.json());

// Routes
// Create data
app.post('/api/data', async (req, res) => {
  try {
    const newData = new Data(req.body);
    const savedData = await newData.save();
    res.json(savedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all data
app.get('/api/data', async (req, res) => {
  try {
    const allData = await Data.find();
    res.json(allData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read data by ID
app.get('/api/data/:id', async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Update data by ID
app.put('/api/data/:id', async (req, res) => {
  try {
    const updatedData = await Data.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete data by ID
app.delete('/api/data/:id', async (req, res) => {
  try {
    await Data.findByIdAndDelete(req.params.id);
    res.json({ message: 'Data deleted' });
  } catch (err) {
    res.status(404).json({ message: 'Data not found' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
console.log(`\n\n************************************************`);
console.log(`*        🚀 API Server is now running 🚀       *`);
console.log(`************************************************\n\n`);

});
