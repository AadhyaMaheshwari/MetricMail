import mongoose from "mongoose";
import Campaign from "../models/Campaign.js";
import Recipient from "../models/Recipient.js";

export const createCampaignService = async ({
    userId,
    name,
    subject,
    body,
}) => {
    const campaign = await Campaign.create({
        userId,
        name,
        subject,
        body,
    });

    return campaign;
};

export const getCampaignsService = async (userId) => {
    const campaigns = await Campaign.find({ userId }).sort({
        createdAt: -1,
    });

    return campaigns;
};

export const getCampaignByIdService = async (campaignId) => {
    return await Campaign.findById(campaignId);
};

export const deleteCampaignService = async (userId, campaignId) => {
    if (!mongoose.isValidObjectId(campaignId)) {
        throw new Error("Invalid campaign id.");
    }

    const campaign = await Campaign.findOneAndDelete({
        _id: campaignId,
        userId,
    });

    if (!campaign) {
        throw new Error("Campaign not found.");
    }

    await Recipient.deleteMany({ campaignId });

    return campaign;
};

