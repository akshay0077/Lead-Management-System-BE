import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/files/import/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

export const uploadMiddleware = (req, res, next) => {
    multer({ storage }).single('file')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err); // Log the error
            return res.status(400).send({ message: "File upload error", error: err.message });
        }
        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).send({ message: "No file uploaded" });
        }
        console.log('File uploaded successfully:', req.file);
        next();
    });
};
