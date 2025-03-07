import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const initializeLandlordTrust = async (userName) => {
  const existing = await prisma.landlord.findFirst({
    where: { 
        user_id: userName,
    },
    include: {
      LandlordTrust: true,
    }
  });

  if (!existing.landlordTrust || !existing.landlordTrust.length) {
    await prisma.landlordTrust.create({
      data: {
        landlord_id: existing.landlord_id,
        alpha: 1.0,
        beta: 1.0,
      },
    });
  }
};

export const updateTrustFromReview = async (review_id) => {
  const review = await prisma.landlordReviews.findUnique({
    where: { review_id },
    include: {
      application: {
        include: {
          listing: {
            include: {
              property: true,
            },
          },
        },
      },
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }
  const landlordUser = review.application.listing.property.landlord_id;
  if (!landlordUser) {
    throw new Error("No landlord user linked");
  }

  const trustRow = await prisma.landlordTrust.findFirst({
    where: { landlord_id: landlordUser },
  });
  let { alpha, beta } = trustRow;

  const rating = review.rating;
  const fRating = (rating - 1) / 4.0;

  alpha += fRating;
  beta += 1.0 - fRating;

  await prisma.landlordTrust.update({
    where: { landlord_trust_id: trustRow.landlord_trust_id },
    data: { alpha, beta },
  });
};

export const updateTrustFromRental = async (rental_id) => {
  const rental = await prisma.landlordRentalHistory.findUnique({
    where: { rental_id },
    include: {
      application: {
        include: {
          listing: {
            include: {
              property: true,
            },
          },
        },
      },
    },
  });

  console.log("RENTAL", rental.application.listing.property);

  if (!rental) {
    throw new Error("Rental record not found");
  }
  const landlordUser = rental.application.listing.property.landlord_id;
  console.log(landlordUser);
  if (!landlordUser) {
    throw new Error("No landlord user linked");
  }

  const trustRow = await prisma.landlordTrust.findFirst({
    where: { landlord_id: landlordUser },
  });
  let { alpha, beta } = trustRow;

  // e.g. if cancelled_by_landlord => 0.0, else => 1.0
  const fOutcome = rental.cancelled_by_landlord ? 0.0 : 1.0;

  alpha += fOutcome;
  beta += 1.0 - fOutcome;

  await prisma.landlordTrust.update({
    where: { landlord_trust_id: trustRow.landlord_trust_id },
    data: { alpha, beta },
  });
};

export const getLandlordTrustScore = async (landlord_id) => {
  const trustRow = await prisma.landlordTrust.findFirst({
    where: { landlord_id },
  });

  let trustScore = 0.5; // default score if no trust data exists
  let decisionMessage = "No trust data available";

  if (trustRow) {
    const { alpha, beta } = trustRow;
    const sum = alpha + beta;

    if (sum > 0) {
      trustScore = (alpha / sum).toFixed(2);
    } else {
      trustScore = 0.0;
    }
  }

  // decision
  if (trustScore >= 0.8) {
    decisionMessage = "Highly trusted";
  } else if (trustScore >= 0.6) {
    decisionMessage = "Moderately trusted";
  } else if (trustScore >= 0.4) {
    decisionMessage = "Average trust";
  } else if (trustScore >= 0.2) {
    decisionMessage = "Caution advised";
  } else {
    decisionMessage = "Low trust level";
  }

  return { trustScore, decisionMessage };
};
