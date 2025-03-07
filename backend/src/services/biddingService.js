import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBiddingStatus = async (req, res) => {
  try {
    const { listingId } = req.query;

    let biddingSession = await prisma.biddingSession.findFirst({
      where: {
        listing_id: listingId,
        status: "active",
      },
    });

    if (!biddingSession) {
      biddingSession = await prisma.biddingSession.findFirst({
        where: {
          listing_id: listingId,
          status: "ended",
        },
      });
    }
    let isBid = false,
      bidStatus = null;

    if (biddingSession) {
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
        status: "active",
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
      orderBy: [{
        status: "asc",
      },
      {
        created_at: "desc",
      }]
    });

    console.log("Fetched Sessions for", userName, biddingSessions); // Debug log

    return res.json(biddingSessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLandlordBiddingSessions = async (req, res) => {
  try {
    const { userName } = req.query;

    const biddingSessions = await prisma.biddingSession.groupBy({
      by: ["listing_id"], // Group by listing_id to get one session per listing
      where: {
        listing: {
          property: {
            landlord: {
              user: {
                user_name: userName, // Filter by landlord's user_name
              },
            },
          },
        },
      },
      _max: {
        created_at: true, // Get the latest session based on creation date
      },
    });

    // Fetch the full bidding session details for the latest sessions
    const latestSessions = await prisma.biddingSession.findMany({
      where: {
        OR: biddingSessions.map((session) => ({
          listing_id: session.listing_id,
          created_at: session._max.created_at,
        })),
      },
      include: {
        listing: {
          include: {
            property: true, // Include property details
          },
        },
        Bids: true, // Include all bids
      },
      orderBy: {
        status: "asc", // Active sessions first
      },
    });

    console.log("Fetched latest sessions for Landlord", userName, latestSessions);

    return res.json(latestSessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

