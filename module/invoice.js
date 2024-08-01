const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemQty: { type: Number, required: true },
  itemRate: { type: Number, required: true },
  itemAmount: { type: Number, required: true },
  currency: { type: String, required: true },
});

const invoiceSchema = mongoose.Schema(
  {
    _id: { type: String },
    email: { type: String },
    logo: { type: String },
    invoice: { type: String },
    invoiceNo: { type: String },
    dateI: { type: String },
    timeI: { type: String },
    formTitle: { type: String },
    billTo: { type: String },
    shipTo: { type: String },
    createDate: { type: String },
    paymentTerms: { type: String },
    dueDate: { type: String },
    Phone: { type: String },
    Items: [itemSchema],
    notes: { type: String },
    terms: { type: String },
    subTotal: { type: String },
    discount: { type: String },
    discountType: { type: String },
    tax: { type: String },
    taxType: { type: String },
    shipping: { type: String },
    total: { type: String },
    paidAmount: { type: String },
    balanceDue: { type: String },
    currency: { type: String },
    status: { type: String },
    InvoiceName: { type: String },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = { Invoice };
