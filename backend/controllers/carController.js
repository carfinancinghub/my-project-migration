// File: carController.js
// Path: backend/controllers/carController.js

const Car = require('../../server/models/Car');

// Get all cars (admin or seller)
exports.getAllCars = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { sellerId: req.user._id };
    const cars = await Car.find(query);
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

// Get car by ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

// Add a new car (seller only)
exports.createCar = async (req, res) => {
  try {
    const { make, model, year, price, customMake, customModel } = req.body;
    const newCar = new Car({
      make,
      model,
      year,
      price,
      customMake,
      customModel,
      sellerId: req.user._id,
      needsReview: true,
    });
    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create car' });
  }
};

// Update car (owner or admin)
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    if (req.user.role !== 'admin' && car.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    Object.assign(car, req.body);
    await car.save();
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update car' });
  }
};
