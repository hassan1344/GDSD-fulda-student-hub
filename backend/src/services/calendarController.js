import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getLandlordId(user_name) {
  const dbUser = await prisma.user.findUnique({
    where: { user_name },
    include: { Landlord: true },
  });
  if (!dbUser || !dbUser.Landlord) {
    throw new Error("Associated landlord profile not found");
  } return dbUser.Landlord.landlord_id;
}


async function getStudentId(user_name) {
  const dbUser = await prisma.user.findUnique({
    where: { user_name },
    include: { Student: true },
  });
  if (!dbUser || !dbUser.Student) {
    throw new Error("Associated Student profile not found");
  } return dbUser.Student.student_id;
}




//-------------------------------------------------
export const getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      select: { student_id: true, first_name: true, last_name: true }
    });

    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};









export const createMeeting = async (req, res) => {
  try {
    const { landlord_id, student_id, date } = req.body;
    // Validation
    if (!landlord_id || !student_id || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (new Date(date) < new Date()) {
      return res.status(400).json({ error: "Cannot schedule meetings in the past" });
    }
    const landlord_id1 = await getLandlordId(req.user.userName);
    const student_id1 = await getStudentId(student_id);
    // Authorization check
    // if (landlord_id1 !== landlord_id) {
    //   console.log(landlord_id1);
    //   return res.status(403).json({ error: "Unauthorized to schedule meetings" });}
    const newMeeting = await prisma.meeting.create({
      data: { landlord_id: landlord_id1, student_id: student_id1, date: new Date(date), },
      include: { student: { select: { first_name: true, last_name: true } } }
    });
    return res.status(201).json(newMeeting);
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getLandlordMeetings = async (req, res) => {
  try {
    const { landlord_id } = req.params;
    const landlord_id1 = await getLandlordId(req.user.userName);
    // Authorization
    if (landlord_id1 !== landlord_id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    const meetings = await prisma.meeting.findMany({
      where: { landlord_id },
      include: {
        student: { select: { first_name: true, last_name: true } }
      },
      orderBy: { date: 'asc' }
    });
    return res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching landlord meetings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const cancelMeeting = async (req, res) => {
  try {
    const { meeting_id } = req.params;
    console.log(107, meeting_id);
    const meeting = await prisma.meeting.findUnique({
      where: { meeting_id }
    });
    // const landlord_id1 = await getLandlordId(req.user.userName);
    // // Authorization
    // if (landlord_id1 !== meeting.landlord_id) {
    //   return res.status(403).json({ error: "Unauthorized to cancel meeting" });
    // }
    const updatedMeeting = await prisma.meeting.update({
      where: { meeting_id },
      data: { status: "CANCELED" }
    });
    return res.status(200).json({
      message: "Meeting canceled successfully",
      meeting: updatedMeeting
    });
  } catch (error) {
    console.error("Error canceling meeting:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getScheduledMeetings = async (req, res) => {
  try {
    const { landlord_id } = req.params;
    // const landlord_id1 = await getLandlordId(req.user.userName);
    // Authorization
    // if (landlord_id1 !== landlord_id) {
    //   return res.status(403).json({ error: "Unauthorized access" });
    // }
    const meetings = await prisma.meeting.findMany({
      where: { landlord_id, status: { not: "CANCELED" }, },
      include: {
        student: { select: { first_name: true, last_name: true } },
        landlord: { select: { user_id: true } }, // Include Landlord and select user_id
      },
      orderBy: { date: "asc" },
    });
    return res.status(200).json(meetings);
  } catch (error) {
    console.error("Error fetching landlord meetings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params; // Assuming meeting ID is passed as a URL parameter
    const landlord_id = req.user.landlordId; // Assuming landlord ID is available from authenticated user

    // Find the meeting first to verify it exists and belongs to the landlord
    const meeting = await prisma.meeting.findUnique({
      where: { id: Number(id) }, // Convert to number if your IDs are numeric
      include: {
        landlord: { select: { user_id: true } },
      },
    });

    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // Authorization check - ensure the meeting belongs to the requesting landlord
    if (meeting.landlord_id !== landlord_id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Delete the meeting
    await prisma.meeting.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};