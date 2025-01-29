import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Get the current file URL and convert it to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const updateHTML = async (inputPath, outputHtml, parameters) => {
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

  return fs.writeFile(outputHtml, html);
}

const createPdf = async(outputHtml, outputPdfPath) => {
  const browser = await puppeteer.launch();
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
    const { userName } = req.user;
    const inputHtmlPath = path.join(__dirname, '..', 'utils', 'leaseContractTemplate.html');
    const outputHtmlPath = path.join(__dirname, '..', '..', 'tmp', `${userName}-lease-agreement.html`);
    const outputPdfPath = path.join(__dirname, '..', '..', 'tmp', `${userName}-lease-agreement.pdf`);
    
    await updateHTML(inputHtmlPath, outputHtmlPath, parameters);
    await createPdf(outputHtmlPath, outputPdfPath);
    await fs.unlink(outputHtmlPath);

    res.download(outputPdfPath, 'LeaseAgreement.pdf', (err) => {
      if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ error: 'Failed to download file' });
      }
  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while generating the lease agreement" });
  }
}
