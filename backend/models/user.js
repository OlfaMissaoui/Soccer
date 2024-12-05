// import mongoose module
const mongoose = require("mongoose");
// créat PlayerSchema
const userSchema = mongoose.Schema({
  firstName: String,
  lasttName: String,
  email: String,
  password: String,
  role: String,
  photo: String,
});
// affect model name to schema
const user = mongoose.model("User", userSchema);
// make match exportebol
module.exports = user;
