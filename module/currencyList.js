const mongoose = require("mongoose");

const currencySchema = mongoose.Schema({
  countryName: { type: String, require: true },
  currencySymbol: { type: String, require: true },
});

const currencyList = mongoose.model("currencyList", currencySchema);

module.exports = { currencyList };

