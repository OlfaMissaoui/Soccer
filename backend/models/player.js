// import mongoose module
const mongoose = require("mongoose");
// créat PlayerSchema
const playerSchema = mongoose.Schema({
  name: String,
  position: String,
  age: Number,
  number: Number,
  photo: String,
  idTeam: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
});
// affect model name to schema
const player = mongoose.model("Player", playerSchema);
// make match exportebol
module.exports = player;
