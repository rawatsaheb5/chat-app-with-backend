const mongoose = require("mongoose");
const { trimBothSideSpaces } = require("../helper/transform");
const Group = require("../model/group");
const User = require("../model/user");

/*
  => a user can create a group with group name and array of members
  => only those members will be added to the group who are in chats of user

*/
const createGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    let groupName = req.body.groupName.trim();
    const members = req.body.members;

    if (!groupName) {
      return res.status(400).json({ message: "groupName is required!" });
    }

    const userInfo = await User.findById({ _id: userId });

    // filtering members who are in chats of user
    const addOnlyUserWhoAreInChats = userInfo.chats.filter((id) =>
      members.includes(id.toString())
    );

    const newGroup = new Group({
      groupName,
      createdBy: userId,
      admin: userId,
      members: addOnlyUserWhoAreInChats,
    });
    await newGroup.save();

    res
      .status(201)
      .json({ message: "Group is created successfully", data: newGroup });
  } catch (error) {
    //console.log(error);
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

/*

  => we allow only admin can add members to the group
  => to add in group , we require groupId and , array of 1 or more members

*/
const addMemberToTheGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    const { members } = req.body;

    if (members.length === 0) {
      return res.status(400).json({
        message: "one or more members are required to add in group!",
      });
    }
    const group = await Group.findById({ _id: groupId });
    if (!group) {
      return res.status(400).json({
        message: "Group doesn't exists!",
      });
    }

    // checking for whether user is admin or not
    if (!group.admin.includes(userId)) {
      return res.status(400).json({
        message:
          "You are not admin, Only admin can add other members to the group",
      });
    }

    // removing dublicate members from the group
    members.forEach((memberId) => {
      if (!group.members.includes(memberId)) {
        group.members.push(memberId);
      }
    });
    await group.save();

    res.status(200).json({
      message: "members added to the group",
      data: group,
    });
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ message: "Error in adding members to the group", error });
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

    const group = await Group.find({ members: userId });

    res.status(200).json({
      message: "fetched all groups joined by the user",
      data: group,
    });
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ message: "Error in fetching group", error });
  }
};

// Group can only be deleted by the creator of the group
const deleteGroup = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { groupId } = req.body;

    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      return res.status(400).json({
        message: "Group doesn't exists!",
      });
    }
    if (!group.admin.includes(userId) && group.createdBy !== userId) {
      return res.status(400).json({
        message:
          "You are not admin, Only admin and creator can delete the group ",
      });
    }

    await Group.findByIdAndDelete({ _id: groupId });

    res.status(200).json({
      message: "Group deleted",
    });
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ message: "Error in deleting Group", error });
  }
};

// edit group (only group name changes) everyone can change group name
const editGroupName = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { groupId, groupName } = req.body;
    if (!groupName) {
      return res.status(400).json({
        message: "Group name is required!",
      });
    }
    const group = await Group.findById({ _id: groupId });
    if (!group) {
      return res.status(400).json({
        message: "Group doesn't exists!",
      });
    }

    group.groupName = content;
    await group.save();
    res.status(200).json({
      message: "Group name is updated",
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ message: "Error in editing Group name", error });
  }
};

module.exports = {
  createGroup,
  MakeOtherUserAsAdmin,
  removeUserAsAdmin,
  addMemberToTheGroup,
  removeMemberFromTheGroup,
  fetchAllGroupsJoinedByUser,
  deleteGroup,
  editGroupName,
};
