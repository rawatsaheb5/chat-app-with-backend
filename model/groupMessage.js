const mongoose = require("mongoose");

const groupMessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required:true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required:true
    }
}, { timestamps: true })

const GroupMessage = mongoose.model('Groupmessage', messageSchema);
module.exports = GroupMessage;