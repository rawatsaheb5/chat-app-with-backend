const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const signup = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    // Check if the user with the given email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ name, email, password: hashedPassword, gender });
    const savedUser = await newUser.save();

    // You may generate a JWT token here and send it in the response for user authentication

    res.status(201).json({
      user: {
        name: savedUser.name,
        email: savedUser.email,
        gender: savedUser.gender,
        
      },
      message: "sign up successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token

    const token = jwt.sign(
      { userId: user._id, email, gender: user.gender, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    ); // Replace 'your-secret-key' with a strong secret key
    res.status(200).send({
      message: "sign in successfully",
      name: user.name,
      email: user.email,
      gender: user.gender,
      profileImage:user?.profileImage,
      _id: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//
const addUserToChat = async (req, res) => {
  try {
    // userId => id of the user
    // emailToAdd => email id of the person you want to add
    const userId = req.user.userId;
    const { emailToAdd } = req.body;

    const existingUser = await User.findOne({ email:emailToAdd });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "The user you want to add doesnot exists" });
    }
    const user = await User.findById(userId);
    if (user.chats.includes(existingUser._id)) {
      return res.status(400).json({message:"User already in your chat"})
    }
    user.chats.push(existingUser._id)
    
    await user.save();
    res.status(200).json({ message: "User added to chat successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMessageChats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const allChats = await User.findById(userId);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the user and populate the chats array with only the name and _id of each chat user
    const user = await User.findById(userId)
      .populate('chats', 'name _id') // populate only name and _id fields of the referenced users
      .select('chats'); // select only the chats field from the main user document
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({message:"all users received ", data:user.chats});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error });
  }
};

module.exports = {
  signup,
  signin,
  addUserToChat,
  getUserChats,
};
