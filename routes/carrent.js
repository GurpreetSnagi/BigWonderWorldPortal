const express = require("express");
const multer = require('multer');

const {
    showcars
  } = require("../controllers/carrentcontroller");
  

  

const router = express.Router();

//Dashboard
router.get("/car-rent", showcars);

module.exports = router