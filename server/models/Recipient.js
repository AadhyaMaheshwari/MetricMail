import mongoose from "mongoose";

const recipientSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    trackingToken: {
    type: String,
    unique: true,
},

    status: {
      type: String,
      enum: ["pending", "sending", "sent", "failed", "bounced"],
      default: "pending",
    },

    messageId: {
      type: String,
      default: "",
    },

    threadId: {
      type: String,
      default: "",
    },

    opened: {
      type: Boolean,
      default: false,
    },

    clicked: {
      type: Boolean,
      default: false,
    },

    replied: {
      type: Boolean,
      default: false,
    },

    bounceReason: {
      type: String,
      default: "",
    },
    errorMessage: {
    type: String,
    default: "",
    },

    sentAt: {
      type: Date,
      default: null,
    },

    openedAt: {
      type: Date,
      default: null,
    },

    clickedAt: {
      type: Date,
      default: null,
    },

    repliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Recipient", recipientSchema);