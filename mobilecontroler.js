const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");
const sendRmail = require("./Email/registrationOtp");
const sendForgetOtpmail = require("./Email/ForgetOtp");
const userModule = require("./module/user");
const jwt = require("jsonwebtoken");
const jwt_key = process.env.jwt_key;
const currencyModule = require('./module/currencyList');
// const jwt_header = process.env.jwt_header;
const getOtp = require('./geterateOtp');
const { InvoiceMobile } = require("./module/invoiceMobile");


const RegisterOtp = async (req, res) => {
  try {
    const { email, fname, lname, password,date,time,aggre } = await req.body;
    const otp = getOtp.generateOTP(6);
    const user = fname + " " + lname;
    const playload = {
      email,
      fname,
      lname,
      password,
      otp,
      date,time
    };
    if (aggre) {
      const userExist = await userModule.User.findOne({ email });
      if (userExist) {
        res.json({ status: false, message: "User Already Exist" });
        return;
      }
      sendRmail.main(email, otp, user);
      const token = jwt.sign(playload, jwt_key, {
        expiresIn: "5m",
      });

      res
        .status(200)
        .json({ message: "Otp Send SuccessFully", status: true, token });
    } else {
      res.status(400).json({ message: "Select Checkbox" });
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Internet server Error" });
  }
};

const ResendOtp = async (req, res) => {
  try {
    const { token } = await req.body;
    jwt.verify(token, jwt_key);
    const data = jwt.decode(token, jwt_key);
    const email = data.email;
    const fname = data.fname;
    const lname = data.lname;
    const password = data.password;
    const date = data.date;
    const time = data.time;
    
    const userExist = await userModule.User.findOne({ email });
    if (userExist) {
      res.json({ status: false, message: "User Already Exist" });
      return;
    }
    const otp = generateOTP(6);
    const playload = {
      email,
      fname,
      lname,
      password,
      otp,
      date,
      time
    };
    const user = fname + " " + lname;
    sendRmail.main(email, otp, user);
    const newtoken = jwt.sign(playload, jwt_key, {
      expiresIn: "5m",
    });

    res.status(200).json({
      message: "Otp Send SuccessFully",
      status: true,
      token: newtoken,
    });
  } catch (error) {
    res.status(400).json({ status: false, message: "Otp Expire" });
  }
};

const Register = async (req, res) => {
  try {
    var { otp, token } = await req.body;
    jwt.verify(token, jwt_key);
    const data = jwt.decode(token, jwt_key);
    const compare = data.otp == otp;
    const date = data.date;
    const time = data.time;
    const dt= date+"T"+time+"Z";
    if (compare) {
      const email = data.email;
      const date_time = new Date(dt).toISOString();
      const password = cryptr.encrypt(data.password);

      const userExist = await userModule.User.findOne({ email });
      if (userExist) {
        res.status(400).json({ message: "Email Already Exist", status: false });
        return;
      }
      await userModule.User.create({
        fname: data.fname,
        lname: data.lname,
        email,
        password,
        date_time,
      });
      const playload = {
        email,
      };

      const token = jwt.sign(playload, jwt_key, {
        expiresIn: "24h",
      });
      return res
        .status(200)
        .json({ status: true, message: "Create User SuccessFully", token });
    }
    return res.status(400).json({ message: "Enter Valid Otp", status: false });
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token", status: false });
  }
};

const Login = async (req, res) => {
  try {
    var { email, password,date,time } = await req.body;
    const dt = date+"T"+time+"Z";
    const date_time = new Date(dt).toISOString();
    // await userModule.UserLogin.deleteMany({});
    const userExist = await userModule.User.findOne({ email });
    if (userExist) {
      let passwordUser = cryptr.decrypt(userExist.password);

      if (password === passwordUser) {
        await userModule.UserLogin.create({ email, date_time });
        const playload = {
          email,
        };
        const token = jwt.sign(playload, jwt_key, {
          expiresIn: "24h",
        });
        res
          .status(200)
          .json({ status: true, message: "Login SuccessFully", token });
      } else {
        res
          .status(400)
          .json({ status: false, message: "Enter Valid Password" });
      }
    } else {
      res.json({
        status: false,
        message: "Enter Valid Email ID",
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: "Internet server Error" });
  }
};

const ForgetOtp = async (req, res) => {
  try {
    const { email } = await req.body;
    const otp = generateOTP(6);
    const userExist = await userModule.User.findOne({ email });
    if (userExist) {
      sendForgetOtpmail.main(email, otp);
      const playload = {
        email,
        otp,
      };
      const token = jwt.sign(playload, jwt_key, {
        expiresIn: "5m",
      });
      res
        .status(200)
        .json({ status: true, message: "Otp send successfully", token });

      return;
    }
    res.status(400).json({ status: false, message: "Email not exist" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "Internet server Error" });
  }
};

const ForgetPw = async (req, res) => {
  try {
    const { otp, token } = await req.body;
    jwt.verify(token, jwt_key);
    const data = jwt.decode(token, jwt_key);
    const compare = data.otp == otp;
    if (compare) {
      return res
        .status(200)
        .json({ message: "Otp Verify Successfully", status: true });
    }
    res.status(400).json({ status: false, message: "Enter Valid Otp" });
  } catch (error) {
    res.status(400).json({ status: false, message: "Otp Expire" });
  }
};

const NewPw = async (req, res) => {
  try {
    var { email, password } = await req.body;

    password = cryptr.encrypt(password);
    await userModule.User.updateOne({ email }, { $set: { password } });

    res
      .status(200)
      .json({ status: true, message: "Password Change SuccessFully" });
  } catch (error) {
    res.status(400).json({ status: false, message: "Otp Expire" });
  }
};

const Checktoken = async (req, res) => {
  try {
    var { token } = await req.body;

    jwt.verify(token, jwt_key);
    res.status(200).json({ status: true, message: "Token Valid" });
  } catch (error) {
    res.status(400).json({ status: false, message: "Token Invalid" });
  }
};

const Profile = async (req, res) => {
  try {
    const { token } = await req.body;
    jwt.verify(token, jwt_key);
    const tokenInfo = jwt.decode(token, jwt_key);
    const email = tokenInfo.email;
    const user = await userModule.User.findOne({ email }).select(
      "fname lname email -_id"
    );
    
    if (user) {
      return res
        .status(200)
        .json({ status: true, message: "User Is Exist", data: user });
    }
    return res.status(400).json({ status: false, message: "User Not Exist" });
  } catch (error) {
    return res.status(400).json({ status: false, message: "Token Invalid" });
  }
};

const ProfileUpdate = async (req, res) => {
  try {
    const { token, fname, lname } = await req.body;
    jwt.verify(token, jwt_key);
    const tokenInfo = jwt.decode(token, jwt_key);
    const email = tokenInfo.email;
    const user = await userModule.User.findOne({ email });
    if (user) {
      await userModule.User.updateOne({ email }, { $set: { fname, lname } });

      return res.status(200).json({
        status: true,
        message: "Profile Update Successfully",
      });
    }
    return res.status(400).json({ status: false, message: "User Not Exist" });
  } catch (error) {
    return res.status(400).json({ status: false, message: "Token Invalid" });
  }
};

const InvoiceNumber = async (req, res) => {
  try {
    const { token } = await req.body;
    jwt.verify(token, jwt_key);
    const tokenInfo = jwt.decode(token, jwt_key);
    const email = tokenInfo.email;
    const data = await InvoiceMobile.findOne({ email })
      .sort({
        invoiceNo: -1,
      })
      .select("invoiceNo")
      .exec();
    if (data == null) {
      return res
        .status(200)
        .json({ status: true, message: "success !", invoiceNo: 1 });
    } else {
      let invoiceNo = parseInt(data.invoiceNo) + 1;
      return res
        .status(200)
        .json({ status: true, message: "success !", invoiceNo: invoiceNo });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: "Token Invalid" });
  }
};

const InvoiceCreate = async (req, res) => {
  try {
    const isFile = await JSON.parse( req.body.isFile);
    let filename="";
    if(!isFile){
      filename = "https://invoiceserver-nfyb.onrender.com/uploads/Image/Logo/logo.png";
    }else{
      const file = await req.file.filename;
      filename = "https://invoiceserver-nfyb.onrender.com/uploads/Image/Logo/" + file;
    }
    const formData = await JSON.parse(req.body.formData);
    const Items = await JSON.parse(req.body.Items);
    const token = await req.body.token;
    jwt.verify(token, jwt_key);
    const tokenInfo = jwt.decode(token, jwt_key);
    const email = tokenInfo.email;
    const dateI = new Date().toString().substring(0, 15);
    const timeI = new Date().toString().substring(16, 24);
    const z = new Date(formData.currentDate).toISOString();
      
    await InvoiceMobile.create({
      email,
      logo: filename,
      invoice: formData.invoice,
      invoiceNo: formData.invoiceNo,
      formTitle: formData.formTitle,
      billTo: formData.billTo,
      shipTo: formData.shipTo,
      createDate: formData.createDate,
      paymentTerms: formData.paymentTerms,
      dueDate: formData.dueDate,
      Phone: formData.Phone,
      Items,
      notes: formData.notes,
      terms: formData.terms,
      subTotal: formData.subTotal,
      discount: formData.discount,
      discountType: formData.discountType,
      tax: formData.tax,
      taxType: formData.taxType,
      shipping: formData.shipping,
      total: formData.total,
      paidAmount: formData.paidAmount,
      balanceDue: formData.balanceDue,
      currency: formData.currency,
      status: false,
      InvoiceName: dateI + " " + timeI,
      date_time: z,
      update_time:z
    });
    return res.status(200).json({
      status: true,
      message: "Create Invoice Successfully !",

    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "Internet server Error" });
  }
};

const UserInvoiceFind = async (req, res) => {
  try {
    const { token } = await req.body;
    jwt.verify(token, jwt_key);
    const tokenInfo = jwt.decode(token, jwt_key);
    const email = tokenInfo.email;
    const data = await InvoiceMobile.find({ email })
      .sort({
        invoiceNo: -1,
      })
      .select("invoiceNo logo createDate formTitle _id");
    if (data == null) {
      return res
        .status(200)
        .json({ status: true, message: "success !", data: "Empty" });
    } else {
      return res.status(200).json({ status: true, message: "success !", data });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: "Token Invalid" });
  }
};

