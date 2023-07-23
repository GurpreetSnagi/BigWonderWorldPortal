const mongoose = require("mongoose");

// Define a schema for job postings
const carSchema = new mongoose.Schema({

    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    make: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: String, required: false },
    creatorName: { type: String, required: true },
    creatorEmail: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });

const Car = mongoose.model('Car', carSchema);
module.exports = Car;
