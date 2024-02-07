const router = require('express').Router();
const TradeRoute = require('../models/tradeRoute.model');

// Route for getting all trade routes
router.get('/', async (req, res) => {
    try {
        const tradeRoutes = await TradeRoute.find();
        res.json(tradeRoutes);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Route for adding a new trade route
router.post('/add', async (req, res) => {
    try {
        const { name, rewards } = req.body;
        const newTradeRoute = new TradeRoute({ name, rewards });
        await newTradeRoute.save();
        res.json('Trade route added successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Route for getting a specific trade route by ID
router.get('/:id', async (req, res) => {
    try {
        const tradeRoute = await TradeRoute.findById(req.params.id);
        res.json(tradeRoute);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Route for updating a trade route by ID
router.put('/update/:id', async (req, res) => {
    try {
        const { name, rewards } = req.body;
        await TradeRoute.findByIdAndUpdate(req.params.id, { name, rewards });
        res.json('Trade route updated successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// Route for deleting a trade route by ID
router.delete('/:id', async (req, res) => {
    try {
        await TradeRoute.findByIdAndDelete(req.params.id);
        res.json('Trade route deleted successfully');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

module.exports = router;
