import { PrismaClient } from "@prisma/client";
import { updateTrustFromReview } from "../utils/rentalScoreUtility.js";
import random from "random";

const prisma = new PrismaClient();

const generateAnonymousName = () => {
  return `User${random.int(1000, 9999)}`;
};

export const addReview = async (req, res) => {
  try {
    const { application_id, rating, reviewText } = req.body;
    const { userName } = req.user;
    const application = await prisma.application.findFirst({
      where: { application_id },
      include: {
        listing: {
          include: {
            property: true,
          },
        },
      },
    });
    // console.log(userName);
    // console.log(application.application_id);
    // const checkExisting = await prisma.landlordReviews.findFirst({
    //     where : {application_id}
    // })
    // if (userName === application.student_id) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You have already submitted a review for this application.",
    //   });
    // }

    if (application.application_status === "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Application status is still pending",
      });
    }

    const review = await prisma.landlordReviews.create({
      data: {
        application_id: application.application_id,
        rating,
        review_text: reviewText,
      },
    });

    await updateTrustFromReview(review.review_id);

    return res.status(200).json({
      success: true,
      message: "Review submitted and trust updated.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllReviewsForALandlord = async (req, res) => {
  const { listingId } = req.params;
  //   console.log(listingId);
  const { userName } = req.user;

  try {
    const listing = await prisma.listing.findUnique({
      where: { listing_id: listingId },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const reviews = await prisma.landlordReviews.findMany({
      where: {
        application: {
          listing_id: listingId,
          // student_id: {
          //   not: userName, // Exclude current
          // },
        },
      },
      include: {
        application: {
          include: {
            user: {
              select: { user_name: true },
            },
            listing: true,
          },
        },
      },
    });

    // Anonymize
    const anonymizedReviews = reviews.map((review) => ({
      ...review,
      reviewerName: generateAnonymousName(),
      rating: review.rating,
      comment: review.review_text || "No comment provided",
    }));

    res.status(200).json(anonymizedReviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentReviews = async (req, res) => {
  //on a specific application
  const { applicationId } = req.params;
  console.log(applicationId);
  const { userName } = req.user;

  try {
    const review = await prisma.landlordReviews.findFirst({
      where: {
        application_id: applicationId,
        application: {
          student_id: userName,
        },
      },
    });

    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found for this application" });
    }

    res.status(200).json({
      reviewId: review.review_id,
      rating: review.rating,
      comment: review.review_text || "No comment provided",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
