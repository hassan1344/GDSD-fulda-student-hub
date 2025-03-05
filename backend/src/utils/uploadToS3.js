import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand
} from "@aws-sdk/client-s3";
import serverConfig from "../config/serverConfig.js";
import path from "path";
import { Upload } from "@aws-sdk/lib-storage";

const s3 = new S3Client({
  accessKeyId: serverConfig.AWS_ACCESS_KEY_ID,
  secretAccessKey: serverConfig.AWS_SECRET_ACCESS_KEY,
  region: serverConfig.AWS_REGION,
});

// export const uploadToS3 = async (file) => {
//   try {
//     const timestamp = Date.now();
//     const fileName = file.originalname.split(" ").join("-");
//     const extension = path.extname(fileName);
//     const baseName = path.basename(fileName, extension);
//     const uniqueFileName = `${baseName}-${timestamp}${extension}`;

//     const key = `public/uploads/images/${uniqueFileName}`;

//     console.log("Uploading to S3");

//     const uploadParams = {
//       Bucket: serverConfig.S3_BUCKET_NAME,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     return await s3
//       .send(new PutObjectCommand(uploadParams))
//       .then(() => uniqueFileName);
//   } catch (error) {
//     console.error("Something went wrong while uploading");
//   }
// };

export const uploadToS3 = async (file) => {
  const startTime = performance.now();

  try {
    const timestamp = Date.now();
    const fileName = file.originalname.split(" ").join("-");
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);
    const uniqueFileName = `${baseName}-${timestamp}${extension}`;

    const key = `public/uploads/images/${uniqueFileName}`;

    // Small file upload (< 5MB)
    if (file.buffer.length < 5 * 1024 * 1024) {
      const simpleUploadParams = {
        Bucket: serverConfig.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.buffer.length, // Reduce unnecessary metadata calculations
      };

      // Use standard PutObject for quick small file uploads
      const command = new PutObjectCommand(simpleUploadParams);
      await s3.send(command);

      const endTime = performance.now();
      const timeElapsed = (endTime - startTime).toFixed(2);

      console.log(`Small file uploaded successfully in ${timeElapsed} ms`);
      return uniqueFileName;
    }

    // Large file upload (>= 5MB)
    const parallelUpload = new Upload({
      client: s3,
      params: {
        Bucket: serverConfig.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
      },
      // Optimized for large files
      queueSize: 4, // Concurrent uploads
      partSize: 10 * 1024 * 1024 // 10MB part size 
    });

    // Progress tracking
    let uploadedBytes = 0;
    parallelUpload.on('httpUploadProgress', (progress) => {
      uploadedBytes = progress.loaded;
      console.log(`Upload progress: ${progress.loaded} / ${progress.total}`);
    });

    // Await the complete upload
    const result = await parallelUpload.done();

    const endTime = performance.now();
    const timeElapsed = (endTime - startTime).toFixed(2);

    console.log(`Large file uploaded successfully in ${timeElapsed} ms`, result.Location);
    return uniqueFileName;
  } catch (error) {
    console.error("S3 Upload Error", error);
    throw error;
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
    console.error("Something went wrong while uploading");
  }
};
