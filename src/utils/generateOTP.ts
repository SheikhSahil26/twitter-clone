// const crypto = require('crypto');
import crypto from "crypto";

export const generateOTP = (length = 6)=> {
  // Generates a cryptographically strong random string of digits
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  return otp;
}

// console.log(generateOTP(6));