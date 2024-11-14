const Message = require("../model/message");


const getAllChatMessage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const receiverId = req.params.receiverId;
        const allMessagesOfTheUser = await Message.find({$and:[{sender:userId}, {receiver:receiverId}]}).sort({receiverId:-1}).select('_id content createdAt')
        console.log(allMessagesOfTheUser);
        res.status(200).json({message:"all messages fetched successfully", data:allMessagesOfTheUser})
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat message', error });
    }
}
module.exports = {
    getAllChatMessage
}