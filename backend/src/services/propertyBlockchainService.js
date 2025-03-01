// services/propertyBlockchainService.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

// If you have this helper in propertyModuleService.js, you can import from there.
// For demo, we replicate here:
async function getLandlordId(user_name) {
    const dbUser = await prisma.user.findUnique({
      where: { user_name },
      include: { Landlord: true },
    });
  
    if (!dbUser || !dbUser.Landlord) {
      throw new Error("Associated landlord profile not found");
    }
  
    return dbUser.Landlord.landlord_id;
  }

/**
 * POST: Create a new PropertyBlockchainConfig record.
 * - Expects { property_id, wallet_address } in the body.
 * - By default, sets blockchain_tx_enabled = true.
 */
export const createPropertyBlockchainConfig = async (req, res) => {
  try {
    const { property_id, wallet_address } = req.body;
    if (!req.user || !req.user.userName) {
        return res.status(401).json({ success: false, error: "User not authenticated" });
      }  
  
      // Validate landlord ownership of the property
      const landlord = await prisma.user.findUnique({
        where: { user_name: req.user.userName },
        include: { Landlord: true },
      });
  
      if (!landlord || !landlord.Landlord) {
        return res.status(404).json({ success: false, error: "Landlord profile not found" });
      }
  
      const property = await prisma.property.findUnique({
        where: { property_id },
        include: { landlord: true },
      });
  
      if (!property || property.landlord_id !== landlord.Landlord.landlord_id) {
        return res.status(403).json({ success: false, error: "Unauthorized access to property" });
      }
    // Create config
    const newConfig = await prisma.propertyBlockchainConfig.create({
      data: {
        property_id,
        landlord_wallet_address: wallet_address,
        blockchain_tx_enabled: true, // default
      },
    });

    return res.status(201).json({
      success: true,
      message: "Blockchain config created successfully",
      data: newConfig,
    });
  } catch (error) {
    console.error("Error creating PropertyBlockchainConfig:", error);
    if (error.message === "Associated landlord profile not found") {
      return res
        .status(404)
        .json({ success: false, error: error.message });
    }
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    });
  }
};

/**
 * PUT: Update an existing PropertyBlockchainConfig record by ID.
 * - You can change wallet_address or blockchain_tx_enabled.
 */
export const updatePropertyBlockchainConfig = async (req, res) => {
  try {
    if (!req.user || !req.user.userName) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }
    const landlord_id = await getLandlordId(req.user.userName);

    // e.g. /blockchain-config/:id
    const { id } = req.params;
    const { wallet_address, blockchain_tx_enabled } = req.body;

    // Find existing config
    const existingConfig = await prisma.propertyBlockchainConfig.findUnique({
      where: { id },
      include: { property: true },
    });
    if (!existingConfig) {
      return res.status(404).json({
        success: false,
        error: "Blockchain config not found",
      });
    }

    // Check property ownership
    if (existingConfig.property.landlord_id !== landlord_id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this config",
      });
    }

    // Update fields
    const updatedConfig = await prisma.propertyBlockchainConfig.update({
      where: { id },
      data: {
        landlord_wallet_address:
          wallet_address || existingConfig.landlord_wallet_address,
        blockchain_tx_enabled:
          blockchain_tx_enabled !== undefined
            ? blockchain_tx_enabled
            : existingConfig.blockchain_tx_enabled,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Blockchain config updated successfully",
      data: updatedConfig,
    });
  } catch (error) {
    console.error("Error updating PropertyBlockchainConfig:", error);
    if (error.message === "Associated landlord profile not found") {
      return res
        .status(404)
        .json({ success: false, error: error.message });
    }
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    });
  }
};

