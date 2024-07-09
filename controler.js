const userModule = require("./module/user");
const invoiceModule = require("./module/invoice");
const currencyModule = require("./module/currencyList");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");
const sendRmail = require("./Email/registrationOtp");
const sendForgetOtpmail = require("./Email/registrationOtp");

const Home = (req, res) => {
  try {
    res.status(200).send("Home");
  } catch (error) {
    res.status(400).send("Not Found");
  }
};

const Register = async (req, res) => {
  try {
    var { fname, lname, email, password } = await req.body;
    const date_time = new Date().toString().substring(0, 25);
    password = cryptr.encrypt(password);
    const userExist = await userModule.User.findOne({ email });
    if (userExist) {
      res.json({ msg: "User Already Exist", status: "400" });
      return;
    }

    await userModule.User.create({ fname, lname, email, password, date_time });

    res.status(200).json({ msg: "Create User SuccessFully", status: "200" });
  } catch (error) {
    res.status(400).send("Not Found");
  }
};

const RegisterOtp = async (req, res) => {
  try {
    var { otp, email, user } = await req.body;
    const userExist = await userModule.User.findOne({ email });
    if (userExist) {
      res.json({ msg: "User Already Exist", status: "400" });
      return;
    }
    sendRmail.main(email, otp, user);
    res.status(200).json({ msg: "Otp Send SuccessFully", status: "200" });
  } catch (error) {
    res.status(400).send("Not Found");
  }
};

const ForgetPw = async (req, res) => {
  try {
    var { otp, email } = await req.body;
    const userExist = await userModule.User.findOne({ email });
    if (userExist) {
      sendForgetOtpmail.main(email, otp);
      res.status(200).json({ msg: "Otp Send SuccessFully", status: "200" });

      return;
    }
    res.status(400).json({ msg: "User Not Exits", status: "400" });
  } catch (error) {
    res.status(400).send("Not Found");
  }
};

const NewPw = async (req, res) => {
  try {
    var { email, password } = await req.body;

    password = cryptr.encrypt(password);
    await userModule.User.updateOne({ email }, { $set: { password } });

    res
      .status(200)
      .json({ msg: "Password Change SuccessFully", status: "200" });
  } catch (error) {
    res.status(400).send("Not Found");
  }
};
const Login = async (req, res) => {
  try {
    var { email, password } = await req.body;
    const date_time = new Date().toString().substring(0, 25);

    const userExist = await userModule.User.findOne({ email });
    if (userExist) {
      let passwordUser = cryptr.decrypt(userExist.password);

      if (password === passwordUser) {
        await userModule.UserLogin.create({ email, date_time });

        res.status(200).json({ msg: "User SuccessFully Login", status: "200" });
      } else {
        res.status(400).json({ msg: "Enter Valid Password", status: "400" });
      }
    } else {
      res.json({ msg: "Enter Valid Email ID", status: "400" });
    }
  } catch (error) {
    res.status(400).send("Not Found");
  }
};

const FindUser = async (req, res) => {
  try {
    var { email } = await req.body;

    const data = await userModule.User.findOne({ email }, { password: 0 });

    res.json({ msg: data, status: 200 });
  } catch (error) {
    res.status(400).send(error);
  }
};

const EditProfile = async (req, res) => {
  try {
    var { email, fname, lname } = await req.body;

    await userModule.User.updateOne({ email }, { $set: { fname, lname } });

    res
      .status(200)
      .json({ msg: "Password Change SuccessFully", status: "200" });
  } catch (error) {
    res.status(400).send("Not Found");
  }
};

const CurrencyData = async (req, res) => {
  try {
    const data = await currencyModule.currencyList.find({});

    res.json({ msg: data, status: 200 });
  } catch (error) {
    res.status(400).send(error);
  }
};

const InvoiceNumber = async (req, res) => {
  try {
    const email = await req.body.email;
    const data = await invoiceModule.Invoice.findOne({ email })
      .sort({
        invoiceNo: -1,
      })
      .select("invoiceNo")
      .exec();
    const invoiceNo = parseInt(data.invoiceNo) + 1;
    res.json({ msg: invoiceNo, status: 200 });
  } catch (error) {
    res.status(400).send(error);
  }
};

