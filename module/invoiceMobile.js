const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemQty: { type: Number, required: true },
  itemRate: { type: Number, required: true },
  itemAmount: { type: Number, required: true },
  currency: { type: String, required: true },
});

const invoiceMSchema = mongoose.Schema(
  {
    email: { type: String },
    logo: { type: String },
    invoice: { type: String },
    invoiceNo: { type: String },
    formTitle: { type: String },
    billTo: { type: String },
    shipTo: { type: String },
    createDate: { type: String },
    paymentTerms: { type: String },
    dueDate: { type: String },
    Phone: { type: Number },
    Items: [itemSchema],
    notes: { type: String },
    terms: { type: String },
    subTotal: { type: Number },
    discount: { type: Number },
    discountType: { type: String },
    tax: { type: Number },
    taxType: { type: String },
    shipping: { type: Number },
    total: { type: Number },
    paidAmount: { type: Number },
    balanceDue: { type: Number },
    currency: { type: String },
    status: { type: Boolean },
    InvoiceName: { type: String },
    date_time: { type: Date },
  },
  {
    timestamps: true,
  }
);

const InvoiceMobile = mongoose.model("InvoiceMobile", invoiceMSchema);

module.exports = { InvoiceMobile };
