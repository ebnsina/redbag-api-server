const formidableMiddleware = require("express-formidable");

const fileUploadMiddleware = formidableMiddleware({
  maxFileSize: 5 * 1024 * 1024,
});

module.exports = fileUploadMiddleware;
