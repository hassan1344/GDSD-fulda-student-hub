import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getLandlordId(user_name) 
{
  const dbUser = await prisma.user.findUnique({
    where: { user_name },
    include: { Landlord: true },});
  if (!dbUser || !dbUser.Landlord) {
    throw new Error("Associated landlord profile not found");
  }  return dbUser.Landlord.landlord_id;
}
  

export const createMeeting = async (req, res) => 
{
  try {const { landlord_id, student_id, date } = req.body;
// Validation
    if (!landlord_id || !student_id || !date) {
      return res.status(400).json({ error: "Missing required fields" });}  
    if (new Date(date) < new Date()) {
      return res.status(400).json({ error: "Cannot schedule meetings in the past" });}
       const landlord_id1 = await getLandlordId(req.user.userName);
// Authorization check
    if (landlord_id1 !== landlord_id) {
      console.log(landlord_id1);
      return res.status(403).json({ error: "Unauthorized to schedule meetings" });}
    const newMeeting = await prisma.meeting.create({
    data: { landlord_id, student_id, date: new Date(date), },
    include: { student: { select: { first_name: true, last_name: true }}}});
      return res.status(201).json(newMeeting);
    } catch (error) {
    console.error("Error scheduling meeting:", error);
      return res.status(500).json({ error: "Internal server error" });
      }
};

     
export const getLandlordMeetings = async (req, res) => 
{
  try {
     const { landlord_id } = req.params;
     const landlord_id1 = await getLandlordId(req.user.userName);
  // Authorization
     if (landlord_id1 !== landlord_id ) {
     return res.status(403).json({ error: "Unauthorized access" });}
     const meetings = await prisma.meeting.findMany({
      where: { landlord_id },
      include: {
      student: { select: { first_name: true, last_name: true }}},
      orderBy: { date: 'asc' }
      });
      return res.status(200).json(meetings);
   } catch (error) {
     console.error("Error fetching landlord meetings:", error);
     return res.status(500).json({ error: "Internal server error" });
   }
};



export const cancelMeeting = async (req, res) => 
{
  try {
     const { meeting_id } = req.params;
     const meeting = await prisma.meeting.findUnique({
     where: { meeting_id }});
     const landlord_id1 = await getLandlordId(req.user.userName);
  // Authorization
    if (landlord_id1 !== meeting.landlord_id) {
    return res.status(403).json({ error: "Unauthorized to cancel meeting" });}
    const updatedMeeting = await prisma.meeting.update({
      where: { meeting_id },
      data: { status: "CANCELED" }});
    return res.status(200).json({ 
      message: "Meeting canceled successfully",
      meeting: updatedMeeting
    });
  } catch (error) {
  console.error("Error canceling meeting:", error);
  return res.status(500).json({ error: "Internal server error" });
  }
};
