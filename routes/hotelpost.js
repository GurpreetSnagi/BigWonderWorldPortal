const express = require("express");

const {
    postHotelView, submitNewHotel, submitHotelSuccess, 
  myPostingsView
} = require("../controllers/hotelPostController");

const { protectRoute } = require("../auth/protect");

const router = express.Router();

//Dashboard
router.get("/create-hotel", protectRoute, postHotelView);
router.post("/create-hotel", protectRoute, submitNewHotel);
router.get("/create-hotel-success", protectRoute, submitHotelSuccess);
//router.post("/login", loginUser);

router.get("/view-my-postings", protectRoute, myPostingsView);


module.exports = router;