const InvoiceID = async (req, res) => {
  try {
    const { _id } = await req.body;
    if (!_id) {
      return res
        .status(400)
        .json({ status: false, message: "Not Available !" });
    }
    const data = await InvoiceMobile.findOne({ _id });
    if (_id) {
      return res.status(200).json({ status: true, message: "success !", data });
    }
    return res.status(400).json({ status: false, message: "Not Available !" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: "Server Error" });
  }
};

const CurrencyData = async (req, res) => {
    try {
      const data = await currencyModule.currencyList.find({});
      res.json({ msg: data, status: 200 });
    } catch (error) {
      return res.status(400).json({ status: false, message: "Server Error" });
    }  
}

const InvoiceUpdate = async (req,res)=>{
  try {
    const isFile = await JSON.parse( req.body.isFile);
    let filename="";
    if(!isFile){
      filename = "https://invoiceserver-nfyb.onrender.com/uploads/Image/Logo/logo.png";
    }else{
      const file = await req.file.filename;
      filename = "https://invoiceserver-nfyb.onrender.com/uploads/Image/Logo/" + file;
    }
    const formData = await JSON.parse(req.body.formData);
    const _id = await JSON.parse(req.body._id);
    const Items = await JSON.parse(req.body.Items);
    const token = await req.body.token;
    jwt.verify(token, jwt_key);
    const tokenInfo = jwt.decode(token, jwt_key);
    const email = tokenInfo.email;
    
    const dt = formData.updateDate + "T" +formData.updateTime+"Z";
    const z = new Date(dt).toISOString();
      
    await InvoiceMobile.updateOne({_id},{$set:{
      email,
      logo: filename,
      invoice: formData.invoice,
      invoiceNo: formData.invoiceNo,
      formTitle: formData.formTitle,
      billTo: formData.billTo,
      shipTo: formData.shipTo,
      createDate: formData.createDate,
      paymentTerms: formData.paymentTerms,
      dueDate: formData.dueDate,
      Phone: formData.Phone,
      Items,
      notes: formData.notes,
      terms: formData.terms,
      subTotal: formData.subTotal,
      discount: formData.discount,
      discountType: formData.discountType,
      tax: formData.tax,
      taxType: formData.taxType,
      shipping: formData.shipping,
      total: formData.total,
      paidAmount: formData.paidAmount,
      balanceDue: formData.balanceDue,
      currency: formData.currency,
      update_time:z
    }});
    return res.status(200).json({
      status: true,
      message: "Create Invoice Successfully !",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ status: false, message: "Internet server Error" });
  }
}

const InvoiceDelete = async(req,res)=>{
  try {
    const {_id} = await req.body;
    if (_id) {
      await InvoiceMobile.deleteOne({_id});
      return res.status(200).json({ status: true, message: "Delete successfully !" });
    }
    return res.status(400).json({ status: false, message: "Not Available !" });
  } catch (error) {
    return res.status(400).json({ status: false, message: "Server Error" });
  } 
}

module.exports = {
  RegisterOtp,
  Register,
  Login,
  ForgetOtp,
  ForgetPw,
  NewPw,
  Checktoken,
  ResendOtp,
  Profile,
  ProfileUpdate,
  InvoiceNumber,
  InvoiceCreate,
  UserInvoiceFind,
  InvoiceID,
  CurrencyData,
  InvoiceUpdate,
  InvoiceDelete,
};
