import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const { id: userName } = req.params;
    const user = await prisma.user.findUnique({where: {user_name: userName}});
    if (user.user_type.toUpperCase() === 'STUDENT') {
      const student = await prisma.student.findUnique({ where: { user_id: userName } });
      return res.json({...student, email: user.email, userType: user.user_type});
    } else if (user.user_type.toUpperCase() === 'LANDLORD') {
      const landlord = await prisma.landlord.findUnique({ where: { user_id: userName } });
      return res.json({...landlord, email: user.email, userType: user.user_type});
    }
    res.status(400).json({ error: 'Invalid user type' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create user details
export const createProfile = async (req, res) => {
  try {
    const { userName, userType } = req.user;
    const { firstName, lastName, phoneNumber, address, profilePicture, university, studentIdNumber, emailVerified, trustScore } = req.body;
    if (userType === 'STUDENT') {
      const newStudent = await prisma.student.create({
        data: {
          user_id: userName,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          profile_picture_id: profilePicture,
          university,
          student_id_number: studentIdNumber,
          email_verified: emailVerified,
        },
      });
      return res.status(201).json(newStudent);
    } else if (userType === 'LANDLORD') {
      const newLandlord = await prisma.landlord.create({
        data: {
          user_id: userName,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          address,
          profile_picture_id: profilePicture,
          trust_score: trustScore
        },
      });
      return res.status(201).json(newLandlord);
    }
    res.status(400).json({ error: 'Invalid user type' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user details
export const updateProfile = async (req, res) => {
  try {
    const { userName, userType } = req.user;
    const { firstName, lastName, phoneNumber, address, profilePicture, university, studentIdNumber, emailVerified, trustScore } = req.body;
    
    let updates = {};
    firstName && (updates.first_name = firstName);
    lastName && (updates.last_name = lastName);
    phoneNumber && (updates.phone_number = phoneNumber);
    address && (updates.address = address);
    profilePicture && (updates.profile_picture_id = profilePicture);
    university && (updates.university = university);
    studentIdNumber && (updates.student_id_number = studentIdNumber);
    emailVerified && (updates.email_verified = emailVerified);
    trustScore && (updates.trust_score = trustScore);

    if (userType === 'STUDENT') {
      const updatedStudent = await prisma.student.update({
        where: { user_id: userName },
        data: updates,
      });
      return res.json(updatedStudent);
    } else if (userType === 'LANDLORD') {
      const updatedLandlord = await prisma.landlord.update({
        where: { user_id: userName },
        data: updates,
      });
      return res.json(updatedLandlord);
    }
    res.status(400).json({ error: 'Invalid user type' });
  } catch (error) {
    if (error.code === 'P2025') {
      // Handles case where record does not exist
      return res.status(404).json({ error: 'User details not found' });
    }
    res.status(500).json({ error: error.message });
  }
};


// Delete user details
export const deleteProfile = async (req, res) => {
  const { userName, userType } = req.user;

  try {
    if (userType === 'STUDENT') {
      await prisma.student.delete({ where: { user_id: userName } });
      return res.json({ message: 'Student details deleted successfully' });
    } else if (userType === 'LANDLORD') {
      await prisma.landlord.delete({ where: { user_id: userName } });
      return res.json({ message: 'Landlord details deleted successfully' });
    }
    res.status(400).json({ error: 'Invalid user type' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user details' });
  }
};
