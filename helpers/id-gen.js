const { customAlphabet } = require("nanoid");
const idAlphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz=";
const fileNameAlphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const getId = (length) => {
  const nanoid = customAlphabet(idAlphabet, length);
  return nanoid;
};

const getFileId = (length) => {
  const nanoid = customAlphabet(fileNameAlphabet, length);
  return nanoid;
};

module.exports = { getId, getFileId };
