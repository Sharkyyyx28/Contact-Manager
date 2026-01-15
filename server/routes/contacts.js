const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @desc    Create a contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const contactExists = await Contact.findOne({ email });
    if (contactExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const contact = await Contact.create({ name, email, phone });
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Read all contacts 
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // Sort by newest
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a contact
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Return updated doc & run checks
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;