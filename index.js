const express = require("express");
const app = express();
var fs = require("fs");
var path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require('express-session');
dotenv.config();
const passport = require("passport");
const { loginCheck } = require("./auth/passport");
 const Redis = require('ioredis');
const redisClient = new Redis(); 

const redis = require('redis');


loginCheck(passport);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mongo DB connection

mongoose.connect(
  "mongodb://127.0.0.1:27017/project",
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", function () {
  console.log("Connected to mongodb");
});

const client = redis.createClient({
  host: "redis-server",
  port: 6379,
  
});

client.on('error',function(error) {
  console.log("Error in connection",error);

});

client.on('connect',function(error) {
  console.log("Redis connection established");

});


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


app.set("view engine", "ejs");

//BodyParsing
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret:'oneboy',
    saveUninitialized: true,
    resave: true
  }));
  

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  return res.render('home', {error: ''});
});
app.get("/car-rent", (req, res) => {
  return res.render('carrental', {error: ''});
});
//Routes
app.use("/", require("./routes/login"));
app.use("/", require("./routes/jobpost"));
app.use("/", require("./routes/jobfind"));
app.use("/",require("./routes/hotelpost"))
app.use("/",require("./routes/carpost"))
//app.use("/",require("./routes/carrent"));

const PORT = process.env.PORT || 4111;

app.listen(PORT, console.log("Server has started at port " + PORT));
