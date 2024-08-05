const express = require("express");
const router = express.Router();
const controler = require("./controler");
const controlerM = require("./mobilecontroler");
const invoiceModule = require("./module/invoice");
const cloudinary = require("cloudinary").v2;
const validate = require("./Middleware-Validation/validate-middleware");
const validSchema = require("./Validator/auth-validator");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret, // Click 'View Credentials' below to copy your API secret
});

router
  .route("/App/RegisterOtp")
  .post(validate(validSchema.signupSchema), controlerM.RegisterOtp);

router
  .route("/App/Register")
  .post(validate(validSchema.registerSchema), controlerM.Register);

router
  .route("/App/Login")
  .post(validate(validSchema.loginSchema), controlerM.Register);

router.route("/App/ForgetOtp").post(controlerM.ForgetOtp);
router.route("/App/ForgetPw").post(controlerM.ForgetPw);
router
  .route("/App/NewPw")
  .post(validate(validSchema.newPwSchema), controlerM.NewPw);

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
router.route("/testUp").post(controler.TestUploadCloud);

const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

router.post("/LogoUpload", async (req, res) => {
  try {
    const file = await req.files.file;
    let filename = await cloudinary.uploader.upload(
      file.tempFilePath,
      { folder: "InvoiceLogo" },
      (err, result) => {
        return result;
      }
    );

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
      logo: filename.url,
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
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/LogoUpdate", controler.LogoUpdate);

module.exports = router;
