const mongoose = require("mongoose");
const Hymn = require("../models/hymn");

// Get all hymns controller function
const getAllHymns = async (req, res) => {
  try {
    const hymns = await Hymn.find();
    res.json(hymns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single hymn controller function
const getSingleHymn = async (req, res) => {
  try {
    const hymn = await Hymn.findById(req.params.id);
    res.json(hymn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new hymn controller function
const createHymn = async (req, res) => {
  const hymn = new Hymn({
    title: req.body.title,
    number: req.body.number,
    lyrics: req.body.lyrics,
    composer: req.body.composer,
    topics: req.body.topics,
    scriptures: req.body.scriptures,
    webURL: req.body.webURL,
  });
  try {
    const newHymn = await hymn.save();
    res.status(201).json(newHymn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a hymn controller function
const updateHymn = async (req, res) => {
  try {
    const hymn = await Hymn.findById(req.params.id);
    if (req.body.title) {
      hymn.title = req.body.title;
    }
    if (req.body.number) {
      hymn.number = req.body.number;
    }
    if (req.body.lyrics) {
      hymn.lyrics = req.body.lyrics;
    }
    if (req.body.composer) {
      hymn.composer = req.body.composer;
    }
    if (req.body.topics) {
      hymn.topics = req.body.topics;
    }
    if (req.body.scriptures) {
      hymn.scriptures = req.body.scriptures;
    }
    if (req.body.webURL) {
      hymn.webURL = req.body.webURL;
    }
    const updatedHymn = await hymn.save();
    res.json(updatedHymn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a hymn controller function
const deleteHymn = async (req, res) => {
  try {
    await Hymn.findByIdAndDelete(req.params.id);
    res.json({ message: "Hymn deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllHymns,
  getSingleHymn,
  createHymn,
  updateHymn,
  deleteHymn,
};
