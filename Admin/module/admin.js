const mongoose = require ("mongoose");

const adminSchema = new mongoose.Schema({
  password: { type: String, require: true },
  a_name: { type: String, require: true },
  email: { type: String, require: true },
},
{
  timestamps:true,
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin };
