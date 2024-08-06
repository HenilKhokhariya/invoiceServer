const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotallySecretKey");
const sendRmail = require("./Email/registrationOtp");
const sendForgetOtpmail = require("./Email/ForgetOtp");
const userModule = require("./module/user");
const jwt = require("jsonwebtoken");
const jwt_key = process.env.jwt_key;
const jwt_header = process.env.jwt_header;

function generateOTP(length) {
  // All possible characters of my OTP
  let str = "123456789";
  let n = str.length;

  // String to hold my OTP
  let OTP = "";

  for (var i = 1; i <= length; i++)
    OTP += str[Math.floor(Math.random() * 10) % n];

  return OTP;
}

const RegisterOtp = async (req, res) => {
  try {
    const { email, fname, lname, password, aggre } = await req.body;
    const otp = generateOTP(6);
    const user = fname + " " + lname;
    const playload = {
      email,
      fname,
      lname,
      password,
      otp,
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
    if (compare) {
      const date_time = new Date().toString().substring(0, 25);
      const email = data.email;
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

      res
        .status(200)
        .json({ status: true, message: "User SuccessFully Login", token });
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
    var { email, password } = await req.body;
    const date_time = new Date().toString().substring(0, 25);

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
          .json({ status: true, message: "User SuccessFully Login", token });
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
      return res.status(200).json({ message: "Success", status: true });
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

module.exports = {
  RegisterOtp,
  Register,
  Login,
  ForgetOtp,
  ForgetPw,
  NewPw,
  Checktoken,
  ResendOtp,
};
