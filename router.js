const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const controler = require("./controler");
const multer = require("multer");
const invoiceModule = require("./module/invoice");

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
router.route("/OnlyInvoice").post(controler.OnlyInvoice);

const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
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

const storage1 = multer.diskStorage({
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

const upload1 = multer({ storage: storage1 });

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
    const id = dateI + timeI;
    await invoiceModule.Invoice.create({
      _id: id.replaceAll(" ", ""),
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
    res.status(200).send("Done");
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/LogoUpdate", upload1.single("file"), controler.LogoUpdate);

module.exports = router;
