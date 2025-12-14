const express = require("express");
const router = express.Router();
const Sweet = require("../models/Sweet");
const auth = require("../middleware/auth.middleware");


router.post("/", auth, async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    const sweet = new Sweet({ name, category, price, quantity });
    await sweet.save();

    res.status(201).json(sweet);
  } catch (error) {
    res.status(400).json({ message: "Failed to add sweet", error });
  }
});


router.get("/", auth, async (req, res) => {
  const sweets = await Sweet.find();
  res.json(sweets);
});


router.get("/search", auth, async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  const filter = {};

  if (name) filter.name = new RegExp(name, "i");
  if (category) filter.category = category;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sweets = await Sweet.find(filter);
  res.json(sweets);
});


router.put("/:id", auth, async (req, res) => {
  const sweet = await Sweet.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(sweet);
});

const admin = require("../middleware/admin.middleware");


router.delete("/:id", auth, admin, async (req, res) => {
  await Sweet.findByIdAndDelete(req.params.id);
  res.json({ message: "Sweet deleted successfully" });
});


router.post("/:id/purchase", auth, async (req, res) => {
  const sweet = await Sweet.findById(req.params.id);

  if (!sweet || sweet.quantity <= 0) {
    return res.status(400).json({ message: "Out of stock" });
  }

  sweet.quantity -= 1;
  await sweet.save();

  res.json(sweet);
});


router.post("/:id/restock", auth, admin, async (req, res) => {
  const { amount } = req.body;

  const sweet = await Sweet.findById(req.params.id);
  sweet.quantity += Number(amount);

  await sweet.save();
  res.json(sweet);
});

module.exports = router;
