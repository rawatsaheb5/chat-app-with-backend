const Group = require("../model/group");
const GroupMessage = require("../model/groupMessage");

/*
  => createGroupMessage controller will take userId, groupId, content to create group message

*/
const createGroupMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;
    let { content } = req.body;

    if (!groupId) {
      return res.status(400).json({ message: "groupId is required!" });
    }
    if (!content.trim()) {
      return res.status(400).json({ message: "content is required!" });
    }

    const groupMessage = new GroupMessage({
      content: content.trim(),
      sender: userId,
      groupId: groupId,
    });

    await groupMessage.save();

    res.status(201).json({
      message: "Group message created successfully!",
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ message: "Error in creating Group message", error });
  }
};


/*
  => delete single message of the group by using messageId

*/

const deleteSingleMessageOfGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.messageId;
   
    const groupMessage = await GroupMessage.findById({ _id: messageId });
    if (!groupMessage) {
      return res.status(400).json({
        message: "Group message doesn't exists with this message id",
      });
    }

    await GroupMessage.findByIdAndDelete({ _id: messageId });

    res.status(200).json({
      message: "Group message deleted successfully!",
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ message: "Error in deleting Group message", error });
  }
};

/*  
  => edit group message (only content) using messageId

*/ 

const editGroupMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.messageId;
    let { content } = req.body;

    if (!content.trim()) {
      return res.status(400).json({
        message: "content is required!",
      });
    }
    const groupMessage = await GroupMessage.findById({ _id: messageId });
    if (!groupMessage) {
      return res.status(400).json({
        message: "Group message doesn't exists with this message id",
      });
    }

    groupMessage.content = content.trim();
    await groupMessage.save();
    res.status(200).json({
      message: "Group message edited successfully!",
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ message: "Error in editing Group message", error });
  }
};

// fetch all group messages using groupId
// to do later => pagination, query optimization
const fetchAllGroupMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const groupId = req.params.groupId;

    const allGroupMessages = await GroupMessage.find({ groupId: groupId });

    res.status(200).json({
      message: "Group message fetched successfully!",
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ message: "Error in fetching all Group messages", error });
  }
};
module.exports = {
  deleteSingleMessageOfGroup,
  editGroupMessage,
  fetchAllGroupMessages,
  createGroupMessage
};
