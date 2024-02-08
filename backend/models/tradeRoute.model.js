const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tradeRouteSchema = new Schema({
    packType: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    rewardType: {
      type: String,
      required: true
    },
    rewardValue: {
      type: Number,
      required: true
    },
  }, {
    timestamps: true
  });

  const TradeRoute = mongoose.model('TradeRoute', tradeRouteSchema);
  
  module.exports = TradeRoute;