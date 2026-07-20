import Recipient from "../models/Recipient.js";

export const saveRecipientsService = async (
    campaignId,
    recipients
) => {
    const recipientDocuments = recipients.map((recipient) => ({
        campaignId,
        name: recipient.Name,
        email: recipient.Email,
    }));

    const savedRecipients = await Recipient.insertMany(
        recipientDocuments
    );

    return savedRecipients;
};

export const getRecipientsByCampaignService = async (campaignId) => {
    return await Recipient.find({
        campaignId,
    });
};