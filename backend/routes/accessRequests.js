import express from 'express';
import AccessRequest from '../models/AccessRequest.js';

const router = express.Router();

// Create a new access request
router.post('/', async (req, res) => {
  try {
    const { companyId, investorEmail, investorName } = req.body;
    const request = new AccessRequest({ companyId, investorEmail, investorName });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all access requests (for Super Admin)
router.get('/', async (req, res) => {
  try {
    const requests = await AccessRequest.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get requests for a specific investor
router.get('/investor/:email', async (req, res) => {
  try {
    const requests = await AccessRequest.find({ investorEmail: req.params.email });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve or deny a request (by Super Admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const request = await AccessRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
