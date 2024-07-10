const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const controler = require("./controler");
const multer = require("multer");
const invoiceModule = require("./module/invoice");
const currencyModule = require("./module/currencyList");
const iGenerate = require("./InvoiceGeneret/invoice");
router.route("/").get(controler.Home);
router.route("/RegisterOtp").post(controler.RegisterOtp);
router.route("/ForgetPw").post(controler.ForgetPw);
router.route("/NewPw").post(controler.NewPw);
router.route("/Register").post(controler.Register);
router.route("/Login").post(controler.Login);
router.route("/FindUser").post(controler.FindUser);
router.route("/EditProfile").post(controler.EditProfile);
router.route("/CurrencyData").get(controler.CurrencyData);
router.route("/InvoiceNumber").post(controler.InvoiceNumber);
router.route("/currencyListAdd").get(controler.currencyListAdd);
router.route("/UserInvoice").post(controler.UserInvoice);
router.route("/InvoiceDelete").post(controler.InvoiceDelete);
router.route("/InvoiceStatus").post(controler.InvoiceStatus);
router.route("/FindInvoice").post(controler.FindInvoice);
router.route("/UpdateInvoice").post(controler.UpdateInvoice);

// Download Invoice
const downloadInvoice = async (InvoiceName) => {
  const data = await invoiceModule.Invoice.findOne({ InvoiceName })
    .sort({
      invoiceNo: -1,
    })
    .exec();

  const currency = await currencyModule.currencyList.findOne({
    currencySymbol: data.currency,
  });

  var Items = [];
  for (var i = 0; i < data.Items.length; i++) {
    Items.push({
      name: data.Items[i].itemName,
      quantity: data.Items[i].itemQty,
      unit_cost: data.Items[i].itemRate,
    });
  }
  var invoice = {
    logo: data.logo,
    from: data.formTitle,
    to: data.billTo,
    ship_to: data.shipTo,
    currency: currency.countryName,
    number: data.invoiceNo,
    date: data.createDate,
    payment_terms: data.paymentTerms,
    due_date: data.dueDate,
    items: Items,
    fields: {
      tax: data.taxType,
      discounts: data.discountType,
      shipping: data.shipping,
    },
    discounts: data.discount,
    tax: data.tax,
    shipping: data.shipping,
    amount_paid: data.paidAmount,
    notes: data.notes,
    terms: data.terms,
  };

  const date = data.dateI;
  const time = data.timeI;
  const fileName = date.replaceAll(" ", "") + time.replaceAll(":", "");
  iGenerate.generateInvoice(
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
// Date Formate Function

const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

const inertData = async (
  LogoName,
  formData,
  Items,
  email,
  invoiceNo,
  createDate,
  dueDate,
  dateI,
  timeI,
  InvoiceName
) => {
  await invoiceModule.Invoice.create({
    email: email,
    logo: "https://invoiceserver-nfyb.onrender.com/Image/Logo/" + LogoName,
    invoice: formData.invoice,
    invoiceNo: invoiceNo,
    dateI,
    timeI,
    formTitle: formData.formTitle,
    billTo: formData.billTo,
    shipTo: formData.shipTo,
    createDate,
    paymentTerms: formData.paymentTerms,
    dueDate,
    Phone: formData.phoneNumber,
    Items,
    notes: formData.itemNotes,
    terms: formData.itemTerms,
    subTotal: formData.subTotal,
    discount: formData.billdiscount,
    discountType: formData.discountType,
    tax: formData.biltax,
    taxType: formData.taxType,
    shipping: formData.shipping,
    total: formData.total,
    paidAmount: formData.paidAmount,
    balanceDue: formData.balanceDue,
    currency: formData.currency,
    status: false,
    InvoiceName,
  });

  downloadInvoice(InvoiceName);

  return InvoiceName;
};

const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, "Image/Logo");
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

router.post("/LogoUpload", upload.single("file"), async (req, res) => {
  try {
    const LogoName = await req.file.filename;
    const formData = await JSON.parse(req.body.formData);
    const Items = await JSON.parse(req.body.items);
    const email = await req.body.email;
    const invoiceNo = await req.body.invoiceNo;
    const InvoiceName = await req.body.invoiceName;
    const dateI = await req.body.dateI;
    const timeI = await req.body.timeI;

    const createDate = formatDate(formData.billdate);
    const dueDate = formatDate(formData.billDuedate);

    const a = inertData(
      LogoName,
      formData,
      Items,
      email,
      invoiceNo,
      createDate,
      dueDate,
      dateI,
      timeI,
      InvoiceName
    );
    res.status(200).send(InvoiceName);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.route("/invoiceDownload").get((req, res) => {
  downloadInvoice("henilkhokhariya@gmail.com");
});

router.route("/download").get((req, res) => {
  const fName = req.query.filename;
  console.log(fName);
  const file = path.join(__dirname, fName);
  res.download(file);
});

router.post("/LogoUpdate", upload.single("file"), controler.LogoUpdate);

module.exports = router;
