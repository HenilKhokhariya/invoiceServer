const express = require("express");
const invoiceModule = require("./module/invoiceM");
const invoiceGenerate = require("./InvoiceGeneret/invoiceM");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
// const controler = require("./controler");
// const multer = require("multer");
// const invoiceModule = require("./module/invoice");
// const currencyModule = require("./module/currencyList");
// const iGenerate = require("./InvoiceGeneret/invoice");
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, "Image/MobileLogo");
    ensureDirectoryExistence(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(
      null,

      uniqueSuffix + "-" + file.originalname
    );
  },
});

const upload = multer({ storage: storage });

const downloadInvoice = async (invoiceName) => {
  const data = await invoiceModule.InvoiceM.findOne({ invoiceName })
    .sort({
      invoiceNo: -1,
    })
    .exec();
  var Items = [];
  for (var i = 0; i < data.items.length; i++) {
    Items.push({
      name: data.items[i].name,
      quantity: data.items[i].quantity,
      unit_cost: data.items[i].unit_cost,
    });
  }
  var invoice = {
    from: data.from,
    to: data.to,
    ship_to: data.ship_to,
    currency: data.currency,
    number: data.number,
    date: data.date,
    payment_terms: data.payment_terms,
    due_date: data.due_date,
    items: Items,
    fields: {
      tax: data.taxType,
      discounts: data.discountType,
      shipping: data.shipping,
    },
    discounts: data.discount,
    tax: data.tax,
    shipping: data.shipping,
    amount_paid: data.amount_paid,
    notes: data.notes,
    terms: data.terms,
  };

  const date = data.dateI;
  const time = data.timeI;
  const fileName = date.replaceAll(" ", "") + time.replaceAll(":", "");
  invoiceGenerate.generateInvoice(
    invoice,
    fileName + ".pdf",
    function () {
      console.log("Saved invoice to invoice.pdf");
    },
    function (error) {
      console.error(error);
    }
  );
};

const inertData = async (
  logo,
  from,
  to,
  ship_to,
  currency,
  number,
  date,
  payment_terms,
  due_date,
  items,
  tax,
  discounts,
  shipping,
  taxType,
  discountsType,
  amount_paid,
  notes,
  terms,
  dateI,
  timeI,
  invoiceName,
  phone
) => {
  await invoiceModule.InvoiceM.create({
    logo: "https://invoiceserver-nfyb.onrender.com/Image/MobileLogo/" + logo,
    from,
    to,
    ship_to,
    currency,
    number,
    date,
    payment_terms,
    due_date,
    items,
    tax,
    discounts,
    shipping,
    taxType,
    discountsType,
    amount_paid,
    notes,
    terms,
    dateI,
    timeI,
    invoiceName,
    phone,
  });
  downloadInvoice(invoiceName);
};

router.post("/LogoUpload", upload.single("file"), async (req, res) => {
  try {
    const logo = await req.file.filename; // LOGO
    const from = await req.body.from; // Form Title
    const to = await req.body.to; // Bill To
    const ship_to = await req.body.ship_to; // Ship To
    const currency = await req.body.currency; // CURRENCY NAME EX=INR USD
    const number = await req.body.number; // Invoice Number
    const date = await req.body.date; // Create Date
    const payment_terms = await req.body.payment_terms; // Payment_terms
    const due_date = await req.body.due_date; // Due_date
    const tax = await req.body.tax; // Tax Ex. 5
    const discounts = await req.body.discounts; // Discounts Ex. 5
    const shipping = await req.body.shipping; // Shipping Charg Ex. 100
    const taxType = await req.body.taxType; // taxType Ex. $ or %
    const discountsType = await req.body.discountsType; // DiscountsType Ex. $ or %
    const amount_paid = await req.body.amount_paid; // amount_paid
    const notes = await req.body.notes; // Notes
    const terms = await req.body.terms; // Terms
    const dateI = await req.body.dateI; // Current Date Ex= 31-07-2024
    const timeI = await req.body.timeI; // Current Time Ex= 01:07:59
    const invoiceName = await req.body.invoiceName; // Invoice Number
    const phone = await req.body.phone; // Phone Number 1234567891
    const items = await JSON.parse(req.body.items); // Array Formet
    inertData(
      logo,
      from,
      to,
      ship_to,
      currency,
      number,
      date,
      payment_terms,
      due_date,
      items,
      tax,
      discounts,
      shipping,
      taxType,
      discountsType,
      amount_paid,
      notes,
      terms,
      dateI,
      timeI,
      invoiceName,
      phone
    );
    res.status(200).json({ status: 200, msg: "Upload Success Fully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
