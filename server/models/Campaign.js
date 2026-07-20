import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    subject: {
        type: String,
        required: true,
    },

    body: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["draft", "sending", "completed"],
        default: "draft",
    },

    sentCount: {
        type: Number,
        default: 0,
    },

    failedCount: {
        type: Number,
        default: 0,
    },

    totalRecipients: {
    type: Number,
    default: 0,
    },
    openedCount: {
    type: Number,
    default: 0,
},

clickedCount: {
    type: Number,
    default: 0,
},

repliedCount: {
    type: Number,
    default: 0,
},

},
{
    timestamps: true,
}
);

export default mongoose.model("Campaign", campaignSchema);