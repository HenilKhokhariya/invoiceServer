const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit_cost: { type: Number, required: true },
});

const invoiceMschema = mongoose.Schema(
  {
    logo: { type: String }, // LOGO
    from: { type: String }, // Form Title
    to: { type: String }, // Bill To
    ship_to: { type: String }, // Ship To
    currency: { type: String }, // CURRENCY NAME EX=INR USD
    number: { type: String }, // Invoice Number
    date: { type: String }, // Create Date
    payment_terms: { type: String }, // Payment_terms
    due_date: { type: String }, // Due_date
    phone: { type: String }, // Phone Number
    items: [itemSchema], // Array Formet
    tax: { type: String }, // Tax Ex. 5
    discounts: { type: String }, // Discounts Ex. 5
    shipping: { type: String }, // Shipping Charg Ex. 100
    taxType: { type: String }, // taxType Ex. $ or %
    discountsType: { type: String }, // DiscountsType Ex. $ or %
    amount_paid: { type: String }, // amount_paid
    notes: { type: String }, // Notes
    terms: { type: String }, // Terms
    dateI: { type: String }, // Current Date Ex= May 08 2024
    timeI: { type: String }, // Current Time Ex= 01:07:59
    invoiceName: { type: String }, // Invoice Name May082024010759.pdf 
  },
  {
    timestamps: true,
  }
);

const InvoiceM = new mongoose.model("InvoiceM", invoiceMschema);

module.exports = { InvoiceM };
