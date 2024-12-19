import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllAmenities = async (req, res) => {
  try {
    const amenities = await prisma.amenity.findMany();
    res.status(200).json(amenities);
  } catch (error) {
    console.error("Error fetching amenities:", error);
    res.status(500).json({ error: "An error occurred while fetching amenities" });
  }
};

export const getAmenityById = async (req, res) => {
  const { id } = req.params;
  try {
    const amenity = await prisma.amenity.findUnique({
      where: { amenity_id: id },
    });

    if (!amenity) {
      return res.status(404).json({ error: "Amenity not found" });
    }

    res.status(200).json(amenity);
  } catch (error) {
    console.error("Error fetching amenity:", error);
    res.status(500).json({ error: "An error occurred while fetching the amenity" });
  }
};

export const getAllRoomTypes = async (req, res) => {
    try {
      const roomTypes = await prisma.roomType.findMany();
      res.status(200).json(roomTypes);
    } catch (error) {
      console.error("Error fetching room types:", error);
      res.status(500).json({ error: "An error occurred while fetching room types" });
    }
  };
  
  export const getRoomTypeById = async (req, res) => {
    const { id } = req.params;
    try {
      const roomType = await prisma.room_type.findUnique({
        where: { room_type_id: id },
      });
  
      if (!roomType) {
        return res.status(404).json({ error: "Room type not found" });
      }
  
      res.status(200).json(roomType);
    } catch (error) {
      console.error("Error fetching room type:", error);
      res.status(500).json({ error: "An error occurred while fetching the room type" });
    }
  };