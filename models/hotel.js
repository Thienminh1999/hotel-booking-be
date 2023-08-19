const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: String,
  address: String,
  distance: String,
  photos: [String],
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  ],
  desc: String,
  rating: Number,
  cheapestPrice: Number,
  featured: Boolean,
  tag: String,
  freeCancel: Boolean,
  rateText: String,
  shortDesc: String,
  title: String,
});

module.exports = mongoose.model("Hotel", hotelSchema);
