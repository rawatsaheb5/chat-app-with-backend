const Group = require("../model/group");

const createGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupName, members } = req.body;
    if (!groupName) {
      return res.status(400).json({ message: "groupName is required!" });
    }
    const newGroup = new Group({
      groupName,
      createdBy: userId,
      admin: userId,
      members,
    });
    await newGroup.save();
    res
      .status(200)
      .json({ message: "Group is created successfully", data: newGroup });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in creating error", error });
  }
};

module.exports = {
    createGroup,
}