import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import serverConfig from "../config/serverConfig.js";
import path from "path";

const s3 = new S3Client({
  accessKeyId: serverConfig.AWS_ACCESS_KEY_ID,
  secretAccessKey: serverConfig.AWS_SECRET_ACCESS_KEY,
  region: serverConfig.AWS_REGION,
});

export const uploadToS3 = async (file) => {
  try {
    const timestamp = Date.now();
    const fileName = file.originalname.split(" ").join("-");
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);
    const uniqueFileName = `${baseName}-${timestamp}${extension}`;

    const key = `public/uploads/images/${uniqueFileName}`;

    const uploadParams = {
      Bucket: serverConfig.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return await s3
      .send(new PutObjectCommand(uploadParams))
      .then(() => uniqueFileName);
  } catch (error) {
    throw new Error("Something went wrong while uploading");
  }
};

export const deleteS3Object = async (key) => {
  try {
    const deleteParams = {
      Bucket: serverConfig.S3_BUCKET_NAME,
      Key: `public/uploads/images/${key}`,
    };

    return await s3.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    throw new Error("Something went wrong while deleting");
  }
};
