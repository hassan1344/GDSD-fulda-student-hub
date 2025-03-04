import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { uploadToS3 } from "../utils/uploadToS3.js";

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

// Get the current file URL and convert it to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updateHTML = async (inputPath, outputHtml, parameters, signaturePath) => {
  const { address, rent, security, landlordName, studentName, leaseStartDate, leaseEndDate, landlordAddress } = parameters;
  let html = await fs.readFile(inputPath, {encoding: 'utf8'})
  html = html.replaceAll('[PROPERTY_ADDRESS]', address);
  html = html.replaceAll('[RENT_AMOUNT]', rent);
  html = html.replaceAll('[SECURITY_DEPOSIT]', security);
  html = html.replaceAll('[LANDLORD_NAME]', landlordName);
  html = html.replaceAll('[STUDENT_NAME]', studentName);
  html = html.replaceAll('[LEASE_START_DATE]', leaseStartDate);
  html = html.replaceAll('[LEASE_END_DATE]', leaseEndDate);
  html = html.replaceAll('[LANDLORD_ADDRESS]', landlordAddress);
  html = html.replaceAll('[CURRENT_DATE]', getCurrentDate());
  html = html.replaceAll('[LANDLORD_SIGNATURE_PATH]', signaturePath);

  return fs.writeFile(outputHtml, html);
}

const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const createPdf = async(outputHtml, outputPdfPath) => {
  const browser = await puppeteer.launch({executablePath: '/usr/bin/google-chrome-stable', args: ["--no-sandbox"]});
  const page = await browser.newPage();
  console.log(`file:///${outputHtml}`)

  await page.goto(`file:///${outputHtml}`, {waitUntil: 'networkidle0'});
  const pdf = await page.pdf({ format: 'A4', path: outputPdfPath });

  await browser.close();
  console.log(`PDF created at ${outputPdfPath}`);
  return pdf;
}

export const generateLeaseAgreement = async (req, res) => {
  try {
    const parameters = req.body;
    const {listingId} = parameters;
    if (!req.files["landlord_signature"]) {
      return res.status(400).json({ error: "Landlord signature is required" });
    }
    console.log('Debuggind Lease Backend');
    const { userName } = req.user;
    console.log('userName:', userName);
    console.log('listingId:', listingId);

    const tmpDir = path.join(__dirname, '..', '..', 'tmp');
    await fs.mkdir(tmpDir, { recursive: true }); // Ensure tmp directory exists
    console.log('tmpDir:', tmpDir);
    const signatureFile = req.files["landlord_signature"][0];
    const signaturePath = path.join(__dirname, '..', '..', 'tmp', `${userName}-${listingId}-landlord-signature.png`);
    console.log('signaturePath:', signaturePath);
    await fs.writeFile(signaturePath, signatureFile.buffer);

    const inputHtmlPath = path.join(__dirname, '..', 'utils', 'leaseContractTemplate.html');
    console.log('inputHtmlPath:', inputHtmlPath);
    const outputHtmlPath = path.join(__dirname, '..', '..', 'tmp', `${userName}-${listingId}-lease-agreement.html`);
    console.log('outputHtmlPath:', outputHtmlPath);
    const outputPdfPath = path.join(__dirname, '..', '..', 'tmp', `${userName}-${listingId}-lease-agreement.pdf`);
    console.log('outputPdfPath:', outputPdfPath);
    
    await updateHTML(inputHtmlPath, outputHtmlPath, parameters, signaturePath);
    const leaseFile = await createPdf(outputHtmlPath, outputPdfPath);
    await fs.unlink(outputHtmlPath);
    await fs.unlink(signaturePath);

    const leaseObject = await createLease(parameters);

    const leaseBuffer = Buffer.from(leaseFile);
    const bufferFile = {
      originalname: `lease_agreement_${leaseObject.lease_id}.pdf`,
      buffer: leaseBuffer,
      mimetype: "application/pdf",
    };
    console.log('FILE CREATE SUCCESSFULLY');
    await addMedia(bufferFile, leaseObject.lease_id);

    console.log('FILE UPLOADED SUCCESSFULLY');

    res.download(outputPdfPath, 'LeaseAgreement.pdf', (err) => {
      if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ error: 'Failed to download file' });
      } else {
        fs.unlink(outputPdfPath);
      }
  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while generating the lease agreement" });
  }
}

const addMedia = async (file, modelId) => {
  const mediaEntries = [];
  await uploadToS3(file).then((uploadedFile) => {
    mediaEntries.push({
      model_name: "lease",
      model_id: modelId,
      media_url: uploadedFile,
      media_type: "lease",
      media_category: "pdf",
    });
  })

  if (mediaEntries.length > 0) {
    await prisma.media.createMany({
      data: mediaEntries,
    });
  }
}

async function createLease(parameters) {
  try {
    const { address, rent, security, landlordName, studentName, leaseStartDate, leaseEndDate, landlordAddress, listingId, landlordId, tenantUserName } = parameters;
    const tenant_id = await getStudentIdByUsername(tenantUserName);
    const lease = await prisma.lease.create({
      data: {
      listing_id: listingId,  
      landlord_id: landlordId,
      tenant_id, 
      status: "active",
      address,
      rent: parseFloat(rent),
      security: parseFloat(security),
      lease_start: leaseStartDate,
      lease_start: new Date(leaseStartDate),
      lease_end: new Date(leaseEndDate),
      },
    });
    return lease;
  } catch (error) {
    console.error("Error creating lease:", error);
  }
}

async function getStudentIdByUsername(user_id) {
  try {
    const student = await prisma.student.findUnique({
      where: {
        user_id
      },
      select: {
        student_id: true,
      },
    });

    if (!student) {
      console.log("Student not found");
      return null;
    }

    console.log("Student ID:", student.student_id);
    return student.student_id;
  } catch (error) {
    console.error("Error fetching student ID:", error);
  }
}