const currencyListAdd = async (req, res) => {
  try {
    await currencyModule.currencyList.create([
      { countryName: "AED", currencySymbol: "د.إ" }, // United Arab Emirates Dirham
      { countryName: "AFN", currencySymbol: "؋" }, // Afghan Afghani
      { countryName: "ALL", currencySymbol: "L" }, // Albanian Lek
      { countryName: "AMD", currencySymbol: "֏" }, // Armenian Dram
      { countryName: "ANG", currencySymbol: "ƒ" }, // Netherlands Antillean Guilder
      { countryName: "AOA", currencySymbol: "Kz" }, // Angolan Kwanza
      { countryName: "AUD", currencySymbol: "A$" }, // Australian Dollar
      { countryName: "AWG", currencySymbol: "ƒ" }, // Aruban Florin
      { countryName: "AZN", currencySymbol: "₼" }, // Azerbaijani Manat
      { countryName: "BAM", currencySymbol: "KM" }, // Bosnia-Herzegovina Convertible Mark
      { countryName: "BBD", currencySymbol: "Bds$" }, // Barbadian Dollar
      { countryName: "BDT", currencySymbol: "৳" }, // Bangladeshi Taka
      { countryName: "BGN", currencySymbol: "лв" }, // Bulgarian Lev
      { countryName: "BHD", currencySymbol: ".د.ب" }, // Bahraini Dinar
      { countryName: "BIF", currencySymbol: "FBu" }, // Burundian Franc
      { countryName: "BND", currencySymbol: "B$" }, // Brunei Dollar
      { countryName: "BOB", currencySymbol: "Bs." }, // Bolivian Boliviano
      { countryName: "BOV", currencySymbol: "BOV" }, // Bolivian Mvdol
      { countryName: "BRL", currencySymbol: "R$" }, // Brazilian Real
      { countryName: "BSD", currencySymbol: "B$" }, // Bahamian Dollar
      { countryName: "BTN", currencySymbol: "Nu." }, // Bhutanese Ngultrum
      { countryName: "BWP", currencySymbol: "P" }, // Botswanan Pula
      { countryName: "BYN", currencySymbol: "Br" }, // Belarusian Ruble
      { countryName: "BZD", currencySymbol: "BZ$" }, // Belize Dollar
      { countryName: "CAD", currencySymbol: "C$" }, // Canadian Dollar
      { countryName: "CDF", currencySymbol: "FC" }, // Congolese Franc
      { countryName: "CHE", currencySymbol: "CHE" }, // WIR Euro
      { countryName: "CHF", currencySymbol: "CHF" }, // Swiss Franc
      { countryName: "CHW", currencySymbol: "CHW" }, // WIR Franc
      { countryName: "CLF", currencySymbol: "CLF" }, // Chilean Unit of Account (UF)
      { countryName: "CNY", currencySymbol: "¥" }, // Chinese Yuan
      { countryName: "COU", currencySymbol: "COU" }, // Colombian Real Value Unit
      { countryName: "CRC", currencySymbol: "₡" }, // Costa Rican Colón
      { countryName: "CUC", currencySymbol: "CUC$" }, // Cuban Convertible Peso
      { countryName: "CUP", currencySymbol: "₱" }, // Cuban Peso
      { countryName: "CVE", currencySymbol: "Esc" }, // Cape Verdean Escudo
      { countryName: "CZK", currencySymbol: "Kč" }, // Czech Koruna
      { countryName: "DJF", currencySymbol: "Fdj" }, // Djiboutian Franc
      { countryName: "DKK", currencySymbol: "kr" }, // Danish Krone
      { countryName: "DOP", currencySymbol: "RD$" }, // Dominican Peso
      { countryName: "DZD", currencySymbol: "د.ج" }, // Algerian Dinar
      { countryName: "EGP", currencySymbol: "£" }, // Egyptian Pound
      { countryName: "ERN", currencySymbol: "Nfk" }, // Eritrean Nakfa
      { countryName: "ETB", currencySymbol: "Br" }, // Ethiopian Birr
      { countryName: "EUR", currencySymbol: "€" }, // Euro
      { countryName: "FJD", currencySymbol: "FJ$" }, // Fijian Dollar
      { countryName: "FKP", currencySymbol: "£" }, // Falkland Islands Pound
      { countryName: "GBP", currencySymbol: "£" }, // British Pound
      { countryName: "GEL", currencySymbol: "₾" }, // Georgian Lari
      { countryName: "GHS", currencySymbol: "GH₵" }, // Ghanaian Cedi
      { countryName: "GIP", currencySymbol: "£" }, // Gibraltar Pound
      { countryName: "GMD", currencySymbol: "D" }, // Gambian Dalasi
      { countryName: "GNF", currencySymbol: "FG" }, // Guinean Franc
      { countryName: "GTQ", currencySymbol: "Q" }, // Guatemalan Quetzal
      { countryName: "GYD", currencySymbol: "GY$" }, // Guyanese Dollar
      { countryName: "HKD", currencySymbol: "HK$" }, // Hong Kong Dollar
      { countryName: "HNL", currencySymbol: "L" }, // Honduran Lempira
      { countryName: "HTG", currencySymbol: "G" }, // Haitian Gourde
      { countryName: "HUF", currencySymbol: "Ft" }, // Hungarian Forint
      { countryName: "IDR", currencySymbol: "Rp" }, // Indonesian Rupiah
      { countryName: "ILS", currencySymbol: "₪" }, // Israeli New Shekel
      { countryName: "INR", currencySymbol: "₹" }, // Indian Rupee
      { countryName: "IQD", currencySymbol: "ع.د" }, // Iraqi Dinar
      { countryName: "IRR", currencySymbol: "﷼" }, // Iranian Rial
      { countryName: "ISK", currencySymbol: "kr" }, // Icelandic Króna
      { countryName: "JMD", currencySymbol: "J$" }, // Jamaican Dollar
      { countryName: "JOD", currencySymbol: "د.ا" }, // Jordanian Dinar
      { countryName: "JPY", currencySymbol: "¥" }, // Japanese Yen
      { countryName: "KES", currencySymbol: "KSh" }, // Kenyan Shilling
      { countryName: "KGS", currencySymbol: "лв" }, // Kyrgyzstani Som
      { countryName: "KHR", currencySymbol: "៛" }, // Cambodian Riel
      { countryName: "KMF", currencySymbol: "CF" }, // Comorian Franc
      { countryName: "KPW", currencySymbol: "₩" }, // North Korean Won
      { countryName: "KRW", currencySymbol: "₩" }, // South Korean Won
      { countryName: "KWD", currencySymbol: "د.ك" }, // Kuwaiti Dinar
      { countryName: "KYD", currencySymbol: "CI$" }, // Cayman Islands Dollar
      { countryName: "KZT", currencySymbol: "₸" }, // Kazakhstani Tenge
      { countryName: "LAK", currencySymbol: "₭" }, // Lao Kip
      { countryName: "LBP", currencySymbol: "ل.ل" }, // Lebanese Pound
      { countryName: "LKR", currencySymbol: "Rs" }, // Sri Lankan Rupee
      { countryName: "LRD", currencySymbol: "L$" }, // Liberian Dollar
      { countryName: "LSL", currencySymbol: "M" }, // Lesotho Loti
      { countryName: "LYD", currencySymbol: "ل.د" }, // Libyan Dinar
      { countryName: "MAD", currencySymbol: "د.م." }, // Moroccan Dirham
      { countryName: "MDL", currencySymbol: "L" }, // Moldovan Leu
      { countryName: "MGA", currencySymbol: "Ar" }, // Malagasy Ariary
      { countryName: "MKD", currencySymbol: "ден" }, // Macedonian Denar
      { countryName: "MMK", currencySymbol: "K" }, // Myanmar Kyat
      { countryName: "MNT", currencySymbol: "₮" }, // Mongolian Tögrög
      { countryName: "MOP", currencySymbol: "MOP$" }, // Macanese Pataca
      { countryName: "MRU", currencySymbol: "UM" }, // Mauritanian Ouguiya
      { countryName: "MUR", currencySymbol: "₨" }, // Mauritian Rupee
      { countryName: "USD", currencySymbol: "$" }, // Mauritian Rupee
    ]);

    res.status(200).json({ msg: "Create User SuccessFully", status: "200" });
  } catch (error) {
    res.status(400).send("Not Found");
  }
};

const UserInvoice = async (req, res) => {
  try {
    var { email } = await req.body;

    const data = await invoiceModule.Invoice.find({ email })
      .sort({ invoiceNo: -1 })
      .exec();

    res.json({ msg: data, status: 200 });
  } catch (error) {
    res.status(400).send(error);
  }
};

const InvoiceDelete = async (req, res) => {
  try {
    const _id = await req.body.InvoiceId;
    await invoiceModule.Invoice.deleteOne({ _id });
    res.status(200).json({ status: 200, msg: "Invoice Deleted" });
  } catch (error) {
    res.status(400).send(error);
  }
};
module.exports = {
  Home,
  Register,
  RegisterOtp,
  ForgetPw,
  Login,
  NewPw,
  FindUser,
  EditProfile,
  CurrencyData,
  InvoiceNumber,
  currencyListAdd,
  UserInvoice,
  InvoiceDelete,
};
