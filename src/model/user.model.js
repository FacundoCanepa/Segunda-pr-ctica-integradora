import mongoose from "mongoose";
import bcrypt from 'bcrypt-nodejs';
import Cart from "./carts.model.js";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.pre('save', async function(next) {
  if (!this.cart) {
    try {
      const newCart = new Cart();
      await newCart.save();
      this.cart = newCart._id; 
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

const userModel = mongoose.model(usersCollection, userSchema);

export default userModel;
