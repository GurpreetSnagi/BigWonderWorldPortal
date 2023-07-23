const { v4: uuidv4 } = require('uuid');
const Car = require("../models/Car");
const Application = require("../models/Application");
const Redis = require("ioredis");
const redisClient = new Redis(); 

const postCarView = (req, res) => {

    res.render("postCar", {
      user: req.user
    });
  };
  
  // Handle form submission

  const submitNewCar =  async (req, res) => {
    console.log(req.body);
    const { title, city, type,  price } = req.body;
  
  
    const car = new Car({
        id: uuidv4(),
        name: title,
        make: city,
        type: type,
        price: price,
        creatorName: req.user.name,
        creatorEmail: req.user.email
      });
    
      try {
        const carData = JSON.stringify(car);
        await redisClient.setex(car.id, 3600, carData);
        console.log("Hotel data saved in Redis");
        await car.save();
        console.log(car);
        console.log("Car saved");
        res.redirect('/create-car-success');
      } catch (error) {
        res.status(500).send(error);
      }
  };

  const submitCarSuccess = (req, res) => {

    res.render("jobPostSuccess", {
        message: "Car is posted successfully",
        user: req.user
    });
  };

  const myPostingsView = async (req, res) => {
    try {
        const email = req.user.email;
        const hotelPostings =  await Car.find({ creatorEmail: email });
        res.render("viewMyPostings", {
            jobPostings: hotelPostings,
            user: req.user
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    
  };

  

  
  module.exports = {
    postCarView,
    submitNewCar,
    submitCarSuccess,
    myPostingsView
  };
  