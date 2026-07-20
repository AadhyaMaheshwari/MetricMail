import Campaign from "../models/Campaign.js";
import Recipient from "../models/Recipient.js";

import { getCampaignByIdService } from "./campaignService.js";
import { getRecipientsByCampaignService } from "./recipientService.js";
import { sendCampaignEmail } from "./gmailCampaignService.js";

export const sendCampaignService = async (campaignId, user) => {
    const campaign = await getCampaignByIdService(campaignId);

    if (!campaign) {
        throw new Error("Campaign not found.");
    }

    const recipients = await getRecipientsByCampaignService(campaignId);

    if (recipients.length === 0) {
        throw new Error("No recipients found.");
    }

    await Campaign.findByIdAndUpdate(campaignId, {
        status: "sending",
        totalRecipients: recipients.length,
    });

    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
        await Recipient.findByIdAndUpdate(recipient._id, {
            status: "sending",
            errorMessage: "",
        });

        try {
            const result = await sendCampaignEmail({
                user,
                recipient,
                campaign,
            });

            await Recipient.findByIdAndUpdate(recipient._id, {
                status: "sent",
                sentAt: new Date(),
                messageId: result.messageId,
                threadId: result.threadId,
                errorMessage: "",
            });

            sentCount++;

        } catch (err) {
            await Recipient.findByIdAndUpdate(recipient._id, {
                status: "failed",
                errorMessage: err.message,
            });

            failedCount++;
        }
    }

    await Campaign.findByIdAndUpdate(campaignId, {
        status: "completed",
        sentCount,
        failedCount,
    });

    return {
        sentCount,
        failedCount,
    };
};