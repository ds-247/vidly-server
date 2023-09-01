const express = require("express");
const router = express.Router();
const {
  Customer,
  validateCustomer,
  validateCustomerId,
} = require("../models/customer");

router.get("/", async (req, res) => {
  const allCustomers = await Customer.find().sort("name").select("name phone");
  res.status(200).send(allCustomers);
});

router.get("/:id", async (req, res) => {
  const error = await validateCustomerId(req.params.id);
  if (error) return res.status(400).send(err.details[0].message);

  const customer = await Customer.find({ _id: req.params.id });
  if (!customer) res.status(400).send("Customer doesn't existed...");

  res.status(200).send(customer);
});

router.post("/", async (req, res) => {
  const error = await validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newCustomer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  const result = await newCustomer.save();
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const err = await validateCustomerId(req.params.id);
  if (err) return res.status(400).send(err.details[0].message);

  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  const error = await validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isGoldValue =
    req.body.isGold !== undefined ? req.body.isGold : customer.isGold;

  customer.set({
    name: req.body.name,
    phone: req.body.phone,
    isGold: isGoldValue,
  });

  await customer.save();

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const error = await validateCustomerId(req.params.id);
  if (error) return res.status(400).send(err.details[0].message);

  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.status(200).send(customer);
});

module.exports = router;
