// import mongoose module
const mongoose = require("mongoose");
// créat PlayerSchema
const teamSchema = mongoose.Schema({
  name: String,
  description: String,
  Owner: String,
  fondation: String,
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
});
// affect model name to schema
const team = mongoose.model("Team", teamSchema);
// make match exportebol
module.exports = team;
