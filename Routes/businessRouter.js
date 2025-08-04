const express = require('express');
const router = express.Router();
const { registerBusiness, getPendingBusinesses, approveBusiness, rejectBusiness, getApprovedBusinesses, updateBusiness, deleteBusiness, getBusinessCounts, getBusinessTypeCounts, searchBusinesses } = require('../controller/businessController');

// POST /api/business/register
router.post('/register', registerBusiness);

// GET /pending - get all pending businesses
router.get('/pending', getPendingBusinesses);

// GET /approved - get all approved businesses
router.get('/approved', getApprovedBusinesses);

// GET /counts - get business counts
router.get('/counts', getBusinessCounts);

// GET /type-counts - get approved business counts by type and rejected count
router.get('/type-counts', getBusinessTypeCounts);

// GET /search - search all businesses
router.get('/search', searchBusinesses);

// PATCH /approve/:id - approve a business
router.patch('/approve/:id', approveBusiness);

// PATCH /reject/:id - reject a business
router.patch('/reject/:id', rejectBusiness);

// PATCH /update/:id - update a business
router.patch('/update/:id', updateBusiness);

// DELETE /delete/:id - delete a business
router.delete('/delete/:id', deleteBusiness);

module.exports = router; 