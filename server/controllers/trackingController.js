import Campaign from "../models/Campaign.js";
import Recipient from "../models/Recipient.js";

export const trackOpen = async (req, res) => {
    console.log("TRACK OPEN HIT");
    console.log(req.params);

    try {
        const { token } = req.params;

        console.log("Token:", token);

        const recipient = await Recipient.findOne({
            trackingToken: token,
        });

        console.log("Recipient:", recipient);

        if (recipient && !recipient.opened) {
            await Recipient.findByIdAndUpdate(recipient._id, {
                $set: {
                    opened: true,
                    openedAt: new Date(),
                },
            });

            console.log("Recipient marked as opened.");
        }

    } catch (error) {
        console.error("Tracking Error:", error);
    }

    // Return 1x1 transparent PNG
    const pixel = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        "base64"
    );

    res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": pixel.length,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
    });

    res.end(pixel);
};