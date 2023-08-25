const Joi = require("joi");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[0-9]{5}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
  isGold: {
    required: true,
    type: Boolean,
    default: false,
  },
});

const Customer = new mongoose.model("Customer", customerSchema);

async function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(5).max(5).required(),
    isGold: Joi.boolean(),
  });

  try {
    return await schema.validateAsync(customer);
  } catch (error) {
    throw error;
  }
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
