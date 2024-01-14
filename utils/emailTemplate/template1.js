// const { PDFDocument, rgb } = require('pdf-lib');
// const qr = require('qrcode');

import { PDFDocument,rgb,degrees } from "pdf-lib";
import qr from 'qrcode'

export async function generatePdf(data) {
    // console.log('->',data)
    // return
  // Create a new PDF document

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const name = data.user_name;
  const cardNumber= data.card_number;
  const terms = data.offer_name;
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();

  // Add content to the PDF
  page.drawText(`Guest: ${name}`, { x: 50, y: 700 });
  page.drawText(`E-card ID: ${cardNumber}`, { x: 50, y: 680 });
  page.drawText(`Terms: ${terms}`, { x: 50, y: 660 });

  // Add QR code
//   const qrCodeImage = await generateQRCodeImage(pdfDoc, name, cardNumber);
//   const qrCodeDims = qrCodeImage ? { width: 100, height: 100 } : { width: 0, height: 0 };

//   // Check if qrCodeImage exists before drawing
//   if (qrCodeImage) {
//     page.drawImage(qrCodeImage, { x: 50, y: 600, ...qrCodeDims });
//   }
  // Add provided PDF content
  const pdfContent = `Kids Eat Free Card City Hopper
  SCAN QR CODE FOR THE MOST CURRENT
  LIST OF PARTICIPATING
  RESTAURANTS/VENUES
  
  N/A
  
  GUEST INFORMATION
  Guest: ${name}
  Start Date: ${new Date().toLocaleDateString()}
  Expiration: ${new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
  E-card ID: ${cardNumber}
  Each e-Card ID is valid for one (1) child 11
  
  years or younger
  IMPORTANT NOTE FOR THE RESTAURANT/VENUE:
  
  This is a Kids Eat Free e-Card PLUS issued by Taktik Enterprise, Inc. for use by their guests and is valid for the individual noted during the dates set forth on this e-Card. This
  electronic version of the Kids Eat Free Card PLUS is not to be collected by the venue. Please check with your manager as needed to honor your participating offer or call 352-
  
  432-8161 for assistance.
  
  How to Use Your Kids Eat Free e-Card City Hopper
  Visit any of the dining venues or attractions listed on the Kids Eat Free Card PLUS section of the Kids Eat Free Card website or mobile app at the
  time of use and present this Kids Eat Free Card PLUS to your server at time of ordering to receive 1 Kids Eat Free Card Meal per paying adult
  main course or participating Attraction or Retail offer, per valid e-Card for children 11 years or younger.
  Call 352-432-8161 or email us at info@kidseatfreecard.com should you require more information.
  
  Prefer to Use a Digital Card? – Activate this eCard and use directly from your iPhone, iPad or Android device.
  1. Download the Kids Eat Free Card App from iTunes or Google Play 2. Open App on your mobile device and
  login to your account or create new account if you do not already have one. (All purchases through mobile app
  will automatically create an account associated with your email used. Click Forgot Password to reset if needed.
  All other card will require an initial Account Setup)
  3. Go to “Register Cards” select card type, card city and your travel start date listed on this eCard
  4. Enter the eCard ID # located above and confirm your iCard activation
  5. Select Card Type - Kids Eat Free Card City Hopper
  7. Upload Image of this eCard and SUBMIT 8. Pull up your iCard on your mobile app and present to
  participating venues prior to ordering and start saving!
  
  SCAN FOR APP
  Download
  
  Terms and Conditions:
  Use of any Card, eCard or iCard (mobile version) is subject is subject to full adherence to all restrictions, terms and conditions set for on www.kidseatfreecard.com. Kids Eat Free Cards cannot be used with any other discounts or offers.
  Each Kids Eat Free Card is valid for kids 11 years or younger to receive 1 free kids meal with a full price paying adult entrée (main course) or published offer. Additional children will require additional cards and additional qualifying adult
  entrée (main course). (Ex: A family of 5 with 3 children 11 years or younger may only use up to 2 cards per visit) Kids Eat Free Card meals may not apply to taxes, gratuities, bar (alcohol) drinks or take away food unless permitted by the
  restaurant. Kids Eat Free Card is Non-Refundable and Non-Transferable. Kids Eat Free Cards expire 90 Days from date of first use or activation. Each Kids Eat Free Card is not valid until signed and dated by a parent or guardian.
  Participating restaurants and offers may be modified, added or removed from the program without prior notice. All cards are protected under International Copyright and Trademark laws and may not be sold, resold, copied or
  reproduced without the express written permission of the Company. Noncompliance may be subject to penalties as allowed by law. Cards may not be sold or resold on eBay, similar auction sites or anywhere else and any such
  transactions will be deemed unauthorized. Any unauthorized card sales may be subject to penalties as allowed by law. If registering your Card or eCard on any of our mobile apps or platforms, you certify that you are in authorized
  possession of the respective card and any abuse or misrepresentation of the Card, serial number or other identifiers may considered theft to the extent permitted by law. All Cards are shall remain the property of the Company until
  signed and dated by the authorized user. All Cards must be surrendered upon demand for any abuse or implied abuses surrounding the program and as determined by the Company. The Company reserves the right to modify all
  restrictions, terms and conditions at any time and without notice. To contact Kids Eat Free Card Customer Care email info@taktikenterprises.com or call 352-432-8161. Hours of Operation 9-5 M-F.
  By signing this eCard, you hereby have read and agree to all terms and conditions set forth herein and at the following site: www.kidseatfreecard.com/faq
  Parent or Guardian Signature ______________________________________ Parent or
  Guardian Signature ______________________________________ Date
  _______________
  
  Date _______________
  
  Taktik
  Enterprices, Inc.
  
  Security Code
  113874
  C e r t i f i e d e - c a r d
  
  B Y T A K T I K E N T E R P R I S E S I N C`;

  const lines = pdfContent.split('\n');
  let yOffset = 500; // Adjust the starting y-coordinate
  for (const line of lines) {
    page.drawText(line, { x: 50, y: yOffset });
    yOffset -= 20; // Adjust the vertical spacing
  }

  // Save the PDF as a buffer
  return await pdfDoc.save();
}

// async function generateQRCodeImage(pdfDoc, name, cardNumber) {
//     // Implement your QR code generation logic here
//     // Example: Use the 'qrcode' library
//     const url = `Name: ${name}, Card Number: ${cardNumber}`;
//     const qrCodeBuffer = await qr.toBuffer(url);
  
//     // Convert the buffer to a PDFImage
//     const qrCodeImage = await PDFImage.create(pdfDoc, qrCodeBuffer);
  
//     return qrCodeImage;
//   }
// module .exports = {generatePdf};
