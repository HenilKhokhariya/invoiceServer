const generateOTP =(length)=> {
    // All possible characters of my OTP
    let str = "123456789";
    let n = str.length;
  
    // String to hold my OTP
    let OTP = "";
  
    for (var i = 1; i <= length; i++)
      OTP += str[Math.floor(Math.random() * 10) % n];
  
    return OTP;
  }

  module.exports = {generateOTP};