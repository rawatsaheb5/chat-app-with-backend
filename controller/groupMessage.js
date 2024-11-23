const Group = require("../model/group");
const GroupMessage = require("../model/groupMessage");

// delete single message of the group by using messageId
const deleteSingleMessageOfGroup = async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.messageId;
    const { groupId } = req.body;

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

// edit group message (only content) using messageId
const editGroupMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.messageId;
    const { content } = req.body;
    if (!content) {
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

    groupMessage.content = content;
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

module.exports = {
    deleteSingleMessageOfGroup,
    editGroupMessage,
};
