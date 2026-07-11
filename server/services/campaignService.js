import Campaign from "../models/Campaign.js";

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