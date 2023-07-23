const { v4: uuidv4 } = require('uuid');
const Hotel = require("../models/Hotel");
const Application = require("../models/Application");
const Redis = require("ioredis");
const redisClient = new Redis(); 

const postHotelView = (req, res) => {

    res.render("postHotel", {
      user: req.user
    });
  };
  
  // Handle form submission

  const submitNewHotel =  async (req, res) => {
    const { title, city, description, country, type, price } = req.body;
  
    // if (!name || !email || !password || !confirm) {
    //   return res.render('register', {error: 'Please enter all fields.'});
    // }
    const hotel = new Hotel({
        id: uuidv4(),
        title: title,
        city: city,
        description: description,
        country: country,
        type: type,
        price: price,
        creatorName: req.user.name,
        creatorEmail: req.user.email
      });
    
      try {
        const hotelData = JSON.stringify(hotel);
        await redisClient.setex(hotel.id, 3600, hotelData);
        console.log("Hotel data saved in Redis");
        await hotel.save();
        console.log("Hotel saved");
        res.redirect('/create-hotel-success');
      } catch (error) {
        res.status(500).send(error);
      }
  };

  const submitHotelSuccess = (req, res) => {

    res.render("jobPostSuccess", {
        message: "Hotel is posted successfully",
        user: req.user
    });
  };

  // caching technique
async function getDataFromDatabase(id) {
  // Simulating a database query with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `Data for ID ${id}`;
}

async function getDataWithCaching(id) {
  const cacheKey = `data:${id}`;
  const cachedData = await redisClient.get(cacheKey);

  if (cachedData) {
    // Data found in cache, return it
    return cachedData;
  } else {
    // Data not found in cache, fetch from database
    const data = await getDataFromDatabase(id);
    // Store the data in Redis cache with an expiration (e.g., 1 hour)
    await redisClient.setex(cacheKey, 3600, data);
    return data;
  }
}

  const myPostingsView = async (req, res) => {
    try {
        const email = req.user.email;
        const hotelPostings =  await Hotel.find({ creatorEmail: email });
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
    postHotelView,
    submitNewHotel,
    submitHotelSuccess,
    myPostingsView
  };
  