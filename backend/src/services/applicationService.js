import { PrismaClient } from "@prisma/client";
import { uploadToS3, deleteS3Object } from "../utils/uploadToS3.js";
const prisma = new PrismaClient();

export const createApplication = async (req, res) => {
  try {
    const {
      listing_id,
      remarks,
      full_name,
      student_card_id,
      contact_number,
      current_address,
    } = req.body;
    const { userName } = req.user;

    // Correction: simplified conditional check for required fields
    const requiredFields = [listing_id, full_name, student_card_id, contact_number, current_address];
    if (!requiredFields.every(field => field)) {
      return res
        .status(400)
        .json({ error: "All student details are required" });
    }

    const listing = await prisma.listing.findUnique({
      where: { listing_id },
    });
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const existingApplication = await prisma.application.findFirst({
      where: { listing_id, student_id: userName },
    });
    if (existingApplication) {
      return res
        .status(409)
        .json({ error: "Application already exists for this listing" });
    }

    const application = await prisma.application.create({
      data: {
        listing_id: listing_id,
        student_id: userName,
        student_card_id,
        full_name,
        contact_number,
        current_address,
        application_status: "PENDING",
        remarks: remarks, // Correction: removed unnecessary null check
      },
    });

    const mediaEntries = [];
    const uploadPromises = [];

    if (req.files["government_id"]) {
      const file = req.files["government_id"][0];
      // correction: removed unnecessary await
      uploadPromises.push(
        uploadToS3(file).then((uploadedFile) => {
          mediaEntries.push({
            model_name: "application",
            model_id: application.application_id,
            media_url: uploadedFile,
            media_type: "government_id",
            media_category: "image",
          });
        })
      );
    }

    if (req.files["enrolment_certificate"]) {
      const file = req.files["enrolment_certificate"][0];
      uploadPromises.push(
        await uploadToS3(file).then((uploadedFile) => {
          mediaEntries.push({
            model_name: "application",
            model_id: application.application_id,
            media_url: uploadedFile,
            media_type: "enrolment_certificate",
            media_category: "image",
          });
        })
      );
    }

    if (req.files["financial_proof"]) {
      const file = req.files["financial_proof"][0];
      uploadPromises.push(
        await uploadToS3(file).then((uploadedFile) => {
          mediaEntries.push({
            model_name: "application",
            model_id: application.application_id,
            media_url: uploadedFile,
            media_type: "financial_proof",
            media_category: "image",
          });
        })
      );
    }

    if (req.files["other_documents"]) {
      const otherDocumentPromises = req.files["other_documents"].map(
        async (file) => {
          uploadPromises.push(
            await uploadToS3(file).then((uploadedFile) => {
              mediaEntries.push({
                model_name: "application",
                model_id: application.application_id,
                media_url: uploadedFile,
                media_type: "other_documents",
                media_category: "image",
              });
            })
          );
        }
      );
      uploadPromises.push(...otherDocumentPromises);
    }

    await Promise.all(uploadPromises);

    if (mediaEntries.length > 0) {
      await prisma.media.createMany({
        data: mediaEntries,
      });
    }

    return res.status(200).json({
      message: "Application created successfully",
      application,
      media: mediaEntries,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the application" });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const { userName } = req.user;

    const applications = await prisma.application.findMany({
      where: {
        student_id: userName,
      },
      include: {
        listing: true,
        user: true,
      },
    });

    const mediaPromises = applications.map(async (application) => {
      const media = await prisma.media.findMany({
        where: {
          model_id: application.application_id,
          model_name: "application",
        },
      });

      return { ...application, media };
    });

    const applicationsWithMedia = await Promise.all(mediaPromises);
    return res.status(200).json(applicationsWithMedia);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching applications" });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName } = req.user;

    const application = await prisma.application.findUnique({
      where: { application_id: id, student_id: userName },
      include: {
        listing: true,
        user: true,
      },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const media = await prisma.media.findMany({
      where: {
        model_id: application.application_id,
        model_name: "application",
      },
    });

    return res.status(200).json({ ...application, media });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the application" });
  }
};

// export const updateApplicationById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { application_status, remarks } = req.body;
//     const { userName } = req.user;

//     const application = await prisma.application.findUnique({
//       where: { application_id: id, student_id: userName },
//     });

//     if (!application) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     const updatedApplication = await prisma.application.update({
//       where: { application_id: id, student_id: userName },
//       data: {
//         application_status:
//           application_status || application.application_status,
//         remarks: remarks || application.remarks,
//       },
//     });

//     return res.status(200).json({
//       message: "Application updated successfully",
//       updatedApplication,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ error: "An error occurred while updating the application" });
//   }
// };

export const deleteApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName } = req.user;

    const application = await prisma.application.findUnique({
      where: { application_id: id, student_id: userName },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const mediaEntries = await prisma.media.findMany({
      where: { model_id: id },
    });

    if (mediaEntries && mediaEntries.length > 0) {
      const deletePromises = mediaEntries.map(async (media) => {
        try {
          await deleteS3Object(media.media_url);
        } catch (error) {
          console.error(`Error deleting media file: ${media.media_url}`, error);
        }
      });
      await Promise.all(deletePromises);

      await prisma.media.deleteMany({
        where: { model_id: id },
      });
    }

    await prisma.application.delete({
      where: { application_id: id, student_id: userName },
    });

    return res
      .status(200)
      .json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the application" });
  }
};
