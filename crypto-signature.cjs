// You need crypto-js: https://cdnjs.com/libraries/crypto-js
const CryptoJS = require("crypto-js");

// --- CONFIG ---
const httpMethod = "POST";
const apiPath = "/openapi/order/v1/batch-get";
const secretKey = "63ac8ee2aa8a325b";

// Build signature string
const signatureHeaderInfo = `${httpMethod}$${apiPath}$`;

// --- PBEWithMD5AndDES key derivation (approx) ---
function pbeWithMD5AndDESKey(secret) {
  const salt = CryptoJS.enc.Utf8.parse("12345678"); // Example fixed salt
  const key = CryptoJS.PBKDF2(secret, salt, {
    keySize: 64 / 32,
    iterations: 1000,
    hasher: CryptoJS.algo.MD5
  });
  return key.toString(CryptoJS.enc.Hex);
}

const derivedKey = pbeWithMD5AndDESKey(secretKey);

// --- HMAC-SHA256 ---
const hash = CryptoJS.HmacSHA256(signatureHeaderInfo, derivedKey);
const signature = CryptoJS.enc.Base64.stringify(hash);

console.log("Authorization:", `509773d5883385f7:${signature}`);