export const getWalletByPropertyId = async (req, res) => {
    try {
        const { property_id } = req.params;
        
        if (!req.user?.userName) {
            return res.status(401).json({ 
                success: false, 
                error: "Authentication required" 
            });
        }

        // Verify landlord ownership of the property
        const landlord_id = await getLandlordId(req.user.userName);
        const property = await prisma.property.findUnique({
            where: { property_id },
            select: { landlord_id: true }
        });

        if (!property || property.landlord_id !== landlord_id) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized access to property"
            });
        }

        // Retrieve wallet and transaction status
        const config = await prisma.propertyBlockchainConfig.findUnique({
            where: { property_id },
            select: {
                landlord_wallet_address: true,
                blockchain_tx_enabled: true
            }
        });

        // Retrieve all listings related to this property
        const listings = await prisma.listing.findMany({
            where: { property_id },
            select: {
                listing_id: true,
                title: true,
                rent: true,
                room_type_id: true,
                description: true,
                status: true,
                created_at: true,
                updated_at: true
            }
        });

        if (!config) {
            return res.status(404).json({
                success: false,
                error: "No blockchain wallet configured for this property",
                listings // Return listings even if blockchain config is missing
            });
        }

        return res.status(200).json({
            success: true,
            wallet: config,
            listings
        });

    } catch (error) {
        console.error("Error fetching wallet by property ID:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

export const getWalletByListingId = async (req, res) => {
  try {
      const { listing_id } = req.params;
      
      if (!listing_id) {
          return res.status(400).json({
              success: false,
              error: "Listing ID is required"
          });
      }

      // Step 1: Find the property_id from listing
      const listing = await prisma.listing.findUnique({
          where: { listing_id },
          select: {
              property_id: true,
              title: true,
              rent: true,
              description: true
          }
      });

      if (!listing) {
          return res.status(404).json({
              success: false,
              error: "Listing not found"
          });
      }

      // Step 2: Fetch the landlord's wallet from the property ID
      const propertyConfig = await prisma.propertyBlockchainConfig.findUnique({
          where: { property_id: listing.property_id },
          select: {
              landlord_wallet_address: true,
              blockchain_tx_enabled: true
          }
      });

      if (!propertyConfig) {
          return res.status(404).json({
              success: false,
              error: "No blockchain wallet configured for this property"
          });
      }

      if (!propertyConfig.blockchain_tx_enabled) {
          return res.status(403).json({
              success: false,
              error: "Blockchain transactions are disabled for this property"
          });
      }

      // Step 3: Return the wallet and listing details
      return res.status(200).json({
          success: true,
          wallet: propertyConfig.landlord_wallet_address,
          listing: {
              listing_id,
              title: listing.title,
              rent: listing.rent,
              description: listing.description
          }
      });

  } catch (error) {
      console.error("Error fetching wallet by listing ID:", error);
      return res.status(500).json({
          success: false,
          error: "Internal server error"
      });
  }
};


// Add this to services/propertyBlockchainService.js
export const getBlockchainConfigByPropertyId = async (req, res) => {
    try {
      const { property_id } = req.params;
      
      if (!req.user?.userName) {
        return res.status(401).json({ 
          success: false, 
          error: "Authentication required" 
        });
      }
  
      // Verify property ownership
      const landlord_id = await getLandlordId(req.user.userName);
      const property = await prisma.property.findUnique({
        where: { property_id },
        select: { landlord_id: true }
      });
  
      if (!property || property.landlord_id !== landlord_id) {
        return res.status(403).json({
          success: false,
          error: "Unauthorized property access"
        });
      }
  
      // Get blockchain config (using unique property_id constraint)
      const config = await prisma.propertyBlockchainConfig.findUnique({
        where: { property_id },
        include: {
          property: {
            select: {
              address: true,
              created_at: true
            }
          }
        }
      });
  
      if (!config) {
        return res.status(404).json({
          success: false,
          error: "Blockchain config not found for this property"
        });
      }
  
      return res.status(200).json({
        success: true,
        data: config
      });
  
    } catch (error) {
      console.error("Error fetching blockchain config:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error"
      });
    }
  };
  

/**
 * DELETE: Remove the PropertyBlockchainConfig record by ID.
 * - If you only want to "disable," you could do a partial update
 *   to set blockchain_tx_enabled = false. But here we remove it.
 */
export const deletePropertyBlockchainConfig = async (req, res) => {
  try {
    if (!req.user || !req.user.userName) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }
    const landlord_id = await getLandlordId(req.user.userName);
    const { id } = req.params;

    // Find config
    const existingConfig = await prisma.propertyBlockchainConfig.findUnique({
      where: { id },
      include: { property: true },
    });
    if (!existingConfig) {
      return res.status(404).json({
        success: false,
        error: "Blockchain config not found",
      });
    }

    // Check ownership
    if (existingConfig.property.landlord_id !== landlord_id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this config",
      });
    }

    // Delete
    await prisma.propertyBlockchainConfig.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Blockchain config deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting PropertyBlockchainConfig:", error);
    if (error.message === "Associated landlord profile not found") {
      return res
        .status(404)
        .json({ success: false, error: error.message });
    }
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred",
    });
  }
};

