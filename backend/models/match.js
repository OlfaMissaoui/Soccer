// import mongoose module
const mongoose = require("mongoose");
// créat MatchSchema
const matchSchema = mongoose.Schema({
  // teamOne: String,
  // teamTow: String,
  scoreOne: Number,
  scoreTow: Number,
  idTeamOne: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  idTeamTow: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
});
// affect model name to schema
const match = mongoose.model("Match", matchSchema);
// make match exportebol
module.exports = match;
