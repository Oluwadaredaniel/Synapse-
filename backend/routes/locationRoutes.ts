import express from 'express';
import { getCountries, getSchoolsByCountry, addCountry, addSchool } from '../controllers/locationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public
router.get('/countries', getCountries);
router.get('/schools/:countryName', getSchoolsByCountry);

// Admin Only (In a real app, add an 'admin' middleware check here)
router.post('/countries', protect, addCountry);
router.post('/schools', protect, addSchool);

export default router;