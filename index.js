require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Message = require('./messageSchema');
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Connected')
})

//Create
app.post('/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update
app.put('/messages/:id', async (req, res) => {
    try {
      const messageId = req.params.id;
      const updatedMessage = await Message.findByIdAndUpdate(messageId, req.body, { new: true });
  
      if (!updatedMessage) {
        return res.status(404).json({ message: 'Message not found' });
      }
  
      res.json(updatedMessage);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Delete
app.delete('/messages/:id', async (req, res) => {
    try {
      const messageId = req.params.id;
      const deletedMessage = await Message.findByIdAndDelete(messageId);
  
      if (!deletedMessage) {
        return res.status(404).json({ message: 'Message not found' });
      }
  
      res.json({ message: 'Message deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
