const express = require("express");
const router = express.Router();

// router.use(skipRoute("/login", authenticator));
router.use("/", require("../middlewares/authenticator"));

router.route("/artist").get(require("../controllers/artistController"));
router.route("/album").get(require("../controllers/albumController"));
router.route("/song").get(require("../controllers/songController"));

router.route("/search").get(require("../controllers/search"));
router
  .route("/search/artist")
  .get(require("../controllers/searchcontrollers/artistSearch"));

module.exports = router;
