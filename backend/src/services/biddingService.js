import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBiddingStatus = async (req, res) => {
  try {
    const {listingId} = req.query;

    let biddingSession = await prisma.biddingSession.findFirst({
      where: {
        listing_id: listingId,
        status: 'active',
      },
    });

    if (!biddingSession) {
      biddingSession = await prisma.biddingSession.findFirst({
        where: {
          listing_id: listingId,
          status: 'ended',
        },
      });
    }
    let isBid = false, bidStatus = null;

    if(biddingSession) {
      isBid = true;
      bidStatus = biddingSession.status;
    }

    return res.json({ isBid, bidStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllActiveBiddings = async (req, res) => {
  try {
    const activeBiddings = await prisma.biddingSession.findMany({
      where: {
        status: 'active',
      },
    });

    return res.json(activeBiddings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBiddingSessions = async (req, res) => {
  try {
    const { userName } = req.query;

    const biddingSessions = await prisma.biddingSession.findMany({
      where: {
        Bids: {
          some: {
            bidder_id: userName, // Ensure the user has at least one bid in the session
          },
        },
      },
      include: {
        Bids: true, // Include all bids for verification
      },
      orderBy: {
        status: "asc", // Active sessions first
      },
    });

    console.log("Fetched Sessions for", userName, biddingSessions); // Debug log

    return res.json(biddingSessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


