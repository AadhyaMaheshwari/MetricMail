import { getGmailClient } from "./gmailService.js";

export const sendCampaignEmail = async ({
    user,
    recipient,
    campaign,
}) => {

    const gmail = getGmailClient(user);
    const publicBaseUrl = process.env.PUBLIC_BASE_URL || process.env.CLIENT_URL || process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const trackingUrl = `${publicBaseUrl.replace(/\/$/, "")}/api/tracking/open/${recipient.trackingToken}`;

    const trackingPixel = `
    <img
        src="${trackingUrl}"
        width="1"
        height="1"
        style="display:none;width:1px;height:1px;"
        alt=""
    />
    `;


    const emailBody = `
    ${campaign.body.replace(/{{name}}/g, recipient.name || "")}
    ${trackingPixel}
`;

    console.log(emailBody);
    const emailLines = [
        `To: ${recipient.email}`,
        `Subject: ${campaign.subject}`,
        "Content-Type: text/html; charset=UTF-8",
        "",
        emailBody,
    ];


    const rawEmail = Buffer.from(
        emailLines.join("\n")
    )
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");


    const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: rawEmail,
        },
    });


    return {
        messageId: response.data.id,
        threadId: response.data.threadId,
    };
};