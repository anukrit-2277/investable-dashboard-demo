import express from 'express';
import AccessRequest from '../models/AccessRequest.js';

const router = express.Router();

// Create a new access request
router.post('/', async (req, res) => {
  try {
    const { companyId, companyName, investorEmail, investorName } = req.body;
    const request = new AccessRequest({ companyId, companyName, investorEmail, investorName });
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

// Clear all access requests (for testing)
router.delete('/clear', async (req, res) => {
  try {
    await AccessRequest.deleteMany({});
    res.json({ message: 'All access requests cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Migration route to add company names to existing requests
router.post('/migrate-company-names', async (req, res) => {
  try {
    const requests = await AccessRequest.find({ companyName: { $exists: false } });
    
    // Sample company names for migration (you can replace with actual company data)
    const companyNames = [
      "Innovatech Solutions", "Quantum Dynamics", "Apex Ventures", "BlueRiver Capital", 
      "CoreSystems Inc.", "DeltaWave Technologies", "Emerald Innovations", "FusionX Labs", 
      "GlobalEdge Partners", "Horizon Enterprises", "ImpactHub", "JetStream Networks",
      "KineticTech", "LuminaHealth", "MeridianGroup", "NovaCore Systems", "OmniTech Solutions",
      "PrismData", "QuantumSoft", "RedShift Robotics"
    ];
    
    for (let i = 0; i < requests.length; i++) {
      const request = requests[i];
      const companyName = companyNames[i % companyNames.length];
      await AccessRequest.findByIdAndUpdate(request._id, { companyName });
    }
    
    res.json({ 
      message: `Updated ${requests.length} requests with company names`,
      updatedCount: requests.length 
    });
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
