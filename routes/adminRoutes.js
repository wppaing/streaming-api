const express = require("express");
const router = express.Router();
const multer = require("multer");

// router.use("/", require("../middlewares/authenticator"));
// router.use("/", require("../middlewares/adminAuth"));
router
  .route("/upload-artist")
  .post(
    multer().single("image"),
    require("../controllers/admin/artistUploader")
  );
router
  .route("/create-album")
  .post(multer().single("image"), require("../controllers/admin/createAlbum"));
router
  .route("/upload-song")
  .post(multer().single("song"), require("../controllers/admin/songUploader"));

module.exports = router;
