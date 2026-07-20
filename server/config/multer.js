import multer from "multer";
import path from "path";

// Configure where uploaded files will be stored
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

// Accept only CSV files
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        "text/csv",
        "application/csv",
        "text/plain",
        "application/vnd.ms-excel",
        "application/octet-stream",
    ];

    if (allowedMimes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.csv')) {
        cb(null, true);
    } else {
        cb(new Error("Only CSV files are allowed."), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
});

export default upload;