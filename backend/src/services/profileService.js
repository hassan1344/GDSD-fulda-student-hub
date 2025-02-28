import { PrismaClient } from "@prisma/client";
import { uploadToS3, deleteS3Object } from "../utils/uploadToS3.js";
import { initializeLandlordTrust } from "../utils/rentalScoreUtility.js";

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    // Correction : userName extracted from decoded token
    const { userName } = req.user;
    // console.log(req.user);
    let userProfile, modelId;
    const user = await prisma.user.findUnique({
      where: { user_name: userName },
    });
    if (user.user_type.toUpperCase() === "STUDENT") {
      userProfile = await prisma.student.findUnique({
        where: { user_id: userName },
      });
      modelId = userProfile.student_id; // Correction : Added optional chaining
    } else if (
      user.user_type.toUpperCase() === "LANDLORD" ||
      user.user_type.toUpperCase() === "ADMIN"
    ) {
      userProfile = await prisma.landlord.findUnique({
        where: { user_id: userName },
      });
      modelId = userProfile.landlord_id; // Correction : Added optional chaining
    }

    //added null check for userProfile

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const media = await prisma.media.findMany({
      where: {
        model_id: modelId,
      },
    });

    const userProfileWithMedia = {
      ...userProfile,
      Media: media.map((media) => ({
        mediaUrl: media.media_url,
        mediaType: media.media_type,
      })),
    };
    return res.json({
      ...userProfileWithMedia,
      email: user.email,
      userType: user.user_type,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        Landlord: true,
        Student: true,
      },
    });

    return res.json(users);
  } catch (error) {
    console.error("Error fetching Profiles:", error.message); //Correction : Error message
    throw error;
  }
};

// Create user details
export const createProfile = async (req, res) => {
  try {
    const { userName, userType } = req.user;
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      university,
      studentIdNumber,
      emailVerified,
      trustScore,
    } = req.body;

    const mediaEntries = [];
    let modelId, newProfile;
    if (userType === "STUDENT") {
      const newStudent = await prisma.student.create({
        data: {
          user_id: userName,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          university,
          student_id_number: studentIdNumber,
          email_verified: emailVerified === "true" ? true : false,
        },
      });
      modelId = newStudent.student_id;
      newProfile = newStudent;
    } else if (userType === "LANDLORD") {
      const newLandlord = await prisma.landlord.create({
        data: {
          user_id: userName,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          address,
          trust_score: parseInt(trustScore) || 0, // Correction, added a fallback condition
        },
      });
      await initializeLandlordTrust(userName);

      modelId = newLandlord.landlord_id;
      newProfile = newLandlord;
    }

    if (req.files && req.files["profile_pic"]) {
      const file = req.files["profile_pic"][0];
      await addMedia(file, modelId);
    }
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user details
export const updateProfile = async (req, res) => {
  try {
    const { userName, userType } = req.user;
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      profilePicture,
      university,
      studentIdNumber,
      emailVerified,
      trustScore,
    } = req.body;

    let updates = {};
    firstName && (updates.first_name = firstName);
    lastName && (updates.last_name = lastName);
    phoneNumber && (updates.phone_number = phoneNumber);
    address && (updates.address = address);
    university && (updates.university = university);
    studentIdNumber && (updates.student_id_number = studentIdNumber);
    emailVerified && (updates.email_verified = emailVerified);
    trustScore && (updates.trust_score = trustScore);

    let updatedProfile, modelId;

    if (userType === "STUDENT") {
      updatedProfile = await prisma.student.update({
        where: { user_id: userName },
        data: updates,
      });
      modelId = updatedProfile.student_id;
    } else if (userType === "LANDLORD") {
      updatedProfile = await prisma.landlord.update({
        where: { user_id: userName },
        data: updates,
      });
      modelId = updatedProfile.landlord_id;
    }

    if (req.files && req?.files["profile_pic"]) {
      //Optional chaining added
      await deleteMedia(modelId);
      const file = req.files["profile_pic"][0];
      await addMedia(file, modelId);
    }
    res.status(200).json(updatedProfile);
  } catch (error) {
    if (error.code === "P2025") {
      // Handles case where record does not exist
      return res.status(404).json({ error: "User details not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Delete user details
export const deleteProfile = async (req, res) => {
  const { userName, userType } = req.user;

  try {
    let modelId;
    if (userType === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { user_id: userName },
      });
      modelId = student.student_id;
      await prisma.student.delete({ where: { user_id: userName } });
    } else if (userType === "LANDLORD") {
      const landlord = await prisma.landlord.findUnique({
        where: { user_id: userName },
      });
      modelId = landlord.landlord_id;
      await prisma.landlord.delete({ where: { user_id: userName } });
    }
    await deleteMedia(modelId);
    res.status(204).json({ message: "Details deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user details" });
  }
};

const deleteMedia = async (modelId) => {
  const mediaEntries = await prisma.media.findMany({
    where: { model_id: modelId },
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
      where: { model_id: modelId },
    });
  }
};

const addMedia = async (file, modelId) => {
  const mediaEntries = [];
  await uploadToS3(file).then((uploadedFile) => {
    mediaEntries.push({
      model_name: "profile",
      model_id: modelId,
      media_url: uploadedFile,
      media_type: "profile_pic",
      media_category: "image",
    });
  });

  if (mediaEntries.length > 0) {
    await prisma.media.createMany({
      data: mediaEntries,
    });
  }
};
