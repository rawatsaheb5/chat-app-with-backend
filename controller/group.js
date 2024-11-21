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

const MakeOtherUserAsAdmin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { members, groupId } = req.body;

    const haveYouAccessToMakeOtherAdmin = await Group.findOne({
      _id: groupId,
      admin: userId,
    });

    if (!haveYouAccessToMakeOtherAdmin) {
      return res.status(400).json({
        message: "You are not admin, Only admin can make other user admin",
      });
    }
    members.forEach((element) => {
      if (!haveYouAccessToMakeOtherAdmin.admin.includes(element)) {
        haveYouAccessToMakeOtherAdmin.admin.push(element);
      }
    });
    await haveYouAccessToMakeOtherAdmin.save();

    res
      .status(200)
      .json({
        message: "All members are marked as Admin",
        data: haveYouAccessToMakeOtherAdmin,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in creating Admin", error });
  }
};

module.exports = {
    createGroup,
    MakeOtherUserAsAdmin,
};