import fs from "fs";
import csv from "csv-parser";

export const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const recipients = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                recipients.push(row);
            })
            .on("end", () => {
                resolve(recipients);
            })
            .on("error", (error) => {
                reject(error);
            });
    });
};