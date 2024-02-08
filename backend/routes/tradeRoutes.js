const router = require('express').Router();
let TradeRoute = require('../models/tradeRoute.model')

router.route('/').get((req, res) => {
    TradeRoute.find()
        .then(tradeRoutes => res.json(tradeRoutes))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:packType/:source/:destination/:rewardType').get((req, res) => {
    const { packType, source, destination, rewardType } = req.params;
    TradeRoute.findOne({ packType, source, destination, rewardType })
        .then(tradeRoute => {
            if (!tradeRoute) {
                return res.status(404).json({ error: 'Trade route not found' });
            }
            res.json(tradeRoute);
        })
        .catch(err => res.status(400).json({ error: 'Error: ' + err }));
});

module.exports = router;