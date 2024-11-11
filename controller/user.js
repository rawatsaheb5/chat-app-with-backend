const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const signup = async (req, res) => {
  try {
    
    const {name, email, password, gender } = req.body;

    // Check if the user with the given email or username already exists
    const existingUser = await User.findOne({ $or: [ { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ name, email, password: hashedPassword , gender});
    const savedUser = await newUser.save();

    // You may generate a JWT token here and send it in the response for user authentication

    res.status(201).json({
      user: {
        name: savedUser.name,
        email: savedUser.email,
        gender:savedUser.gender
      },
      message: "sign up successful",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token

    const token = jwt.sign({ userId: user._id , email, gender:user.gender, name:user.name}, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }); // Replace 'your-secret-key' with a strong secret key
    res.status(200).send({
      message: "sign in successfully",
      name: user.name,
      email: user.email,
      gender: user.gender,
      _id: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  signup,
  signin,
};
