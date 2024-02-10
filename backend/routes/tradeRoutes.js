const router = require('express').Router();
let TradeRoute = require('../models/tradeRoute.model')

router.route('/').get((req, res) => {
    TradeRoute.find()
        .then(tradeRoutes => res.json(tradeRoutes))
        .catch(err => res.status(400).json('Error: ' + err));
});

// API call to return base reward for a trade route
router.get('/:packType/:source/:destination/:rewardType', async (req, res) => {
    const { packType, source, destination, rewardType } = req.params;
    try {
        const tradeRoute = await TradeRoute.findOne({ packType, source, destination, rewardType });

        if (!tradeRoute) {
            return res.status(404).json({ message: 'Trade route not found' });
        }
        // Trade route found, respond with base value
        res.json(tradeRoute.rewardValue);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;