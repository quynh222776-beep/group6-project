const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");

// Route upload avatar
router.post("/avatar", uploadController.uploadAvatar);

module.exports = router;
