import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createApplication = async (req, res) => {
  try {
    const { listing_id, remarks } = req.body;
    const { userName } = req.user;

    if (!listing_id) {
      return res.status(400).json({ error: "listing_id is required" });
    }

    const listing = await prisma.listing.findUnique({
      where: { listing_id },
    });
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const student = await prisma.user.findUnique({
      where: { user_name: userName },
    });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        listing_id,
        student_id: userName,
      },
    });
    if (existingApplication) {
      return res
        .status(409)
        .json({ error: "Application already exists for this listing" });
    }

    const application = await prisma.application.create({
      data: {
        listing_id,
        student_id: userName,
        application_status: "PENDING",
        remarks: remarks || null,
      },
    });

    return res
      .status(201)
      .json({ message: "Application created successfully", application });
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
        student: true,
      },
    });
    return res.status(200).json(applications);
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
        student: true,
      },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    return res.status(200).json(application);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the application" });
  }
};

export const updateApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { application_status, remarks } = req.body;
    const { userName } = req.user;

    const application = await prisma.application.findUnique({
      where: { application_id: id, student_id: userName },
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    const updatedApplication = await prisma.application.update({
      where: { application_id: id, student_id: userName },
      data: {
        application_status:
          application_status || application.application_status,
        remarks: remarks || application.remarks,
      },
    });

    return res.status(200).json({
      message: "Application updated successfully",
      updatedApplication,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the application" });
  }
};

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
