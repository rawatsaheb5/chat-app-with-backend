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
    addOnlyUserWhoAreInChats.push(userId);

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

/*
  => admin can make other group members as admin
  => 

*/
const MakeOtherUserAsAdmin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    const { members } = req.body;

    // check whether you are admin of the group
    const group = await Group.findOne({
      _id: groupId,
      admin: userId,
    });

    if (!group) {
      return res.status(400).json({
        message: "You are not admin, Only admin can make other user admin",
      });
    }

    // filter members that are part of group
    const filteredMembers = [];
    members.forEach((element) => {
      if (group.members.includes(element)) {
        filteredMembers.push(element);
      }
    });

    // mark members admin who are part of group
    filteredMembers.forEach((element) => {
      if (!group.admin.includes(element)) {
        group.admin.push(element);
      }
    });
    await group.save();

    res.status(200).json({
      message: "All members are marked as Admin",
      data: group,
    });
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ message: "Error in creating Admin", error });
  }
};

/*
  => admin can remove other group members from admin but can't remove to the creator of group
  => 

*/
const removeUserAsAdmin = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    const { memberId } = req.body;

    const group = await Group.findOne({
      _id: groupId,
      admin: userId,
    });

    if (!group) {
      return res.status(400).json({
        message: "You are not admin, Only admin can remove other members",
      });
    }
    
    // checking whether you are trying to remove creator of group
    if (group.createdBy.toString() === memberId) {
      return res.status(400).json({
        message: "You can't remove group creator from admin role",
      });
    }

    // removing from admin
    group.admin = group.admin.filter((id) => id.toString() !== memberId);
    await group.save();

    res.status(200).json({
      message: "member removed from admin",
      data: group,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in removing member from Admin", error });
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
    return res
      .status(500)
      .json({ message: "Error in adding members to the group", error });
  }
};

/*  
  => we allow only admin can remove other member from the group (only 1 member at a time)
  => admin can remove other admin also but not to the creater of the group

*/
const removeMemberFromTheGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    const { memberId } = req.body;

    const group = await Group.findById({ _id: groupId });
    if (!group) {
      return res.status(400).json({
        message: "Group doesn't exists!",
      });
    }

    // check whether the user is admin or not
    if (!group.admin.includes(userId)) {
      return res.status(400).json({
        message:
          "You are not admin, Only admin can remove other member from the group",
      });
    }

    if (group.createdBy.toString() === memberId) {
      return res.status(400).json({
        message: "You are not allowed to remove creator of the group",
      });
    }

    // removing member
    group.members = group.members.filter((id) => id.toString() !== memberId);
    // also remove from admin if any one
    group.admin = group.admin.filter((id) => id.toString() !== memberId);
    await group.save();

    res.status(200).json({
      message: "member removed from the group",
      data: group,
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ message: "Error in removing member from the group", error });
  }
};

/*  
  => anyone can exit from the group if he is part of it
  => if he is admin also remove from admin post

*/
const exitFromTheGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;

    const group = await Group.findById({ _id: groupId });
    if (!group) {
      return res.status(400).json({
        message: "Group doesn't exists!",
      });
    }
    // exiting from the group
    group.members = group.members.filter((id) => id.toString() !== userId);
    // also exiting from admin post
    group.admin = group.admin.filter((id) => id.toString() !== userId);
    await group.save();

    res.status(200).json({
      message: "exited from the group",
      data: group,
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ message: "Error in exiting from the group", error });
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

/*
  => Group can only be deleted by the creator of the group
  => when group will be deleted all message associated with the group also deleted (*todo)
*/

const deleteGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;

    const group = await Group.findById({ _id: groupId });
    if (!group) {
      return res.status(400).json({
        message: "Group doesn't exists!",
      });
    }

    // check you are authorize to delete the group
    if (!group.admin.includes(userId) && group.createdBy.toString() !== userId) {
      return res.status(400).json({
        message:
          "You are not admin, Only admin and creator can delete the group ",
      });
    }
    // to do => implement remove all group messages
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
    const groupId = req.params.groupId;
    let groupName = req.body.groupName.trim();

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

    group.groupName = groupName;
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
  exitFromTheGroup,
};
