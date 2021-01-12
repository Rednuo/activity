const Buffer = require('buffer').Buffer;
const bytes = require('utf8-bytes');
const _crypto = require('crypto');
const conf = {
    'key': '+BNC7v+HXyt7bJlp',
    'iv': '581ec9051f4cb2e6'
}
const algorithm = 'aes-128-cbc'
// 输入编码
const inputEncoding = 'binary'
// 输出编码
const outputEncoding = 'utf8'

const gcm = {
    b : '4e894B20a07c80331d1AC8A7e1b6c140',
    s : '34Ba50f5a51Be0192B4a6Dbb0AC51c30',
    as : '5fA05147846fb1528af053B770292C03'
}
const randomBytes = function(len) {
  len = len || 12;
  let chars = 'ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
  let maxPos = chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return Buffer.from(str);
}
export const aesGcmEncrypt = function(plaintext, Secret, Check) {
    const iv = randomBytes(12);//_crypto.randomBytes(12);
    const cipher = _crypto.createCipheriv('aes-256-gcm', new Buffer(Secret, 'utf8'), iv);
    cipher.setAAD(new Buffer(Check));

    const enc = cipher.update(plaintext, 'utf8');
    cipher.final();
    return Buffer.concat([iv, enc, cipher.getAuthTag()]).toString('hex');
};

export const aesGcmDecrypt = function(plaintext, Secret=`${gcm.as}`, Check=`${gcm.b}`) {

    const text = Buffer.from(plaintext, 'base64');
    const iv = text.slice(0, 12);
    const tag = text.slice(text.length - 16, text.length);

    const key = new Buffer(Secret, 'utf8');
    const decipher = _crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAAD(new Buffer(Check));
    decipher.setAuthTag(tag);

    let enc = decipher.update(text.slice(12, text.length - 16));
    enc += decipher.final('utf8');
    return enc;
};

export const getThirdToken = function(){
    return `${gcm.b}:${aesGcmEncrypt( JSON.stringify( {time:new Date().getTime()} ), gcm.s, gcm.b)}`;
}

export const decipher = function(ciphertext) {
  let decip = _crypto.createDecipheriv(algorithm, conf.key, conf.iv)
  return decip.update(ciphertext, outputEncoding, inputEncoding) + decip.final(inputEncoding)
}

export const encrypt = function(data) {
  let cipher = _crypto.createCipheriv(algorithm, conf.key, conf.iv)
  let crypted = cipher.update(data, outputEncoding, inputEncoding)
  crypted += cipher.final(inputEncoding)
  crypted = new Buffer(crypted, inputEncoding).toString('base64')
  return crypted
}

export const aesXorEncrypt = function(data, xorStr) {
  let aesStr = encrypt(data)
  let xorData = Buffer.from(aesStr, 'base64')
  let arr = xorFun(xorData, xorStr)
  let encStr = Buffer.from(arr)
  return encStr.toString('base64')
}

export const aesXorDecrypt = function(data, xorStr) {
  try {
      let xorData = Buffer.from(data, 'base64')
      let arr = xorFun(xorData, xorStr)
      let ciphertext = Buffer.from(arr)
      let decStr = decipher(ciphertext)
      return decStr
  } catch (err) {
      throw new Error('SIGNERRO')
  }
}

function xorFun(data, xorStr) {
  let arr = Array.prototype.slice.call(data, 0)
  let d = bytes(xorStr)
  let xor = arr[0] ^ d[0]
  arr[0] = xor
  return arr
}

export const des3Cipher = function(data, key) {
  const iv = key.substr(0, 8)
  let cipher = _crypto.createCipheriv('des-ede3-cbc', key, iv)
  cipher.setAutoPadding(true)
  let ciph = cipher.update(data, 'utf8', 'base64')
  ciph += cipher.final('base64')
  return ciph
}

export const des3Decipher = function(data, key) {
  const iv = key.substr(0, 8)
  let decipher = _crypto.createDecipheriv('des-ede3-cbc', key, iv)
  decipher.setAutoPadding(true)
  let text = decipher.update(data, 'base64', 'utf8')
  text += decipher.final('utf8')
  return text
}

export const hmacSHA256 = function(data, appKey) {
  let sha256 = _crypto.createHmac('sha256', appKey)
  return sha256.update(data).digest('hex')
}

export const md5Hex = function(str, toLower = false) {
  let text = _crypto.createHash('md5').update(str).digest('hex')
  if (toLower) {
      return text.toLowerCase()
  }
  return text
}

export const desDecode = function(base64Str, key, iv, algorithm = 'des-cbc', encode = 'utf8') {
  let decipher = _crypto.createDecipheriv(algorithm, key, iv)
  decipher.setAutoPadding(true)
  let text = decipher.update(base64Str, 'base64', encode)
  text += decipher.final(encode)
  return text
}

export const aesDecode = function(base64Str, key, iv, algorithm = 'aes-256-ecb', encode = 'utf8') {
  let decipher = _crypto.createDecipheriv(algorithm, key, iv)
  decipher.setAutoPadding(true)
  let text = decipher.update(base64Str, 'base64', encode)
  text += decipher.final(encode)
  return text
}

export const decodeBase64 = function(str) {
  return Buffer.from(str, 'base64').toString()
}

export const encodeBase64 = function(str) {
  return Buffer.from(str).toString('base64')
}