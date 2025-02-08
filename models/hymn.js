const mongoose = require("mongoose");

const hymnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  number: { type: Number, required: true },
  lyrics: { type: String, required: true },
  composer: { type: String, required: true },
  topics: [String],
  scriptures: { type: String },
  webURL: { type: String },
});

const Hymn = mongoose.model("Hymn", hymnSchema); // PascalCase
module.exports = Hymn;
