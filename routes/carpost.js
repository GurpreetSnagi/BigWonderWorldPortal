const express = require("express");

const {
    postCarView, submitNewCar, submitCarSuccess, 
  myPostingsView
} = require("../controllers/carPostController");

const { protectRoute } = require("../auth/protect");

const router = express.Router();

//Dashboard
router.get("/create-car", protectRoute, postCarView);
router.post("/create-car", protectRoute, submitNewCar);
router.get("/create-car-success", protectRoute, submitCarSuccess);
//router.post("/login", loginUser);

router.get("/view-my-postings", protectRoute, myPostingsView);


module.exports = router;