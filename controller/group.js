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

    res.status(200).json({
      message: "All members are marked as Admin",
      data: haveYouAccessToMakeOtherAdmin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in creating Admin", error });
  }
};

const removeUserAsAdmin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { groupId, memberId } = req.body;

    const haveYouAccessToMakeOtherAdmin = await Group.findOne({
      _id: groupId,
      admin: userId,
    });

    if (!haveYouAccessToMakeOtherAdmin) {
      return res.status(400).json({
        message: "You are not admin, Only admin can make other user admin",
      });
    }
    haveYouAccessToMakeOtherAdmin.admin =
      haveYouAccessToMakeOtherAdmin.admin.filter.filter(
        (item) => item !== memberId
      );
    await haveYouAccessToMakeOtherAdmin.save();

    res.status(200).json({
      message: "member removed removed from admin",
      data: haveYouAccessToMakeOtherAdmin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in creating Admin", error });
  }
};

const addMemberToTheGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    // we allow admin to add multiple users to the group
    const { groupId, members } = req.body;

    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      return res.status(400).json({
        message: "Group doesn't exists!",
      });
    }
    if (!group.admin.includes(userId)) {
      return res.status(400).json({
        message:
          "You are not admin, Only admin can add other members to the group",
      });
    }
    members.forEach((memberId) => {
      if (!group.admin.includes(memberId)) {
        group.admin.push(memberId);
      }
    });
    await group.save();

    res.status(200).json({
      message: "member removed removed from admin",
      data: group,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in creating Admin", error });
  }
};

const removeMemberFromTheGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    // we allow admin to add multiple users to the group
    const { groupId, memberId } = req.body;

    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      return res.status(400).json({
        message: "Group doesn't exists!",
      });
    }
    if (!group.admin.includes(userId)) {
      return res.status(400).json({
        message:
          "You are not admin, Only admin can add other members to the group",
      });
    }
    group.admin = group.admin.forEach((id) => id !== memberId);
    await group.save();

    res.status(200).json({
      message: "member removed from the group",
      data: group,
    });

  } catch (error) {
    //console.log(error);
    return res.status(500).json({ message: "Error in creating Admin", error });
  }
};
const fetchAllGroupsJoinedByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
   
    const group = await Group.find({members:userId});

    res.status(200).json({
      message: "fetched all groups joined by the user",
      data: group,
    });

  } catch (error) {
    //console.log(error);
    return res.status(500).json({ message: "Error in fetching group", error });
  }
};


module.exports = {
  createGroup,
  MakeOtherUserAsAdmin,
  removeUserAsAdmin,
  addMemberToTheGroup,
  removeMemberFromTheGroup,
  fetchAllGroupsJoinedByUser
};
