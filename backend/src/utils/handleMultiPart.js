import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const FileTypes = /jpeg|jpg|png|gif|avif|pdf/;
  const mimType = FileTypes.test(file.mimetype);
  const extname = FileTypes.test(path.extname(file.originalname));
  if (mimType && extname) {
    return callback(null, true);
  }
  callback(new Error("File type not supported"), false);
};

export const handleMultiPartData = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter,
});
