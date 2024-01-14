// const nodemailer = require('nodemailer');
import nodemailer from "nodemailer";
import connection from "../config/db.js";
// import { dateFormater } from './helpers';
// Function to send email to the user
import qr from "qrcode";
// import { generatePdf } from '../utils/emailTemplate/template1.js';

const sql = "SELECT * FROM cards";
const sqlUser = "SELECT * FROM users";
const s = `SELECT * FROM email_template WHERE action = ?`;

export const sendEmailToUser = async (data) => {
  // Using a promise to handle the asynchronous nature of the query
//   card_order
  const data1 = await queryPromise(sql);
  connection.query(s, [data.filter], (e, r) => {
    if (e) {
      // console.log(e)
      console.error("Error.", e);
      return;
    }
    // console.log('dm',r)
    if (r.length === 0) {
      console.error("No results found in the database.");
      // Handle the case where no results are found
      return;
    }
    const dataN = r[0];

    // Assuming `data.Body` contains the email content
    let content = dataN.Body;
    let subject = dataN.Subject;
    Object.keys(data).forEach((placeholder) => {
    //   console.log(placeholder)
      const regex = new RegExp(`{{${placeholder}}}`, "g");
        // console.log(regex);
      if (placeholder) {
        // subject =
        content = content.replace(regex, data[placeholder]);
      }
    });
    // // console.log(subject)
    // console.log(content)
    // return 
    const mailOptions = {
        to: data.email, // assuming user's email is stored in data.user_email
        subject: subject,
        html: `<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und"
       style="font-family:'Exo 2', sans-serif">
    <head>
       <meta charset="UTF-8">
       <meta content="width=device-width, initial-scale=1" name="viewport">
       <meta name="x-apple-disable-message-reformatting">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta content="telephone=no" name="format-detection">
       <title>New email template 2023-11-21</title>
       <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
       <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
    <![endif]--> <!--[if !mso]><!-- -->
       <link
           href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
           rel="stylesheet"> <!--<![endif]-->
       <style type="text/css">
           .rollover div {
               font-size: 0;
           }
    
           .rollover:hover .rollover-first {
               max-height: 0px !important;
               display: none !important;
           }
    
           .rollover:hover .rollover-second {
               max-height: none !important;
               display: block !important;
           }
    
           .container-hover:hover>table {
               background: linear-gradient(153.06deg, #7EE8FA -0.31%, #EEC0C6 99.69%) !important;
               transition: 0.3s all !important;
           }
    
           .es-menu.es-table-not-adapt td a:hover,
           a.es-button:hover {
               text-decoration: underline !important;
           }
    
           #outlook a {
               padding: 0;
           }
    
           .es-button {
               mso-style-priority: 100 !important;
               text-decoration: none !important;
           }
    
           a[x-apple-data-detectors] {
               color: inherit !important;
               text-decoration: none !important;
               font-size: inherit !important;
               font-family: inherit !important;
               font-weight: inherit !important;
               line-height: inherit !important;
           }
    
           .es-desk-hidden {
               display: none;
               float: left;
               overflow: hidden;
               width: 0;
               max-height: 0;
               line-height: 0;
               mso-hide: all;
           }
    
           @media only screen and (max-width:600px) {
    
               p,
               ul li,
               ol li,
               a {
                   line-height: 150% !important
               }
    
               h1,
               h2,
               h3,
               h1 a,
               h2 a,
               h3 a {
                   line-height: 120% !important
               }
    
               h1 {
                   font-size: 28px !important;
                   text-align: left
               }
    
               h2 {
                   font-size: 24px !important;
                   text-align: left
               }
    
               h3 {
                   font-size: 20px !important;
                   text-align: left
               }
    
               .es-header-body h1 a,
               .es-content-body h1 a,
               .es-footer-body h1 a {
                   font-size: 28px !important;
                   text-align: left
               }
    
               .es-header-body h2 a,
               .es-content-body h2 a,
               .es-footer-body h2 a {
                   font-size: 24px !important;
                   text-align: left
               }
    
               .es-header-body h3 a,
               .es-content-body h3 a,
               .es-footer-body h3 a {
                   font-size: 20px !important;
                   text-align: left
               }
    
               .es-menu td a {
                   font-size: 16px !important
               }
    
               .es-header-body p,
               .es-header-body ul li,
               .es-header-body ol li,
               .es-header-body a {
                   font-size: 16px !important
               }
    
               .es-content-body p,
               .es-content-body ul li,
               .es-content-body ol li,
               .es-content-body a {
                   font-size: 16px !important
               }
    
               .es-footer-body p,
               .es-footer-body ul li,
               .es-footer-body ol li,
               .es-footer-body a {
                   font-size: 16px !important
               }
    
               .es-infoblock p,
               .es-infoblock ul li,
               .es-infoblock ol li,
               .es-infoblock a {
                   font-size: 12px !important
               }
    
               *[class="gmail-fix"] {
                   display: none !important
               }
    
               .es-m-txt-c,
               .es-m-txt-c h1,
               .es-m-txt-c h2,
               .es-m-txt-c h3 {
                   text-align: center !important
               }
    
               .es-m-txt-r,
               .es-m-txt-r h1,
               .es-m-txt-r h2,
               .es-m-txt-r h3 {
                   text-align: right !important
               }
    
               .es-m-txt-l,
               .es-m-txt-l h1,
               .es-m-txt-l h2,
               .es-m-txt-l h3 {
                   text-align: left !important
               }
    
               .es-m-txt-r img,
               .es-m-txt-c img,
               .es-m-txt-l img {
                   display: inline !important
               }
    
               .es-button-border {
                   display: inline-block !important
               }
    
               a.es-button,
               button.es-button {
                   font-size: 20px !important;
                   display: inline-block !important
               }
    
               .es-adaptive table,
               .es-left,
               .es-right {
                   width: 100% !important
               }
    
               .es-content table,
               .es-header table,
               .es-footer table,
               .es-content,
               .es-footer,
               .es-header {
                   width: 100% !important;
                   max-width: 600px !important
               }
    
               .es-adapt-td {
                   display: block !important;
                   width: 100% !important
               }
    
               .adapt-img {
                   width: 100% !important;
                   height: auto !important
               }
    
               .es-m-p0 {
                   padding: 0 !important
               }
    
               .es-m-p0r {
                   padding-right: 0 !important
               }
    
               .es-m-p0l {
                   padding-left: 0 !important
               }
    
               .es-m-p0t {
                   padding-top: 0 !important
               }
    
               .es-m-p0b {
                   padding-bottom: 0 !important
               }
    
               .es-m-p20b {
                   padding-bottom: 20px !important
               }
    
               .es-mobile-hidden,
               .es-hidden {
                   display: none !important
               }
    
               tr.es-desk-hidden,
               td.es-desk-hidden,
               table.es-desk-hidden {
                   width: auto !important;
                   overflow: visible !important;
                   float: none !important;
                   max-height: inherit !important;
                   line-height: inherit !important
               }
    
               tr.es-desk-hidden {
                   display: table-row !important
               }
    
               table.es-desk-hidden {
                   display: table !important
               }
    
               td.es-desk-menu-hidden {
                   display: table-cell !important
               }
    
               .es-menu td {
                   width: 1% !important
               }
    
               table.es-table-not-adapt,
               .esd-block-html table {
                   width: auto !important
               }
    
               table.es-social {
                   display: inline-block !important
               }
    
               table.es-social td {
                   display: inline-block !important
               }
    
               .es-m-p5 {
                   padding: 5px !important
               }
    
               .es-m-p5t {
                   padding-top: 5px !important
               }
    
               .es-m-p5b {
                   padding-bottom: 5px !important
               }
    
               .es-m-p5r {
                   padding-right: 5px !important
               }
    
               .es-m-p5l {
                   padding-left: 5px !important
               }
    
               .es-m-p10 {
                   padding: 10px !important
               }
    
               .es-m-p10t {
                   padding-top: 10px !important
               }
    
               .es-m-p10b {
                   padding-bottom: 10px !important
               }
    
               .es-m-p10r {
                   padding-right: 10px !important
               }
    
               .es-m-p10l {
                   padding-left: 10px !important
               }
    
               .es-m-p15 {
                   padding: 15px !important
               }
    
               .es-m-p15t {
                   padding-top: 15px !important
               }
    
               .es-m-p15b {
                   padding-bottom: 15px !important
               }
    
               .es-m-p15r {
                   padding-right: 15px !important
               }
    
               .es-m-p15l {
                   padding-left: 15px !important
               }
    
               .es-m-p20 {
                   padding: 20px !important
               }
    
               .es-m-p20t {
                   padding-top: 20px !important
               }
    
               .es-m-p20r {
                   padding-right: 20px !important
               }
    
               .es-m-p20l {
                   padding-left: 20px !important
               }
    
               .es-m-p25 {
                   padding: 25px !important
               }
    
               .es-m-p25t {
                   padding-top: 25px !important
               }
    
               .es-m-p25b {
                   padding-bottom: 25px !important
               }
    
               .es-m-p25r {
                   padding-right: 25px !important
               }
    
               .es-m-p25l {
                   padding-left: 25px !important
               }
    
               .es-m-p30 {
                   padding: 30px !important
               }
    
               .es-m-p30t {
                   padding-top: 30px !important
               }
    
               .es-m-p30b {
                   padding-bottom: 30px !important
               }
    
               .es-m-p30r {
                   padding-right: 30px !important
               }
    
               .es-m-p30l {
                   padding-left: 30px !important
               }
    
               .es-m-p35 {
                   padding: 35px !important
               }
    
               .es-m-p35t {
                   padding-top: 35px !important
               }
    
               .es-m-p35b {
                   padding-bottom: 35px !important
               }
    
               .es-m-p35r {
                   padding-right: 35px !important
               }
    
               .es-m-p35l {
                   padding-left: 35px !important
               }
    
               .es-m-p40 {
                   padding: 40px !important
               }
    
               .es-m-p40t {
                   padding-top: 40px !important
               }
    
               .es-m-p40b {
                   padding-bottom: 40px !important
               }
    
               .es-m-p40r {
                   padding-right: 40px !important
               }
    
               .es-m-p40l {
                   padding-left: 40px !important
               }
    
               .m-c-p16r {
                   padding-right: 8vw
               }
    
               .es-desk-hidden {
                   display: table-row !important;
                   width: auto !important;
                   overflow: visible !important;
                   max-height: inherit !important
               }
               .store-icons {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
    
            .store-icon {
                width: 150px;
                height: 50px;
            }
           }
       </style>
    </head>
    
    <body
       style="width:100%;font-family:'Exo 2', sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
       <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:aliceblue">
           <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" src="https://tlr.stripocdn.email/content/guids/CABINET_bf3f28777a864b4fca3f15706a2554aa/images/group_10.png" color="#12022f" origin="0.5, 0" position="0.5, 0"></v:fill> </v:background><![endif]-->
           <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;"
               role="none">
               <tr>
                   <td valign="top" style="padding:0;Margin:0; padding-bottom: 40px;">
                       <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
                           style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                           <tr>
                               <td class="es-m-p15r es-m-p15l" align="center" style="padding:0;Margin:0">
                                   <table class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                                       style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:aliceblue;width:640px"
                                       role="none">
                                       <tr>
                                           <td align="left"
                                               style="padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px">
                                               <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                   style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                   <tr>
                                                       <td align="center" valign="top"
                                                           style="padding:0;Margin:0;width:560px">
                                                           <table cellpadding="0" cellspacing="0" width="100%"
                                                               role="presentation"
                                                               style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                               <tr class="es-mobile-hidden">
                                                                   <td align="center" height="15"
                                                                       style="padding:0;Margin:0"></td>
                                                               </tr>
                                                           </table>
                                                       </td>
                                                   </tr>
                                               </table>
                                           </td>
                                       </tr>
                                       <tr>
                                           <td class="es-m-p20" align="left" bgcolor="#ffffff"
                                               style="Margin:0;padding-top:30px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-color:#ffffff;border-radius:20px">
                                               <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                   style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                   <tr>
                                                       <td align="left" style="padding:0;Margin:0;width:560px">
                                                           <table cellpadding="0" cellspacing="0" width="100%"
                                                               role="presentation"
                                                               style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                               
                                                               ${content}
    
                                                           </table>
                                                       </td>
                                                   </tr>
                                               </table>
                                           </td>
                                       </tr>
                                       <tr>
                                           <td align="left"
                                               style="padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px">
                                               <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                   style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                   <tr>
                                                       <td align="center" valign="top"
                                                           style="padding:0;Margin:0;width:560px">
                                                           <table cellpadding="0" cellspacing="0" width="100%"
                                                               role="presentation"
                                                               style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                               <tr class="es-mobile-hidden">
                                                                   <td align="center" height="15"
                                                                       style="padding:0;Margin:0"></td>
                                                               </tr>
                                                           </table>
                                                       </td>
                                                   </tr>
                                               </table>
                                           </td>
                                       </tr>
                                   </table>
                               </td>
                           </tr>
                       </table>
                       <table cellpaddding="0" cellspacing="0" class="es-footer" align="center" role="none">
                           <td >
                               <div id="m_8098493824779601743wrapper" dir="ltr"
                                   style="margin:0 auto;width:100%;max-width:650px" width="100%">
                                   <table cellpadding="0" style="background-color: rgb(224, 221, 230); border-radius: 20px;" cellspacing="0" height="100%" width="100%">
                                       <tbody >
                                           <tr>
                                               <td align="center" valign="top">
                                                   <div id="m_8098493824779601743template_header_image">
                                                   </div>
                                                   <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                                       id="m_8098493824779601743template_container"
                                                       style="background-color:#fff; border-radius:20px !important"
                                                       bgcolor="#fff">
                                                       <tbody>
                                                           <tr>
                                                               <td align="center" valign="top">
    
                                                                   <table border="0" cellpadding="0" cellspacing="0"
                                                                       width="100%"
                                                                       id="m_8098493824779601743template_header"
                                                                       style="color:#fff;font-weight:bold;vertical-align:middle;font-family:'Exo 2', sans-serif; border-radius: 20px"
                                                                       bgcolor="#fff">
                                                                       <tbody>
                                                                           <tr>
                                                                               <td id="m_8098493824779601743header_wrapper"
                                                                                   style="padding:36px 48px;display:block">
                                                                                   <h1 style="font-family:'Exo 2', sans-serif;font-size:30px;font-weight:300;margin:0;text-align:left;color:#636363;background-color:inherit"
                                                                                       bgcolor="inherit">Thanks for
                                                                                       shopping with us</h1>
                                                                               </td>
                                                                           </tr>
                                                                       </tbody>
                                                                   </table>
    
                                                               </td>
                                                           </tr>
                                                           <tr>
                                                               <td align="center" valign="top">
    
                                                                   <table border="0" cellpadding="0" cellspacing="0"
                                                                       width="100%"
                                                                       id="m_8098493824779601743template_body">
                                                                       <tbody>
                                                                           <tr>
                                                                               <td valign="top"
                                                                                   id="m_8098493824779601743body_content"
                                                                                   style="background-color:#fff;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;"
                                                                                   bgcolor="#fff">
    
                                                                                   <table border="0" cellpadding="20"
                                                                                       cellspacing="0" width="100%">
                                                                                       <tbody>
                                                                                           <tr>
                                                                                               <td valign="top"
                                                                                                   style="padding:0px 48px">
                                                                                                   <div id="m_8098493824779601743body_content_inner"
                                                                                                       style="color:#636363;font-family:'Exo 2', sans-serif;font-size:14px;line-height:150%;text-align:left"
                                                                                                       align="left">
                                                                                                       <p
                                                                                                           style="margin:0 0 16px">
                                                                                                           Hi ${
                                                                                                             data.user_name
                                                                                                           },</p>
                                                                                                       <p
                                                                                                           style="margin:0 0 16px">
                                                                                                           We have finished
                                                                                                           processing your
                                                                                                           order.</p>
    
                                                                                                       <h2
                                                                                                           style="display:block;font-family:'Exo 2', sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">
                                                                                                           [Order #${
                                                                                                             data.orderId
                                                                                                           }]
                                                                                                           (${dateFormater(
                                                                                                             data.date
                                                                                                           )})</h2>
    
                                                                                                       <div
                                                                                                           style="margin-bottom:40px">
                                                                                                           <table
                                                                                                               cellspacing="0"
                                                                                                               cellpadding="6"
                                                                                                               border="1"
                                                                                                               style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;width:100%;"
                                                                                                               width="100%">
                                                                                                               <thead>
                                                                                                                   <tr>
                                                                                                                       <th scope="col"
                                                                                                                           style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                           align="left">
                                                                                                                           Product
                                                                                                                       </th>
                                                                                                                       <th scope="col"
                                                                                                                           style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                           align="left">
                                                                                                                           Quantity
                                                                                                                       </th>
                                                                                                                       <th scope="col"
                                                                                                                           style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                           align="left">
                                                                                                                           Price
                                                                                                                       </th>
                                                                                                                   </tr>
                                                                                                               </thead>
                                                                                                               <tbody>
                                                                                                                   ${data.productDetails.map(
                                                                                                                     (
                                                                                                                       item
                                                                                                                     ) => {
                                                                                                                       const matchingItems =
                                                                                                                         data1.filter(
                                                                                                                           (
                                                                                                                             it
                                                                                                                           ) =>
                                                                                                                             item.cardId ===
                                                                                                                             it.id
                                                                                                                         );
                                                                                                                       const cardNames =
                                                                                                                         matchingItems
                                                                                                                           .map(
                                                                                                                             (
                                                                                                                               it
                                                                                                                             ) =>
                                                                                                                               it.card_name
                                                                                                                           )
                                                                                                                           .join(
                                                                                                                             ", "
                                                                                                                           );
                                                                                                                       return `<tr>
                                                                                                                    <td style="color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;word-wrap:break-word"
                                                                                                                        align="left">
                                                                                                                        ${cardNames}
                                                                                                                        <ul
                                                                                                                            style="font-size:small;margin:1em 0 0;padding:0;list-style:none">
                                                                                                                            <li
                                                                                                                                style="margin:.5em 0 0;padding:0">
                                                                                                                                <strong
                                                                                                                                    style="float:left;margin-right:.25em;clear:both">Register
                                                                                                                                    Start
                                                                                                                                    Date:</strong>
                                                                                                                                <p style="margin:0">
                                                                                                                                   ${item.registerDate}
                                                                                                                                </p>
                                                                                                                            </li>
                                                                                                                        </ul>
                                                                                                                    </td>
                                                                                                                    <td style="color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;"
                                                                                                                        align="left">
                                                                                                                        ${item.quantity}
                                                                                                                    </td>
                                                                                                                    <td style="color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;"
                                                                                                                        align="left">
                                                                                                                        <span><span>$</span>${item.subtotal}</span>
                                                                                                                        <small>(ex.
                                                                                                                            tax)</small>
                                                                                                                    </td>
                                                                                                                </tr>`;
                                                                                                                     }
                                                                                                                   )}
                                                                                                               </tbody>
                                                                                                               <tfoot>
                                                                                                                   <tr>
                                                                                                                       <th scope="row"
                                                                                                                           colspan="2"
                                                                                                                           style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;border-top-width:4px"
                                                                                                                           align="left">
                                                                                                                           Subtotal:
                                                                                                                       </th>
                                                                                                                       <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;border-top-width:4px"
                                                                                                                           align="left">
                                                                                                                           <span><span>$</span>${
                                                                                                                             data.sub_total
                                                                                                                           }</span>
                                                                                                                           <small>(ex.
                                                                                                                               tax)</small>
                                                                                                                       </td>
                                                                                                                   </tr>
                                                                                                                   <tr>
                                                                                                                       <th scope="row"
                                                                                                                           colspan="2"
                                                                                                                           style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                           align="left">
                                                                                                                           Discount:
                                                                                                                       </th>
                                                                                                                       <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                           align="left">
                                                                                                                           -<span><span>$</span>${
                                                                                                                             data.discount_amount
                                                                                                                           }</span>
                                                                                                                       </td>
                                                                                                                   </tr>
                                                                                                                   <tr>
                                                                                                                       <th scope="row"
                                                                                                                           colspan="2"
                                                                                                                           style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                           align="left">
                                                                                                                           Shipping:
                                                                                                                       </th>
                                                                                                                       <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                           align="left">
                                                                                                                          ${
                                                                                                                            data.shipping_type
                                                                                                                          }
                                                                                                                       </td>
                                                                                                                   </tr>
                                                                                                                   <tr>
                                                                                                                   <th scope="row"
                                                                                                                       colspan="2"
                                                                                                                       style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                       align="left">
                                                                                                                       Shipping Cost:
                                                                                                                   </th>
                                                                                                                   <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                       align="left">
                                                                                                                     $${
                                                                                                                       data.shipping_cost
                                                                                                                     }
                                                                                                                   </td>
                                                                                                               </tr>
                                                                                                                   <tr>
                                                                                                                       <th scope="row"
                                                                                                                           colspan="2"
                                                                                                                           style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                           align="left">
                                                                                                                           Total:
                                                                                                                       </th>
                                                                                                                       <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
                                                                                                                           align="left">
                                                                                                                           <span><span>$</span>${
                                                                                                                             data.totalAmount
                                                                                                                           }</span>
                                                                                                                       </td>
                                                                                                                   </tr>
                                                                                                               </tfoot>
                                                                                                           </table>
                                                                                                       </div>
    
                                                                                                       <table
                                                                                                           id="m_8098493824779601743addresses"
                                                                                                           cellspacing="0"
                                                                                                           cellpadding="0"
                                                                                                           border="0"
                                                                                                           style="width:100%;vertical-align:top;margin-bottom:40px;padding:0"
                                                                                                           width="100%">
                                                                                                           <tbody>
                                                                                                               <tr>
                                                                                                                   <td valign="top"
                                                                                                                       width="50%"
                                                                                                                       style="text-align:left;;border:0;padding:0"
                                                                                                                       align="left">
                                                                                                                       <h2
                                                                                                                           style="color:#636363;display:block;font-family:'Exo 2', sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">
                                                                                                                           Billing
                                                                                                                           address
                                                                                                                       </h2>
    
                                                                                                                       <address
                                                                                                                           style="padding:12px;color:#636363;border:1px solid #e5e5e5">
                                                                                                                          ${
                                                                                                                            data.address
                                                                                                                          }
                                                                                                                           <br><a
                                                                                                                               href="tel:1234567"
                                                                                                                               style="color:#636363;font-weight:normal;text-decoration:underline"
                                                                                                                               target="_blank">1234567</a>
                                                                                                                           <br><a
                                                                                                                               href="mailto:webseowiz6@gmail.com"
                                                                                                                               target="_blank">webseowiz6@gmail.com</a>
                                                                                                                       </address>
                                                                                                                   </td>
                                                                                                                   <td valign="top"
                                                                                                                       width="50%"
                                                                                                                       style="text-align:left;;padding:0"
                                                                                                                       align="left">
                                                                                                                       <h2
                                                                                                                           style="color:#636363;display:block;font-family:'Exo 2', sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">
                                                                                                                           Shipping
                                                                                                                           address
                                                                                                                       </h2>
    
                                                                                                                       <address
                                                                                                                           style="padding:12px;color:#636363;border:1px solid #e5e5e5">
                                                                                                                          ${
                                                                                                                            data.shipping_address
                                                                                                                              ? data.shipping_address
                                                                                                                              : "Address not found!"
                                                                                                                          }
                                                                                                                       </address>
                                                                                                                   </td>
                                                                                                               </tr>
                                                                                                           </tbody>
                                                                                                       </table>
                                                                                                       <p
                                                                                                           style="margin:0 0 16px; color:#636363">
                                                                                                           Thanks for
                                                                                                           shopping with
                                                                                                           us.</p>
                                                                                                       <p
                                                                                                           style="margin:0 0 16px">
                                                                                                           Best
                                                                                                           regards,<br>
                                                                                                           Taktik
                                                                                                           Enterprises,
                                                                                                           Inc.</p>
                                                                                                   </div>
                                                                                               </td>
                                                                                           </tr>
                                                                                           <div ><p style="font-size:10px;text-align:center">Kids Eat Free Card | Copyright 2023 | All Rights Reserved</p></div>
                                                                                       </tbody>
                                                                                   </table>
    
                                                                               </td>
                                                                           </tr>
                                                                       </tbody>
                                                                   </table>
    
                                                               </td>
                                                           </tr>
                                                       </tbody>
                                                   </table>
                                               </td>
                                           </tr>
                                           <tr>
                                               <td align="center" valign="top">
    
                                                   <table border="0" cellpadding="10" cellspacing="0" width="100%"
                                                       id="m_8098493824779601743template_footer">
                                                       <tbody>
                                                           <tr>
                                                               <td valign="top" style="padding:0;border-radius:6px">
                                                                   <table border="0" cellpadding="10" cellspacing="0"
                                                                       width="100%">
                                                                       <tbody>
                                                                           <tr>
                                                                               <td colspan="2" valign="middle"
                                                                                   id="m_8098493824779601743credit"
                                                                                   style="border-radius:6px;border:0;color:#8a8a8a;font-family:'Exo 2', sans-serif;font-size:12px;line-height:150%;text-align:center;padding:24px 0"
                                                                                   align="center">
                                                                                   <p style="margin:0 0 16px">Taktik
                                                                                       Enterprises eComm Division<br>Enjoy
                                                                                       your card</p>
                                                                               </td>
                                                                           </tr>
                                                                       </tbody>
                                                                   </table>
                                                               </td>
                                                           </tr>
                                                       </tbody>
                                                   </table>
    
                                               </td>
                                           </tr>
                                       </tbody>
                                   </table>
                               </div>
                           </td>
    
                       </table>
                   </td>
    
               </tr>
           </table>
       </div>
    </body>
    
    </html>`,
        // attachments: [
        //     {
        //       filename: 'document.pdf',
        //       content: attachmentBuffer,
        //     },
        //   ],
        // attachments: [pdfAttachment],
      };
    const transporter = nodemailer.createTransport({
      // configure your email provider here
      service: "gmail",
      auth: {
        user: "webseowiz1@gmail.com",
        pass: "jhss nshv cxnx seay",
      },
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return false;
      } else {
        return true;
      }
    });
    // Now `content` holds the modified email content

    // Proceed with sending the email or storing the content, etc.
  });
//   const transporter = nodemailer.createTransport({
//     // configure your email provider here
//     service: "gmail",
//     auth: {
//       user: "webseowiz1@gmail.com",
//       pass: "jhss nshv cxnx seay",
//     },
//   });

  //   const pdfBuffer = await generatePdf(`<h1>Your HTML Content Goes Here</h1>`, qrCode);

  //   const pdfBuffer = await generatePdf(data)
  //   const pdfAttachment = {
  //     filename: 'buyer_agreement.pdf', // Set a meaningful filename here
  //     content: pdfBuffer,
  //     encoding: 'base64',
  //   };
  //   console.log(data)
//   const mailOptions = {
//     to: data.email, // assuming user's email is stored in data.user_email
//     subject: data.subject,
//     html: `<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und"
//    style="font-family:'Exo 2', sans-serif">
// <head>
//    <meta charset="UTF-8">
//    <meta content="width=device-width, initial-scale=1" name="viewport">
//    <meta name="x-apple-disable-message-reformatting">
//    <meta http-equiv="X-UA-Compatible" content="IE=edge">
//    <meta content="telephone=no" name="format-detection">
//    <title>New email template 2023-11-21</title>
//    <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
//    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
// <![endif]--> <!--[if !mso]><!-- -->
//    <link
//        href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
//        rel="stylesheet"> <!--<![endif]-->
//    <style type="text/css">
//        .rollover div {
//            font-size: 0;
//        }

//        .rollover:hover .rollover-first {
//            max-height: 0px !important;
//            display: none !important;
//        }

//        .rollover:hover .rollover-second {
//            max-height: none !important;
//            display: block !important;
//        }

//        .container-hover:hover>table {
//            background: linear-gradient(153.06deg, #7EE8FA -0.31%, #EEC0C6 99.69%) !important;
//            transition: 0.3s all !important;
//        }

//        .es-menu.es-table-not-adapt td a:hover,
//        a.es-button:hover {
//            text-decoration: underline !important;
//        }

//        #outlook a {
//            padding: 0;
//        }

//        .es-button {
//            mso-style-priority: 100 !important;
//            text-decoration: none !important;
//        }

//        a[x-apple-data-detectors] {
//            color: inherit !important;
//            text-decoration: none !important;
//            font-size: inherit !important;
//            font-family: inherit !important;
//            font-weight: inherit !important;
//            line-height: inherit !important;
//        }

//        .es-desk-hidden {
//            display: none;
//            float: left;
//            overflow: hidden;
//            width: 0;
//            max-height: 0;
//            line-height: 0;
//            mso-hide: all;
//        }

//        @media only screen and (max-width:600px) {

//            p,
//            ul li,
//            ol li,
//            a {
//                line-height: 150% !important
//            }

//            h1,
//            h2,
//            h3,
//            h1 a,
//            h2 a,
//            h3 a {
//                line-height: 120% !important
//            }

//            h1 {
//                font-size: 28px !important;
//                text-align: left
//            }

//            h2 {
//                font-size: 24px !important;
//                text-align: left
//            }

//            h3 {
//                font-size: 20px !important;
//                text-align: left
//            }

//            .es-header-body h1 a,
//            .es-content-body h1 a,
//            .es-footer-body h1 a {
//                font-size: 28px !important;
//                text-align: left
//            }

//            .es-header-body h2 a,
//            .es-content-body h2 a,
//            .es-footer-body h2 a {
//                font-size: 24px !important;
//                text-align: left
//            }

//            .es-header-body h3 a,
//            .es-content-body h3 a,
//            .es-footer-body h3 a {
//                font-size: 20px !important;
//                text-align: left
//            }

//            .es-menu td a {
//                font-size: 16px !important
//            }

//            .es-header-body p,
//            .es-header-body ul li,
//            .es-header-body ol li,
//            .es-header-body a {
//                font-size: 16px !important
//            }

//            .es-content-body p,
//            .es-content-body ul li,
//            .es-content-body ol li,
//            .es-content-body a {
//                font-size: 16px !important
//            }

//            .es-footer-body p,
//            .es-footer-body ul li,
//            .es-footer-body ol li,
//            .es-footer-body a {
//                font-size: 16px !important
//            }

//            .es-infoblock p,
//            .es-infoblock ul li,
//            .es-infoblock ol li,
//            .es-infoblock a {
//                font-size: 12px !important
//            }

//            *[class="gmail-fix"] {
//                display: none !important
//            }

//            .es-m-txt-c,
//            .es-m-txt-c h1,
//            .es-m-txt-c h2,
//            .es-m-txt-c h3 {
//                text-align: center !important
//            }

//            .es-m-txt-r,
//            .es-m-txt-r h1,
//            .es-m-txt-r h2,
//            .es-m-txt-r h3 {
//                text-align: right !important
//            }

//            .es-m-txt-l,
//            .es-m-txt-l h1,
//            .es-m-txt-l h2,
//            .es-m-txt-l h3 {
//                text-align: left !important
//            }

//            .es-m-txt-r img,
//            .es-m-txt-c img,
//            .es-m-txt-l img {
//                display: inline !important
//            }

//            .es-button-border {
//                display: inline-block !important
//            }

//            a.es-button,
//            button.es-button {
//                font-size: 20px !important;
//                display: inline-block !important
//            }

//            .es-adaptive table,
//            .es-left,
//            .es-right {
//                width: 100% !important
//            }

//            .es-content table,
//            .es-header table,
//            .es-footer table,
//            .es-content,
//            .es-footer,
//            .es-header {
//                width: 100% !important;
//                max-width: 600px !important
//            }

//            .es-adapt-td {
//                display: block !important;
//                width: 100% !important
//            }

//            .adapt-img {
//                width: 100% !important;
//                height: auto !important
//            }

//            .es-m-p0 {
//                padding: 0 !important
//            }

//            .es-m-p0r {
//                padding-right: 0 !important
//            }

//            .es-m-p0l {
//                padding-left: 0 !important
//            }

//            .es-m-p0t {
//                padding-top: 0 !important
//            }

//            .es-m-p0b {
//                padding-bottom: 0 !important
//            }

//            .es-m-p20b {
//                padding-bottom: 20px !important
//            }

//            .es-mobile-hidden,
//            .es-hidden {
//                display: none !important
//            }

//            tr.es-desk-hidden,
//            td.es-desk-hidden,
//            table.es-desk-hidden {
//                width: auto !important;
//                overflow: visible !important;
//                float: none !important;
//                max-height: inherit !important;
//                line-height: inherit !important
//            }

//            tr.es-desk-hidden {
//                display: table-row !important
//            }

//            table.es-desk-hidden {
//                display: table !important
//            }

//            td.es-desk-menu-hidden {
//                display: table-cell !important
//            }

//            .es-menu td {
//                width: 1% !important
//            }

//            table.es-table-not-adapt,
//            .esd-block-html table {
//                width: auto !important
//            }

//            table.es-social {
//                display: inline-block !important
//            }

//            table.es-social td {
//                display: inline-block !important
//            }

//            .es-m-p5 {
//                padding: 5px !important
//            }

//            .es-m-p5t {
//                padding-top: 5px !important
//            }

//            .es-m-p5b {
//                padding-bottom: 5px !important
//            }

//            .es-m-p5r {
//                padding-right: 5px !important
//            }

//            .es-m-p5l {
//                padding-left: 5px !important
//            }

//            .es-m-p10 {
//                padding: 10px !important
//            }

//            .es-m-p10t {
//                padding-top: 10px !important
//            }

//            .es-m-p10b {
//                padding-bottom: 10px !important
//            }

//            .es-m-p10r {
//                padding-right: 10px !important
//            }

//            .es-m-p10l {
//                padding-left: 10px !important
//            }

//            .es-m-p15 {
//                padding: 15px !important
//            }

//            .es-m-p15t {
//                padding-top: 15px !important
//            }

//            .es-m-p15b {
//                padding-bottom: 15px !important
//            }

//            .es-m-p15r {
//                padding-right: 15px !important
//            }

//            .es-m-p15l {
//                padding-left: 15px !important
//            }

//            .es-m-p20 {
//                padding: 20px !important
//            }

//            .es-m-p20t {
//                padding-top: 20px !important
//            }

//            .es-m-p20r {
//                padding-right: 20px !important
//            }

//            .es-m-p20l {
//                padding-left: 20px !important
//            }

//            .es-m-p25 {
//                padding: 25px !important
//            }

//            .es-m-p25t {
//                padding-top: 25px !important
//            }

//            .es-m-p25b {
//                padding-bottom: 25px !important
//            }

//            .es-m-p25r {
//                padding-right: 25px !important
//            }

//            .es-m-p25l {
//                padding-left: 25px !important
//            }

//            .es-m-p30 {
//                padding: 30px !important
//            }

//            .es-m-p30t {
//                padding-top: 30px !important
//            }

//            .es-m-p30b {
//                padding-bottom: 30px !important
//            }

//            .es-m-p30r {
//                padding-right: 30px !important
//            }

//            .es-m-p30l {
//                padding-left: 30px !important
//            }

//            .es-m-p35 {
//                padding: 35px !important
//            }

//            .es-m-p35t {
//                padding-top: 35px !important
//            }

//            .es-m-p35b {
//                padding-bottom: 35px !important
//            }

//            .es-m-p35r {
//                padding-right: 35px !important
//            }

//            .es-m-p35l {
//                padding-left: 35px !important
//            }

//            .es-m-p40 {
//                padding: 40px !important
//            }

//            .es-m-p40t {
//                padding-top: 40px !important
//            }

//            .es-m-p40b {
//                padding-bottom: 40px !important
//            }

//            .es-m-p40r {
//                padding-right: 40px !important
//            }

//            .es-m-p40l {
//                padding-left: 40px !important
//            }

//            .m-c-p16r {
//                padding-right: 8vw
//            }

//            .es-desk-hidden {
//                display: table-row !important;
//                width: auto !important;
//                overflow: visible !important;
//                max-height: inherit !important
//            }
//            .store-icons {
//             display: flex;
//             justify-content: space-between;
//             margin-top: 20px;
//         }

//         .store-icon {
//             width: 150px;
//             height: 50px;
//         }
//        }
//    </style>
// </head>

// <body
//    style="width:100%;font-family:'Exo 2', sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
//    <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:aliceblue">
//        <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" src="https://tlr.stripocdn.email/content/guids/CABINET_bf3f28777a864b4fca3f15706a2554aa/images/group_10.png" color="#12022f" origin="0.5, 0" position="0.5, 0"></v:fill> </v:background><![endif]-->
//        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
//           style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;"
//            role="none">
//            <tr>
//                <td valign="top" style="padding:0;Margin:0">
//                    <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
//                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
//                        <tr>
//                            <td class="es-m-p15r es-m-p15l" align="center" style="padding:0;Margin:0">
//                                <table class="es-content-body" align="center" cellpadding="0" cellspacing="0"
//                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:aliceblue;width:640px"
//                                    role="none">
//                                    <tr>
//                                        <td align="left"
//                                            style="padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px">
//                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
//                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                <tr>
//                                                    <td align="center" valign="top"
//                                                        style="padding:0;Margin:0;width:560px">
//                                                        <table cellpadding="0" cellspacing="0" width="100%"
//                                                            role="presentation"
//                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                            <tr class="es-mobile-hidden">
//                                                                <td align="center" height="15"
//                                                                    style="padding:0;Margin:0"></td>
//                                                            </tr>
//                                                        </table>
//                                                    </td>
//                                                </tr>
//                                            </table>
//                                        </td>
//                                    </tr>
//                                    <tr>
//                                        <td class="es-m-p20" align="left" bgcolor="#ffffff"
//                                            style="Margin:0;padding-top:30px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-color:#ffffff;border-radius:20px">
//                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
//                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                <tr>
//                                                    <td align="left" style="padding:0;Margin:0;width:560px">
//                                                        <table cellpadding="0" cellspacing="0" width="100%"
//                                                            role="presentation"
//                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                           
//                                                            {}

//                                                        </table>
//                                                    </td>
//                                                </tr>
//                                            </table>
//                                        </td>
//                                    </tr>
//                                    <tr>
//                                        <td align="left"
//                                            style="padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px">
//                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
//                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                <tr>
//                                                    <td align="center" valign="top"
//                                                        style="padding:0;Margin:0;width:560px">
//                                                        <table cellpadding="0" cellspacing="0" width="100%"
//                                                            role="presentation"
//                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                            <tr class="es-mobile-hidden">
//                                                                <td align="center" height="15"
//                                                                    style="padding:0;Margin:0"></td>
//                                                            </tr>
//                                                        </table>
//                                                    </td>
//                                                </tr>
//                                            </table>
//                                        </td>
//                                    </tr>
//                                </table>
//                            </td>
//                        </tr>
//                    </table>
//                    <table cellpaddding="0" cellspacing="0" class="es-footer" align="center" role="none">
//                        <td >
//                            <div id="m_8098493824779601743wrapper" dir="ltr"
//                                style="margin:0 auto;width:100%;max-width:650px" width="100%">
//                                <table cellpadding="0" style="background-color: rgb(224, 221, 230); border-radius: 20px;" cellspacing="0" height="100%" width="100%">
//                                    <tbody >
//                                        <tr>
//                                            <td align="center" valign="top">
//                                                <div id="m_8098493824779601743template_header_image">
//                                                </div>
//                                                <table border="0" cellpadding="0" cellspacing="0" width="100%"
//                                                    id="m_8098493824779601743template_container"
//                                                    style="background-color:#fff; border-radius:20px !important"
//                                                    bgcolor="#fff">
//                                                    <tbody>
//                                                        <tr>
//                                                            <td align="center" valign="top">

//                                                                <table border="0" cellpadding="0" cellspacing="0"
//                                                                    width="100%"
//                                                                    id="m_8098493824779601743template_header"
//                                                                    style="color:#fff;font-weight:bold;vertical-align:middle;font-family:'Exo 2', sans-serif; border-radius: 20px"
//                                                                    bgcolor="#fff">
//                                                                    <tbody>
//                                                                        <tr>
//                                                                            <td id="m_8098493824779601743header_wrapper"
//                                                                                style="padding:36px 48px;display:block">
//                                                                                <h1 style="font-family:'Exo 2', sans-serif;font-size:30px;font-weight:300;margin:0;text-align:left;color:#636363;background-color:inherit"
//                                                                                    bgcolor="inherit">Thanks for
//                                                                                    shopping with us</h1>
//                                                                            </td>
//                                                                        </tr>
//                                                                    </tbody>
//                                                                </table>

//                                                            </td>
//                                                        </tr>
//                                                        <tr>
//                                                            <td align="center" valign="top">

//                                                                <table border="0" cellpadding="0" cellspacing="0"
//                                                                    width="100%"
//                                                                    id="m_8098493824779601743template_body">
//                                                                    <tbody>
//                                                                        <tr>
//                                                                            <td valign="top"
//                                                                                id="m_8098493824779601743body_content"
//                                                                                style="background-color:#fff;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;"
//                                                                                bgcolor="#fff">

//                                                                                <table border="0" cellpadding="20"
//                                                                                    cellspacing="0" width="100%">
//                                                                                    <tbody>
//                                                                                        <tr>
//                                                                                            <td valign="top"
//                                                                                                style="padding:0px 48px">
//                                                                                                <div id="m_8098493824779601743body_content_inner"
//                                                                                                    style="color:#636363;font-family:'Exo 2', sans-serif;font-size:14px;line-height:150%;text-align:left"
//                                                                                                    align="left">
//                                                                                                    <p
//                                                                                                        style="margin:0 0 16px">
//                                                                                                        Hi ${
//                                                                                                          data.user_name
//                                                                                                        },</p>
//                                                                                                    <p
//                                                                                                        style="margin:0 0 16px">
//                                                                                                        We have finished
//                                                                                                        processing your
//                                                                                                        order.</p>

//                                                                                                    <h2
//                                                                                                        style="display:block;font-family:'Exo 2', sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">
//                                                                                                        [Order #${
//                                                                                                          data.orderId
//                                                                                                        }]
//                                                                                                        (${dateFormater(
//                                                                                                          data.date
//                                                                                                        )})</h2>

//                                                                                                    <div
//                                                                                                        style="margin-bottom:40px">
//                                                                                                        <table
//                                                                                                            cellspacing="0"
//                                                                                                            cellpadding="6"
//                                                                                                            border="1"
//                                                                                                            style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;width:100%;"
//                                                                                                            width="100%">
//                                                                                                            <thead>
//                                                                                                                <tr>
//                                                                                                                    <th scope="col"
//                                                                                                                        style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                        align="left">
//                                                                                                                        Product
//                                                                                                                    </th>
//                                                                                                                    <th scope="col"
//                                                                                                                        style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                        align="left">
//                                                                                                                        Quantity
//                                                                                                                    </th>
//                                                                                                                    <th scope="col"
//                                                                                                                        style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                        align="left">
//                                                                                                                        Price
//                                                                                                                    </th>
//                                                                                                                </tr>
//                                                                                                            </thead>
//                                                                                                            <tbody>
//                                                                                                                ${data.productDetails.map(
//                                                                                                                  (
//                                                                                                                    item
//                                                                                                                  ) => {
//                                                                                                                    const matchingItems =
//                                                                                                                      data1.filter(
//                                                                                                                        (
//                                                                                                                          it
//                                                                                                                        ) =>
//                                                                                                                          item.cardId ===
//                                                                                                                          it.id
//                                                                                                                      );
//                                                                                                                    const cardNames =
//                                                                                                                      matchingItems
//                                                                                                                        .map(
//                                                                                                                          (
//                                                                                                                            it
//                                                                                                                          ) =>
//                                                                                                                            it.card_name
//                                                                                                                        )
//                                                                                                                        .join(
//                                                                                                                          ", "
//                                                                                                                        );
//                                                                                                                    return `<tr>
//                                                                                                                 <td style="color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;word-wrap:break-word"
//                                                                                                                     align="left">
//                                                                                                                     ${cardNames}
//                                                                                                                     <ul
//                                                                                                                         style="font-size:small;margin:1em 0 0;padding:0;list-style:none">
//                                                                                                                         <li
//                                                                                                                             style="margin:.5em 0 0;padding:0">
//                                                                                                                             <strong
//                                                                                                                                 style="float:left;margin-right:.25em;clear:both">Register
//                                                                                                                                 Start
//                                                                                                                                 Date:</strong>
//                                                                                                                             <p style="margin:0">
//                                                                                                                                ${item.registerDate}
//                                                                                                                             </p>
//                                                                                                                         </li>
//                                                                                                                     </ul>
//                                                                                                                 </td>
//                                                                                                                 <td style="color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;"
//                                                                                                                     align="left">
//                                                                                                                     ${item.quantity}
//                                                                                                                 </td>
//                                                                                                                 <td style="color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;"
//                                                                                                                     align="left">
//                                                                                                                     <span><span>$</span>${item.subtotal}</span>
//                                                                                                                     <small>(ex.
//                                                                                                                         tax)</small>
//                                                                                                                 </td>
//                                                                                                             </tr>`;
//                                                                                                                  }
//                                                                                                                )}
//                                                                                                            </tbody>
//                                                                                                            <tfoot>
//                                                                                                                <tr>
//                                                                                                                    <th scope="row"
//                                                                                                                        colspan="2"
//                                                                                                                        style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;border-top-width:4px"
//                                                                                                                        align="left">
//                                                                                                                        Subtotal:
//                                                                                                                    </th>
//                                                                                                                    <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;border-top-width:4px"
//                                                                                                                        align="left">
//                                                                                                                        <span><span>$</span>${
//                                                                                                                          data.sub_total
//                                                                                                                        }</span>
//                                                                                                                        <small>(ex.
//                                                                                                                            tax)</small>
//                                                                                                                    </td>
//                                                                                                                </tr>
//                                                                                                                <tr>
//                                                                                                                    <th scope="row"
//                                                                                                                        colspan="2"
//                                                                                                                        style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                        align="left">
//                                                                                                                        Discount:
//                                                                                                                    </th>
//                                                                                                                    <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                        align="left">
//                                                                                                                        -<span><span>$</span>${
//                                                                                                                          data.discount_amount
//                                                                                                                        }</span>
//                                                                                                                    </td>
//                                                                                                                </tr>
//                                                                                                                <tr>
//                                                                                                                    <th scope="row"
//                                                                                                                        colspan="2"
//                                                                                                                        style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                        align="left">
//                                                                                                                        Shipping:
//                                                                                                                    </th>
//                                                                                                                    <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                        align="left">
//                                                                                                                       ${
//                                                                                                                         data.shipping_type
//                                                                                                                       }
//                                                                                                                    </td>
//                                                                                                                </tr>
//                                                                                                                <tr>
//                                                                                                                <th scope="row"
//                                                                                                                    colspan="2"
//                                                                                                                    style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                    align="left">
//                                                                                                                    Shipping Cost:
//                                                                                                                </th>
//                                                                                                                <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                    align="left">
//                                                                                                                  $${
//                                                                                                                    data.shipping_cost
//                                                                                                                  }
//                                                                                                                </td>
//                                                                                                            </tr>
//                                                                                                                <tr>
//                                                                                                                    <th scope="row"
//                                                                                                                        colspan="2"
//                                                                                                                        style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                        align="left">
//                                                                                                                        Total:
//                                                                                                                    </th>
//                                                                                                                    <td style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left"
//                                                                                                                        align="left">
//                                                                                                                        <span><span>$</span>${
//                                                                                                                          data.totalAmount
//                                                                                                                        }</span>
//                                                                                                                    </td>
//                                                                                                                </tr>
//                                                                                                            </tfoot>
//                                                                                                        </table>
//                                                                                                    </div>

//                                                                                                    <table
//                                                                                                        id="m_8098493824779601743addresses"
//                                                                                                        cellspacing="0"
//                                                                                                        cellpadding="0"
//                                                                                                        border="0"
//                                                                                                        style="width:100%;vertical-align:top;margin-bottom:40px;padding:0"
//                                                                                                        width="100%">
//                                                                                                        <tbody>
//                                                                                                            <tr>
//                                                                                                                <td valign="top"
//                                                                                                                    width="50%"
//                                                                                                                    style="text-align:left;;border:0;padding:0"
//                                                                                                                    align="left">
//                                                                                                                    <h2
//                                                                                                                        style="color:#636363;display:block;font-family:'Exo 2', sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">
//                                                                                                                        Billing
//                                                                                                                        address
//                                                                                                                    </h2>

//                                                                                                                    <address
//                                                                                                                        style="padding:12px;color:#636363;border:1px solid #e5e5e5">
//                                                                                                                       ${
//                                                                                                                         data.address
//                                                                                                                       }
//                                                                                                                        <br><a
//                                                                                                                            href="tel:1234567"
//                                                                                                                            style="color:#636363;font-weight:normal;text-decoration:underline"
//                                                                                                                            target="_blank">1234567</a>
//                                                                                                                        <br><a
//                                                                                                                            href="mailto:webseowiz6@gmail.com"
//                                                                                                                            target="_blank">webseowiz6@gmail.com</a>
//                                                                                                                    </address>
//                                                                                                                </td>
//                                                                                                                <td valign="top"
//                                                                                                                    width="50%"
//                                                                                                                    style="text-align:left;;padding:0"
//                                                                                                                    align="left">
//                                                                                                                    <h2
//                                                                                                                        style="color:#636363;display:block;font-family:'Exo 2', sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">
//                                                                                                                        Shipping
//                                                                                                                        address
//                                                                                                                    </h2>

//                                                                                                                    <address
//                                                                                                                        style="padding:12px;color:#636363;border:1px solid #e5e5e5">
//                                                                                                                       ${
//                                                                                                                         data.shipping_address
//                                                                                                                           ? data.shipping_address
//                                                                                                                           : "Address not found!"
//                                                                                                                       }
//                                                                                                                    </address>
//                                                                                                                </td>
//                                                                                                            </tr>
//                                                                                                        </tbody>
//                                                                                                    </table>
//                                                                                                    <p
//                                                                                                        style="margin:0 0 16px; color:#636363">
//                                                                                                        Thanks for
//                                                                                                        shopping with
//                                                                                                        us.</p>
//                                                                                                    <p
//                                                                                                        style="margin:0 0 16px">
//                                                                                                        Best
//                                                                                                        regards,<br>
//                                                                                                        Taktik
//                                                                                                        Enterprises,
//                                                                                                        Inc.</p>
//                                                                                                </div>
//                                                                                            </td>
//                                                                                        </tr>
//                                                                                        <div ><p style="font-size:10px;text-align:center">Kids Eat Free Card | Copyright 2023 | All Rights Reserved</p></div>
//                                                                                    </tbody>
//                                                                                </table>

//                                                                            </td>
//                                                                        </tr>
//                                                                    </tbody>
//                                                                </table>

//                                                            </td>
//                                                        </tr>
//                                                    </tbody>
//                                                </table>
//                                            </td>
//                                        </tr>
//                                        <tr>
//                                            <td align="center" valign="top">

//                                                <table border="0" cellpadding="10" cellspacing="0" width="100%"
//                                                    id="m_8098493824779601743template_footer">
//                                                    <tbody>
//                                                        <tr>
//                                                            <td valign="top" style="padding:0;border-radius:6px">
//                                                                <table border="0" cellpadding="10" cellspacing="0"
//                                                                    width="100%">
//                                                                    <tbody>
//                                                                        <tr>
//                                                                            <td colspan="2" valign="middle"
//                                                                                id="m_8098493824779601743credit"
//                                                                                style="border-radius:6px;border:0;color:#8a8a8a;font-family:'Exo 2', sans-serif;font-size:12px;line-height:150%;text-align:center;padding:24px 0"
//                                                                                align="center">
//                                                                                <p style="margin:0 0 16px">Taktik
//                                                                                    Enterprises eComm Division<br>Enjoy
//                                                                                    your card</p>
//                                                                            </td>
//                                                                        </tr>
//                                                                    </tbody>
//                                                                </table>
//                                                            </td>
//                                                        </tr>
//                                                    </tbody>
//                                                </table>

//                                            </td>
//                                        </tr>
//                                    </tbody>
//                                </table>
//                            </div>
//                        </td>

//                    </table>
//                </td>

//            </tr>
//        </table>
//    </div>
// </body>

// </html>`,
//     // attachments: [
//     //     {
//     //       filename: 'document.pdf',
//     //       content: attachmentBuffer,
//     //     },
//     //   ],
//     // attachments: [pdfAttachment],
//   };
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error(error);
//       return false;
//     } else {
//       return true;
//     }
//   });
};

export const sendEmailToUserOnCustomCardRegistration = async (data) => {
  // Using a promise to handle the asynchronous nature of the query
  const cards = await queryPromise(sql);
  const users = await queryPromise(sqlUser);
  let cardName;
  cards.map((item) => {
    if (item.id == data.card_id) {
      cardName = item.card_name;
    }
  });
  connection.query(s, [data.filter], (e, r) => {
    if (e) {
      // console.log(e)
      console.error("Error.", e);
      return;
    }
    // console.log('dm',r)
    if (r.length === 0) {
      console.error("No results found in the database.");
      // Handle the case where no results are found
      return;
    }
    const dataN = r[0];

    // Assuming `data.Body` contains the email content
    let content = dataN.Body;
    let subject = dataN.Subject;
    const cardNameRegex = /{{cardName}}/g;
    content = content.replace(cardNameRegex, cardName);
    // Replace other placeholders
    Object.keys(data).forEach((placeholder) => {
        // console.log(placeholder)
        if (placeholder !== 'card_id') {
        const regex = new RegExp(`{{${placeholder}}}`, "g");
        content = content.replace(regex, data[placeholder]);
        }
    });
    // console.log(subject);
    // console.log(content)
    // return
    const mailOptions = {
      to: data.email, // assuming user's email is stored in data.user_email
      subject: `${subject}`,
      html: `<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und"
        style="font-family:'Exo 2', sans-serif">
     <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>New email template 2023-11-21</title>
        <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
     <![endif]--> <!--[if !mso]><!-- -->
        <link
            href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"> <!--<![endif]-->
        <style type="text/css">
            .rollover div {
                font-size: 0;
            }
     
            .rollover:hover .rollover-first {
                max-height: 0px !important;
                display: none !important;
            }
     
            .rollover:hover .rollover-second {
                max-height: none !important;
                display: block !important;
            }
     
            .container-hover:hover>table {
                background: linear-gradient(153.06deg, #7EE8FA -0.31%, #EEC0C6 99.69%) !important;
                transition: 0.3s all !important;
            }
     
            .es-menu.es-table-not-adapt td a:hover,
            a.es-button:hover {
                text-decoration: underline !important;
            }
     
            #outlook a {
                padding: 0;
            }
     
            .es-button {
                mso-style-priority: 100 !important;
                text-decoration: none !important;
            }
     
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
     
            .es-desk-hidden {
                display: none;
                float: left;
                overflow: hidden;
                width: 0;
                max-height: 0;
                line-height: 0;
                mso-hide: all;
            }
     
            @media only screen and (max-width:600px) {
     
                p,
                ul li,
                ol li,
                a {
                    line-height: 150% !important
                }
     
                h1,
                h2,
                h3,
                h1 a,
                h2 a,
                h3 a {
                    line-height: 120% !important
                }
     
                h1 {
                    font-size: 28px !important;
                    text-align: left
                }
     
                h2 {
                    font-size: 24px !important;
                    text-align: left
                }
     
                h3 {
                    font-size: 20px !important;
                    text-align: left
                }
     
                .es-header-body h1 a,
                .es-content-body h1 a,
                .es-footer-body h1 a {
                    font-size: 28px !important;
                    text-align: left
                }
     
                .es-header-body h2 a,
                .es-content-body h2 a,
                .es-footer-body h2 a {
                    font-size: 24px !important;
                    text-align: left
                }
     
                .es-header-body h3 a,
                .es-content-body h3 a,
                .es-footer-body h3 a {
                    font-size: 20px !important;
                    text-align: left
                }
     
                .es-menu td a {
                    font-size: 16px !important
                }
     
                .es-header-body p,
                .es-header-body ul li,
                .es-header-body ol li,
                .es-header-body a {
                    font-size: 16px !important
                }
     
                .es-content-body p,
                .es-content-body ul li,
                .es-content-body ol li,
                .es-content-body a {
                    font-size: 16px !important
                }
     
                .es-footer-body p,
                .es-footer-body ul li,
                .es-footer-body ol li,
                .es-footer-body a {
                    font-size: 16px !important
                }
     
                .es-infoblock p,
                .es-infoblock ul li,
                .es-infoblock ol li,
                .es-infoblock a {
                    font-size: 12px !important
                }
     
                *[class="gmail-fix"] {
                    display: none !important
                }
     
                .es-m-txt-c,
                .es-m-txt-c h1,
                .es-m-txt-c h2,
                .es-m-txt-c h3 {
                    text-align: center !important
                }
     
                .es-m-txt-r,
                .es-m-txt-r h1,
                .es-m-txt-r h2,
                .es-m-txt-r h3 {
                    text-align: right !important
                }
     
                .es-m-txt-l,
                .es-m-txt-l h1,
                .es-m-txt-l h2,
                .es-m-txt-l h3 {
                    text-align: left !important
                }
     
                .es-m-txt-r img,
                .es-m-txt-c img,
                .es-m-txt-l img {
                    display: inline !important
                }
     
                .es-button-border {
                    display: inline-block !important
                }
     
                a.es-button,
                button.es-button {
                    font-size: 20px !important;
                    display: inline-block !important
                }
     
                .es-adaptive table,
                .es-left,
                .es-right {
                    width: 100% !important
                }
     
                .es-content table,
                .es-header table,
                .es-footer table,
                .es-content,
                .es-footer,
                .es-header {
                    width: 100% !important;
                    max-width: 600px !important
                }
     
                .es-adapt-td {
                    display: block !important;
                    width: 100% !important
                }
     
                .adapt-img {
                    width: 100% !important;
                    height: auto !important
                }
     
                .es-m-p0 {
                    padding: 0 !important
                }
     
                .es-m-p0r {
                    padding-right: 0 !important
                }
     
                .es-m-p0l {
                    padding-left: 0 !important
                }
     
                .es-m-p0t {
                    padding-top: 0 !important
                }
     
                .es-m-p0b {
                    padding-bottom: 0 !important
                }
     
                .es-m-p20b {
                    padding-bottom: 20px !important
                }
     
                .es-mobile-hidden,
                .es-hidden {
                    display: none !important
                }
     
                tr.es-desk-hidden,
                td.es-desk-hidden,
                table.es-desk-hidden {
                    width: auto !important;
                    overflow: visible !important;
                    float: none !important;
                    max-height: inherit !important;
                    line-height: inherit !important
                }
     
                tr.es-desk-hidden {
                    display: table-row !important
                }
     
                table.es-desk-hidden {
                    display: table !important
                }
     
                td.es-desk-menu-hidden {
                    display: table-cell !important
                }
     
                .es-menu td {
                    width: 1% !important
                }
     
                table.es-table-not-adapt,
                .esd-block-html table {
                    width: auto !important
                }
     
                table.es-social {
                    display: inline-block !important
                }
     
                table.es-social td {
                    display: inline-block !important
                }
     
                .es-m-p5 {
                    padding: 5px !important
                }
     
                .es-m-p5t {
                    padding-top: 5px !important
                }
     
                .es-m-p5b {
                    padding-bottom: 5px !important
                }
     
                .es-m-p5r {
                    padding-right: 5px !important
                }
     
                .es-m-p5l {
                    padding-left: 5px !important
                }
     
                .es-m-p10 {
                    padding: 10px !important
                }
     
                .es-m-p10t {
                    padding-top: 10px !important
                }
     
                .es-m-p10b {
                    padding-bottom: 10px !important
                }
     
                .es-m-p10r {
                    padding-right: 10px !important
                }
     
                .es-m-p10l {
                    padding-left: 10px !important
                }
     
                .es-m-p15 {
                    padding: 15px !important
                }
     
                .es-m-p15t {
                    padding-top: 15px !important
                }
     
                .es-m-p15b {
                    padding-bottom: 15px !important
                }
     
                .es-m-p15r {
                    padding-right: 15px !important
                }
     
                .es-m-p15l {
                    padding-left: 15px !important
                }
     
                .es-m-p20 {
                    padding: 20px !important
                }
                
             .es-m-p20t {
              padding-top: 20px !important
          }
  
          .es-m-p20r {
              padding-right: 20px !important
          }
  
          .es-m-p20l {
              padding-left: 20px !important
          }
  
          .es-m-p25 {
              padding: 25px !important
          }
  
          .es-m-p25t {
              padding-top: 25px !important
          }
  
          .es-m-p25b {
              padding-bottom: 25px !important
          }
  
          .es-m-p25r {
              padding-right: 25px !important
          }
  
          .es-m-p25l {
              padding-left: 25px !important
          }
  
          .es-m-p30 {
              padding: 30px !important
          }
  
          .es-m-p30t {
              padding-top: 30px !important
          }
  
          .es-m-p30b {
              padding-bottom: 30px !important
          }
  
          .es-m-p30r {
              padding-right: 30px !important
          }
  
          .es-m-p30l {
              padding-left: 30px !important
          }
  
          .es-m-p35 {
              padding: 35px !important
          }
  
          .es-m-p35t {
              padding-top: 35px !important
          }
  
          .es-m-p35b {
              padding-bottom: 35px !important
          }
  
          .es-m-p35r {
              padding-right: 35px !important
          }
  
          .es-m-p35l {
              padding-left: 35px !important
          }
  
          .es-m-p40 {
              padding: 40px !important
          }
  
          .es-m-p40t {
              padding-top: 40px !important
          }
  
          .es-m-p40b {
              padding-bottom: 40px !important
          }
  
          .es-m-p40r {
              padding-right: 40px !important
          }
  
          .es-m-p40l {
              padding-left: 40px !important
          }
  
          .m-c-p16r {
              padding-right: 8vw
          }
  
          .es-desk-hidden {
              display: table-row !important;
              width: auto !important;
              overflow: visible !important;
              max-height: inherit !important
          }
     
            }
        </style>
     </head>
     
     <body
        style="width:100%;font-family:'Exo 2', sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
        <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:aliceblue">
            <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" src="https://tlr.stripocdn.email/content/guids/CABINET_bf3f28777a864b4fca3f15706a2554aa/images/group_10.png" color="#12022f" origin="0.5, 0" position="0.5, 0"></v:fill> </v:background><![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
               style="border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;"
                role="none">
                <tr>
                    <td valign="top" style="padding:0;Margin:0">
                        <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
                            style="border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                            <tr>
                                <td class="es-m-p15r es-m-p15l" align="center" style="padding-bottom:40px;Margin:0">
                                    <table class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                                        style="border-collapse:collapse;border-spacing:0px;background-color:aliceblue;width:640px"
                                        role="none">
                                        <tr>
                                            <td align="left"
                                                style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
                                                <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                    style="border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td align="center" valign="top"
                                                            style="padding:0;Margin:0;width:560px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                role="presentation"
                                                                style="border-collapse:collapse;border-spacing:0px">
                                                                <tr class="es-mobile-hidden">
                                                                    <td align="center" height="15"
                                                                        style="padding:0;Margin:0"></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="es-m-p20" align="left" bgcolor="#ffffff"
                                                style="Margin:0;padding-top:30px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-color:#ffffff;border-radius:20px">
                                                <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                    style="border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td align="left" style="padding:0;Margin:0;width:560px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                role="presentation"
                                                                style="border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                   ${content}
                                                                </tr>
     
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <div ><p style="font-size:10px;text-align:center">Kids Eat Free Card | Copyright 2023 | All Rights Reserved</p></div>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                    </table>
                                </td>
                            </tr>
                        </table>
                      
                    </td>
     
                </tr>
            </table>
        </div>
     </body>
     
     </html>`,
    };
    const transporter = nodemailer.createTransport({
      // configure your email provider here
      service: "gmail",
      auth: {
        user: "webseowiz1@gmail.com",
        pass: "jhss nshv cxnx seay",
      },
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return false;
      } else {
        return true;
      }
    });
    // Now `content` holds the modified email content

    // Proceed with sending the email or storing the content, etc.
  });
//   const transporter = nodemailer.createTransport({
//     // configure your email provider here
//     service: "gmail",
//     auth: {
//       user: "webseowiz1@gmail.com",
//       pass: "jhss nshv cxnx seay",
//     },
//   });
  //   console.log(data)
  // return;
  //   const pdfBuffer = await generatePdf(`<h1>Your HTML Content Goes Here</h1>`, qrCode);

  //   const pdfBuffer = await generatePdf(data)
  //   const pdfAttachment = {
  //     filename: 'buyer_agreement.pdf', // Set a meaningful filename here
  //     content: pdfBuffer,
  //     encoding: 'base64',
  //   };
  //   console.log(data)
//   const mailOptions = {
//     to: data.email, // assuming user's email is stored in data.user_email
//     subject: data.subject,
//     html: `<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und"
//        style="font-family:'Exo 2', sans-serif">
//     <head>
//        <meta charset="UTF-8">
//        <meta content="width=device-width, initial-scale=1" name="viewport">
//        <meta name="x-apple-disable-message-reformatting">
//        <meta http-equiv="X-UA-Compatible" content="IE=edge">
//        <meta content="telephone=no" name="format-detection">
//        <title>New email template 2023-11-21</title>
//        <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
//        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
//     <![endif]--> <!--[if !mso]><!-- -->
//        <link
//            href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
//            rel="stylesheet"> <!--<![endif]-->
//        <style type="text/css">
//            .rollover div {
//                font-size: 0;
//            }
    
//            .rollover:hover .rollover-first {
//                max-height: 0px !important;
//                display: none !important;
//            }
    
//            .rollover:hover .rollover-second {
//                max-height: none !important;
//                display: block !important;
//            }
    
//            .container-hover:hover>table {
//                background: linear-gradient(153.06deg, #7EE8FA -0.31%, #EEC0C6 99.69%) !important;
//                transition: 0.3s all !important;
//            }
    
//            .es-menu.es-table-not-adapt td a:hover,
//            a.es-button:hover {
//                text-decoration: underline !important;
//            }
    
//            #outlook a {
//                padding: 0;
//            }
    
//            .es-button {
//                mso-style-priority: 100 !important;
//                text-decoration: none !important;
//            }
    
//            a[x-apple-data-detectors] {
//                color: inherit !important;
//                text-decoration: none !important;
//                font-size: inherit !important;
//                font-family: inherit !important;
//                font-weight: inherit !important;
//                line-height: inherit !important;
//            }
    
//            .es-desk-hidden {
//                display: none;
//                float: left;
//                overflow: hidden;
//                width: 0;
//                max-height: 0;
//                line-height: 0;
//                mso-hide: all;
//            }
    
//            @media only screen and (max-width:600px) {
    
//                p,
//                ul li,
//                ol li,
//                a {
//                    line-height: 150% !important
//                }
    
//                h1,
//                h2,
//                h3,
//                h1 a,
//                h2 a,
//                h3 a {
//                    line-height: 120% !important
//                }
    
//                h1 {
//                    font-size: 28px !important;
//                    text-align: left
//                }
    
//                h2 {
//                    font-size: 24px !important;
//                    text-align: left
//                }
    
//                h3 {
//                    font-size: 20px !important;
//                    text-align: left
//                }
    
//                .es-header-body h1 a,
//                .es-content-body h1 a,
//                .es-footer-body h1 a {
//                    font-size: 28px !important;
//                    text-align: left
//                }
    
//                .es-header-body h2 a,
//                .es-content-body h2 a,
//                .es-footer-body h2 a {
//                    font-size: 24px !important;
//                    text-align: left
//                }
    
//                .es-header-body h3 a,
//                .es-content-body h3 a,
//                .es-footer-body h3 a {
//                    font-size: 20px !important;
//                    text-align: left
//                }
    
//                .es-menu td a {
//                    font-size: 16px !important
//                }
    
//                .es-header-body p,
//                .es-header-body ul li,
//                .es-header-body ol li,
//                .es-header-body a {
//                    font-size: 16px !important
//                }
    
//                .es-content-body p,
//                .es-content-body ul li,
//                .es-content-body ol li,
//                .es-content-body a {
//                    font-size: 16px !important
//                }
    
//                .es-footer-body p,
//                .es-footer-body ul li,
//                .es-footer-body ol li,
//                .es-footer-body a {
//                    font-size: 16px !important
//                }
    
//                .es-infoblock p,
//                .es-infoblock ul li,
//                .es-infoblock ol li,
//                .es-infoblock a {
//                    font-size: 12px !important
//                }
    
//                *[class="gmail-fix"] {
//                    display: none !important
//                }
    
//                .es-m-txt-c,
//                .es-m-txt-c h1,
//                .es-m-txt-c h2,
//                .es-m-txt-c h3 {
//                    text-align: center !important
//                }
    
//                .es-m-txt-r,
//                .es-m-txt-r h1,
//                .es-m-txt-r h2,
//                .es-m-txt-r h3 {
//                    text-align: right !important
//                }
    
//                .es-m-txt-l,
//                .es-m-txt-l h1,
//                .es-m-txt-l h2,
//                .es-m-txt-l h3 {
//                    text-align: left !important
//                }
    
//                .es-m-txt-r img,
//                .es-m-txt-c img,
//                .es-m-txt-l img {
//                    display: inline !important
//                }
    
//                .es-button-border {
//                    display: inline-block !important
//                }
    
//                a.es-button,
//                button.es-button {
//                    font-size: 20px !important;
//                    display: inline-block !important
//                }
    
//                .es-adaptive table,
//                .es-left,
//                .es-right {
//                    width: 100% !important
//                }
    
//                .es-content table,
//                .es-header table,
//                .es-footer table,
//                .es-content,
//                .es-footer,
//                .es-header {
//                    width: 100% !important;
//                    max-width: 600px !important
//                }
    
//                .es-adapt-td {
//                    display: block !important;
//                    width: 100% !important
//                }
    
//                .adapt-img {
//                    width: 100% !important;
//                    height: auto !important
//                }
    
//                .es-m-p0 {
//                    padding: 0 !important
//                }
    
//                .es-m-p0r {
//                    padding-right: 0 !important
//                }
    
//                .es-m-p0l {
//                    padding-left: 0 !important
//                }
    
//                .es-m-p0t {
//                    padding-top: 0 !important
//                }
    
//                .es-m-p0b {
//                    padding-bottom: 0 !important
//                }
    
//                .es-m-p20b {
//                    padding-bottom: 20px !important
//                }
    
//                .es-mobile-hidden,
//                .es-hidden {
//                    display: none !important
//                }
    
//                tr.es-desk-hidden,
//                td.es-desk-hidden,
//                table.es-desk-hidden {
//                    width: auto !important;
//                    overflow: visible !important;
//                    float: none !important;
//                    max-height: inherit !important;
//                    line-height: inherit !important
//                }
    
//                tr.es-desk-hidden {
//                    display: table-row !important
//                }
    
//                table.es-desk-hidden {
//                    display: table !important
//                }
    
//                td.es-desk-menu-hidden {
//                    display: table-cell !important
//                }
    
//                .es-menu td {
//                    width: 1% !important
//                }
    
//                table.es-table-not-adapt,
//                .esd-block-html table {
//                    width: auto !important
//                }
    
//                table.es-social {
//                    display: inline-block !important
//                }
    
//                table.es-social td {
//                    display: inline-block !important
//                }
    
//                .es-m-p5 {
//                    padding: 5px !important
//                }
    
//                .es-m-p5t {
//                    padding-top: 5px !important
//                }
    
//                .es-m-p5b {
//                    padding-bottom: 5px !important
//                }
    
//                .es-m-p5r {
//                    padding-right: 5px !important
//                }
    
//                .es-m-p5l {
//                    padding-left: 5px !important
//                }
    
//                .es-m-p10 {
//                    padding: 10px !important
//                }
    
//                .es-m-p10t {
//                    padding-top: 10px !important
//                }
    
//                .es-m-p10b {
//                    padding-bottom: 10px !important
//                }
    
//                .es-m-p10r {
//                    padding-right: 10px !important
//                }
    
//                .es-m-p10l {
//                    padding-left: 10px !important
//                }
    
//                .es-m-p15 {
//                    padding: 15px !important
//                }
    
//                .es-m-p15t {
//                    padding-top: 15px !important
//                }
    
//                .es-m-p15b {
//                    padding-bottom: 15px !important
//                }
    
//                .es-m-p15r {
//                    padding-right: 15px !important
//                }
    
//                .es-m-p15l {
//                    padding-left: 15px !important
//                }
    
//                .es-m-p20 {
//                    padding: 20px !important
//                }
               
//             .es-m-p20t {
//              padding-top: 20px !important
//          }
 
//          .es-m-p20r {
//              padding-right: 20px !important
//          }
 
//          .es-m-p20l {
//              padding-left: 20px !important
//          }
 
//          .es-m-p25 {
//              padding: 25px !important
//          }
 
//          .es-m-p25t {
//              padding-top: 25px !important
//          }
 
//          .es-m-p25b {
//              padding-bottom: 25px !important
//          }
 
//          .es-m-p25r {
//              padding-right: 25px !important
//          }
 
//          .es-m-p25l {
//              padding-left: 25px !important
//          }
 
//          .es-m-p30 {
//              padding: 30px !important
//          }
 
//          .es-m-p30t {
//              padding-top: 30px !important
//          }
 
//          .es-m-p30b {
//              padding-bottom: 30px !important
//          }
 
//          .es-m-p30r {
//              padding-right: 30px !important
//          }
 
//          .es-m-p30l {
//              padding-left: 30px !important
//          }
 
//          .es-m-p35 {
//              padding: 35px !important
//          }
 
//          .es-m-p35t {
//              padding-top: 35px !important
//          }
 
//          .es-m-p35b {
//              padding-bottom: 35px !important
//          }
 
//          .es-m-p35r {
//              padding-right: 35px !important
//          }
 
//          .es-m-p35l {
//              padding-left: 35px !important
//          }
 
//          .es-m-p40 {
//              padding: 40px !important
//          }
 
//          .es-m-p40t {
//              padding-top: 40px !important
//          }
 
//          .es-m-p40b {
//              padding-bottom: 40px !important
//          }
 
//          .es-m-p40r {
//              padding-right: 40px !important
//          }
 
//          .es-m-p40l {
//              padding-left: 40px !important
//          }
 
//          .m-c-p16r {
//              padding-right: 8vw
//          }
 
//          .es-desk-hidden {
//              display: table-row !important;
//              width: auto !important;
//              overflow: visible !important;
//              max-height: inherit !important
//          }
    
//            }
//        </style>
//     </head>
    
//     <body
//        style="width:100%;font-family:'Exo 2', sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
//        <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:aliceblue">
//            <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" src="https://tlr.stripocdn.email/content/guids/CABINET_bf3f28777a864b4fca3f15706a2554aa/images/group_10.png" color="#12022f" origin="0.5, 0" position="0.5, 0"></v:fill> </v:background><![endif]-->
//            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
//                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
//                        <tr>
//                            <td class="es-m-p15r es-m-p15l" align="center" style="padding:0;Margin:0">
//                                <table class="es-content-body" align="center" cellpadding="0" cellspacing="0"
//                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:aliceblue;width:640px"
//                                    role="none">
//                                    <tr>
//                                        <td align="left"
//                                            style="padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px">
//                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
//                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                <tr>
//                                                    <td align="center" valign="top"
//                                                        style="padding:0;Margin:0;width:560px">
//                                                        <table cellpadding="0" cellspacing="0" width="100%"
//                                                            role="presentation"
//                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                            <tr class="es-mobile-hidden">
//                                                                <td align="center" height="15"
//                                                                    style="padding:0;Margin:0"></td>
//                                                            </tr>
//                                                        </table>
//                                                    </td>
//                                                </tr>
//                                            </table>
//                                        </td>
//                                    </tr>
//                                    <tr>
//                                        <td class="es-m-p20" align="left" bgcolor="#ffffff"
//                                            style="Margin:0;padding-top:30px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-color:#ffffff;border-radius:20px">
//                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
//                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                <tr>
//                                                    <td align="left" style="padding:0;Margin:0;width:560px">
//                                                        <table cellpadding="0" cellspacing="0" width="100%"
//                                                            role="presentation"
//                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                            <tr>
                                                               
//                                                            </tr>
//                                                         <div ><p style="font-size:10px;text-align:center">Kids Eat Free Card | Copyright 2023 | All Rights Reserved</p></div>
//                                                        </table>
//                                                    </td>
//                                                </tr>
//                                            </table>
//                                        </td>
//                                    </tr>
//                                    <tr>
//                                        <td align="left"
//                                            style="padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px">
//                                            <table cellpadding="0" cellspacing="0" width="100%" role="none"
//                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                <tr>
//                                                    <td align="center" valign="top"
//                                                        style="padding:0;Margin:0;width:560px">
//                                                        <table cellpadding="0" cellspacing="0" width="100%"
//                                                            role="presentation"
//                                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
//                                                            <tr class="es-mobile-hidden">
//                                                                <td align="center" height="15"
//                                                                    style="padding:0;Margin:0"></td>
//                                                            </tr>
//                                                        </table>
//                                                    </td>
//                                                </tr>
//                                            </table>
//                                        </td>
//                                    </tr>
//                                </table>
//                            </td>
//                        </tr>
//                    </table>
//        </div>
//     </body>
    
//     </html>`,
//     // attachments: [
//     //     {
//     //       filename: 'document.pdf',
//     //       content: attachmentBuffer,
//     //     },
//     //   ],
//     // attachments: [pdfAttachment],
//   };
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error(error);
//       return false;
//     } else {
//       return true;
//     }
//   });
};

export const sendEmailToUserForDownloadMobileApp = (data) => {
  const transporter = nodemailer.createTransport({
    // configure your email provider here
    service: "gmail",
    auth: {
      user: "webseowiz1@gmail.com",
      pass: "jhss nshv cxnx seay",
    },
  });

  const mailOptions = {
    to: data.email, // assuming user's email is stored in data.user_email
    subject: `Invitation email to download Mobile Application`,
    html: ``,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return false;
    } else {
      return true;
    }
  });
};

export const passwordResetEmail = (data) => {
  const transporter = nodemailer.createTransport({
    // configure your email provider here
    service: "gmail",
    auth: {
      user: "webseowiz1@gmail.com",
      pass: "jhss nshv cxnx seay",
    },
  });

  const mailOptions = {
    to: data.email, // assuming user's email is stored in data.user_email
    subject: `Invitation email to download Mobile Application`,
    html: ``,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return false;
    } else {
      return true;
    }
  });
};

export const redeemEmail = (data) => {

  connection.query(s, [data.filter], (e, r) => {
    if (e) {
      // console.log(e)
      console.error("Error.", e);
      return;
    }
    // console.log('dm',r)
    if (r.length === 0) {
      console.error("No results found in the database.");
      // Handle the case where no results are found
      return;
    }
    const dataN = r[0];

    // Assuming `data.Body` contains the email content
    let content = dataN.Body;
    let subject = dataN.Subject;
    Object.keys(data).forEach((placeholder) => {
      // console.log(placeholder)
      const regex = new RegExp(`{{${placeholder}}}`, "g");
      //   console.log(regex);
      if (placeholder) {
        // subject =
        content = content.replace(regex, data[placeholder]);
      }
    });
    const mailOptions = {
      to: data.email, // assuming user's email is stored in data.user_email
      subject: `${subject} at ${data.resturant_name}`,
      html: `<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und"
        style="font-family:'Exo 2', sans-serif">
     <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>New email template 2023-11-21</title>
        <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
     <![endif]--> <!--[if !mso]><!-- -->
        <link
            href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"> <!--<![endif]-->
        <style type="text/css">
            .rollover div {
                font-size: 0;
            }
     
            .rollover:hover .rollover-first {
                max-height: 0px !important;
                display: none !important;
            }
     
            .rollover:hover .rollover-second {
                max-height: none !important;
                display: block !important;
            }
     
            .container-hover:hover>table {
                background: linear-gradient(153.06deg, #7EE8FA -0.31%, #EEC0C6 99.69%) !important;
                transition: 0.3s all !important;
            }
     
            .es-menu.es-table-not-adapt td a:hover,
            a.es-button:hover {
                text-decoration: underline !important;
            }
     
            #outlook a {
                padding: 0;
            }
     
            .es-button {
                mso-style-priority: 100 !important;
                text-decoration: none !important;
            }
     
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
     
            .es-desk-hidden {
                display: none;
                float: left;
                overflow: hidden;
                width: 0;
                max-height: 0;
                line-height: 0;
                mso-hide: all;
            }
     
            @media only screen and (max-width:600px) {
     
                p,
                ul li,
                ol li,
                a {
                    line-height: 150% !important
                }
     
                h1,
                h2,
                h3,
                h1 a,
                h2 a,
                h3 a {
                    line-height: 120% !important
                }
     
                h1 {
                    font-size: 28px !important;
                    text-align: left
                }
     
                h2 {
                    font-size: 24px !important;
                    text-align: left
                }
     
                h3 {
                    font-size: 20px !important;
                    text-align: left
                }
     
                .es-header-body h1 a,
                .es-content-body h1 a,
                .es-footer-body h1 a {
                    font-size: 28px !important;
                    text-align: left
                }
     
                .es-header-body h2 a,
                .es-content-body h2 a,
                .es-footer-body h2 a {
                    font-size: 24px !important;
                    text-align: left
                }
     
                .es-header-body h3 a,
                .es-content-body h3 a,
                .es-footer-body h3 a {
                    font-size: 20px !important;
                    text-align: left
                }
     
                .es-menu td a {
                    font-size: 16px !important
                }
     
                .es-header-body p,
                .es-header-body ul li,
                .es-header-body ol li,
                .es-header-body a {
                    font-size: 16px !important
                }
     
                .es-content-body p,
                .es-content-body ul li,
                .es-content-body ol li,
                .es-content-body a {
                    font-size: 16px !important
                }
     
                .es-footer-body p,
                .es-footer-body ul li,
                .es-footer-body ol li,
                .es-footer-body a {
                    font-size: 16px !important
                }
     
                .es-infoblock p,
                .es-infoblock ul li,
                .es-infoblock ol li,
                .es-infoblock a {
                    font-size: 12px !important
                }
     
                *[class="gmail-fix"] {
                    display: none !important
                }
     
                .es-m-txt-c,
                .es-m-txt-c h1,
                .es-m-txt-c h2,
                .es-m-txt-c h3 {
                    text-align: center !important
                }
     
                .es-m-txt-r,
                .es-m-txt-r h1,
                .es-m-txt-r h2,
                .es-m-txt-r h3 {
                    text-align: right !important
                }
     
                .es-m-txt-l,
                .es-m-txt-l h1,
                .es-m-txt-l h2,
                .es-m-txt-l h3 {
                    text-align: left !important
                }
     
                .es-m-txt-r img,
                .es-m-txt-c img,
                .es-m-txt-l img {
                    display: inline !important
                }
     
                .es-button-border {
                    display: inline-block !important
                }
     
                a.es-button,
                button.es-button {
                    font-size: 20px !important;
                    display: inline-block !important
                }
     
                .es-adaptive table,
                .es-left,
                .es-right {
                    width: 100% !important
                }
     
                .es-content table,
                .es-header table,
                .es-footer table,
                .es-content,
                .es-footer,
                .es-header {
                    width: 100% !important;
                    max-width: 600px !important
                }
     
                .es-adapt-td {
                    display: block !important;
                    width: 100% !important
                }
     
                .adapt-img {
                    width: 100% !important;
                    height: auto !important
                }
     
                .es-m-p0 {
                    padding: 0 !important
                }
     
                .es-m-p0r {
                    padding-right: 0 !important
                }
     
                .es-m-p0l {
                    padding-left: 0 !important
                }
     
                .es-m-p0t {
                    padding-top: 0 !important
                }
     
                .es-m-p0b {
                    padding-bottom: 0 !important
                }
     
                .es-m-p20b {
                    padding-bottom: 20px !important
                }
     
                .es-mobile-hidden,
                .es-hidden {
                    display: none !important
                }
     
                tr.es-desk-hidden,
                td.es-desk-hidden,
                table.es-desk-hidden {
                    width: auto !important;
                    overflow: visible !important;
                    float: none !important;
                    max-height: inherit !important;
                    line-height: inherit !important
                }
     
                tr.es-desk-hidden {
                    display: table-row !important
                }
     
                table.es-desk-hidden {
                    display: table !important
                }
     
                td.es-desk-menu-hidden {
                    display: table-cell !important
                }
     
                .es-menu td {
                    width: 1% !important
                }
     
                table.es-table-not-adapt,
                .esd-block-html table {
                    width: auto !important
                }
     
                table.es-social {
                    display: inline-block !important
                }
     
                table.es-social td {
                    display: inline-block !important
                }
     
                .es-m-p5 {
                    padding: 5px !important
                }
     
                .es-m-p5t {
                    padding-top: 5px !important
                }
     
                .es-m-p5b {
                    padding-bottom: 5px !important
                }
     
                .es-m-p5r {
                    padding-right: 5px !important
                }
     
                .es-m-p5l {
                    padding-left: 5px !important
                }
     
                .es-m-p10 {
                    padding: 10px !important
                }
     
                .es-m-p10t {
                    padding-top: 10px !important
                }
     
                .es-m-p10b {
                    padding-bottom: 10px !important
                }
     
                .es-m-p10r {
                    padding-right: 10px !important
                }
     
                .es-m-p10l {
                    padding-left: 10px !important
                }
     
                .es-m-p15 {
                    padding: 15px !important
                }
     
                .es-m-p15t {
                    padding-top: 15px !important
                }
     
                .es-m-p15b {
                    padding-bottom: 15px !important
                }
     
                .es-m-p15r {
                    padding-right: 15px !important
                }
     
                .es-m-p15l {
                    padding-left: 15px !important
                }
     
                .es-m-p20 {
                    padding: 20px !important
                }
                
             .es-m-p20t {
              padding-top: 20px !important
          }
  
          .es-m-p20r {
              padding-right: 20px !important
          }
  
          .es-m-p20l {
              padding-left: 20px !important
          }
  
          .es-m-p25 {
              padding: 25px !important
          }
  
          .es-m-p25t {
              padding-top: 25px !important
          }
  
          .es-m-p25b {
              padding-bottom: 25px !important
          }
  
          .es-m-p25r {
              padding-right: 25px !important
          }
  
          .es-m-p25l {
              padding-left: 25px !important
          }
  
          .es-m-p30 {
              padding: 30px !important
          }
  
          .es-m-p30t {
              padding-top: 30px !important
          }
  
          .es-m-p30b {
              padding-bottom: 30px !important
          }
  
          .es-m-p30r {
              padding-right: 30px !important
          }
  
          .es-m-p30l {
              padding-left: 30px !important
          }
  
          .es-m-p35 {
              padding: 35px !important
          }
  
          .es-m-p35t {
              padding-top: 35px !important
          }
  
          .es-m-p35b {
              padding-bottom: 35px !important
          }
  
          .es-m-p35r {
              padding-right: 35px !important
          }
  
          .es-m-p35l {
              padding-left: 35px !important
          }
  
          .es-m-p40 {
              padding: 40px !important
          }
  
          .es-m-p40t {
              padding-top: 40px !important
          }
  
          .es-m-p40b {
              padding-bottom: 40px !important
          }
  
          .es-m-p40r {
              padding-right: 40px !important
          }
  
          .es-m-p40l {
              padding-left: 40px !important
          }
  
          .m-c-p16r {
              padding-right: 8vw
          }
  
          .es-desk-hidden {
              display: table-row !important;
              width: auto !important;
              overflow: visible !important;
              max-height: inherit !important
          }
     
            }
        </style>
     </head>
     
     <body
        style="width:100%;font-family:'Exo 2', sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
        <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:aliceblue">
            <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" src="https://tlr.stripocdn.email/content/guids/CABINET_bf3f28777a864b4fca3f15706a2554aa/images/group_10.png" color="#12022f" origin="0.5, 0" position="0.5, 0"></v:fill> </v:background><![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
               style="border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;"
                role="none">
                <tr>
                    <td valign="top" style="padding:0;Margin:0">
                        <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
                            style="border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                            <tr>
                                <td class="es-m-p15r es-m-p15l" align="center" style="padding-bottom:40px;Margin:0">
                                    <table class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                                        style="border-collapse:collapse;border-spacing:0px;background-color:aliceblue;width:640px"
                                        role="none">
                                        <tr>
                                            <td align="left"
                                                style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
                                                <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                    style="border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td align="center" valign="top"
                                                            style="padding:0;Margin:0;width:560px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                role="presentation"
                                                                style="border-collapse:collapse;border-spacing:0px">
                                                                <tr class="es-mobile-hidden">
                                                                    <td align="center" height="15"
                                                                        style="padding:0;Margin:0"></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="es-m-p20" align="left" bgcolor="#ffffff"
                                                style="Margin:0;padding-top:30px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-color:#ffffff;border-radius:20px">
                                                <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                    style="border-collapse:collapse;border-spacing:0px">
                                                    <tr>
                                                        <td align="left" style="padding:0;Margin:0;width:560px">
                                                            <table cellpadding="0" cellspacing="0" width="100%"
                                                                role="presentation"
                                                                style="border-collapse:collapse;border-spacing:0px">
                                                                <tr>
                                                                   ${content}
                                                                </tr>
     
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <div ><p style="font-size:10px;text-align:center">Kids Eat Free Card | Copyright 2023 | All Rights Reserved</p></div>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                    </table>
                                </td>
                            </tr>
                        </table>
                      
                    </td>
     
                </tr>
            </table>
        </div>
     </body>
     
     </html>`,
    };
    const transporter = nodemailer.createTransport({
      // configure your email provider here
      service: "gmail",
      auth: {
        user: "webseowiz1@gmail.com",
        pass: "jhss nshv cxnx seay",
      },
    });
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return false;
      } else {
        return true;
      }
    });
    // Now `content` holds the modified email content

    // Proceed with sending the email or storing the content, etc.
  });
  // return;

  // const transporter = nodemailer.createTransport({
  //   // configure your email provider here
  //   service: 'gmail',
  //   auth: {
  //     user: 'webseowiz1@gmail.com',
  //     pass: 'jhss nshv cxnx seay',
  //   },
  // });
  //     const mailOptions = {
  //       to: data.email, // assuming user's email is stored in data.user_email
  //       subject: `Offer Redeemed at ${data.resturant_name}`,
  //       html: `<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und"
  //       style="font-family:'Exo 2', sans-serif">
  //    <head>
  //       <meta charset="UTF-8">
  //       <meta content="width=device-width, initial-scale=1" name="viewport">
  //       <meta name="x-apple-disable-message-reformatting">
  //       <meta http-equiv="X-UA-Compatible" content="IE=edge">
  //       <meta content="telephone=no" name="format-detection">
  //       <title>New email template 2023-11-21</title>
  //       <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
  //       <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
  //    <![endif]--> <!--[if !mso]><!-- -->
  //       <link
  //           href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
  //           rel="stylesheet"> <!--<![endif]-->
  //       <style type="text/css">
  //           .rollover div {
  //               font-size: 0;
  //           }

  //           .rollover:hover .rollover-first {
  //               max-height: 0px !important;
  //               display: none !important;
  //           }

  //           .rollover:hover .rollover-second {
  //               max-height: none !important;
  //               display: block !important;
  //           }

  //           .container-hover:hover>table {
  //               background: linear-gradient(153.06deg, #7EE8FA -0.31%, #EEC0C6 99.69%) !important;
  //               transition: 0.3s all !important;
  //           }

  //           .es-menu.es-table-not-adapt td a:hover,
  //           a.es-button:hover {
  //               text-decoration: underline !important;
  //           }

  //           #outlook a {
  //               padding: 0;
  //           }

  //           .es-button {
  //               mso-style-priority: 100 !important;
  //               text-decoration: none !important;
  //           }

  //           a[x-apple-data-detectors] {
  //               color: inherit !important;
  //               text-decoration: none !important;
  //               font-size: inherit !important;
  //               font-family: inherit !important;
  //               font-weight: inherit !important;
  //               line-height: inherit !important;
  //           }

  //           .es-desk-hidden {
  //               display: none;
  //               float: left;
  //               overflow: hidden;
  //               width: 0;
  //               max-height: 0;
  //               line-height: 0;
  //               mso-hide: all;
  //           }

  //           @media only screen and (max-width:600px) {

  //               p,
  //               ul li,
  //               ol li,
  //               a {
  //                   line-height: 150% !important
  //               }

  //               h1,
  //               h2,
  //               h3,
  //               h1 a,
  //               h2 a,
  //               h3 a {
  //                   line-height: 120% !important
  //               }

  //               h1 {
  //                   font-size: 28px !important;
  //                   text-align: left
  //               }

  //               h2 {
  //                   font-size: 24px !important;
  //                   text-align: left
  //               }

  //               h3 {
  //                   font-size: 20px !important;
  //                   text-align: left
  //               }

  //               .es-header-body h1 a,
  //               .es-content-body h1 a,
  //               .es-footer-body h1 a {
  //                   font-size: 28px !important;
  //                   text-align: left
  //               }

  //               .es-header-body h2 a,
  //               .es-content-body h2 a,
  //               .es-footer-body h2 a {
  //                   font-size: 24px !important;
  //                   text-align: left
  //               }

  //               .es-header-body h3 a,
  //               .es-content-body h3 a,
  //               .es-footer-body h3 a {
  //                   font-size: 20px !important;
  //                   text-align: left
  //               }

  //               .es-menu td a {
  //                   font-size: 16px !important
  //               }

  //               .es-header-body p,
  //               .es-header-body ul li,
  //               .es-header-body ol li,
  //               .es-header-body a {
  //                   font-size: 16px !important
  //               }

  //               .es-content-body p,
  //               .es-content-body ul li,
  //               .es-content-body ol li,
  //               .es-content-body a {
  //                   font-size: 16px !important
  //               }

  //               .es-footer-body p,
  //               .es-footer-body ul li,
  //               .es-footer-body ol li,
  //               .es-footer-body a {
  //                   font-size: 16px !important
  //               }

  //               .es-infoblock p,
  //               .es-infoblock ul li,
  //               .es-infoblock ol li,
  //               .es-infoblock a {
  //                   font-size: 12px !important
  //               }

  //               *[class="gmail-fix"] {
  //                   display: none !important
  //               }

  //               .es-m-txt-c,
  //               .es-m-txt-c h1,
  //               .es-m-txt-c h2,
  //               .es-m-txt-c h3 {
  //                   text-align: center !important
  //               }

  //               .es-m-txt-r,
  //               .es-m-txt-r h1,
  //               .es-m-txt-r h2,
  //               .es-m-txt-r h3 {
  //                   text-align: right !important
  //               }

  //               .es-m-txt-l,
  //               .es-m-txt-l h1,
  //               .es-m-txt-l h2,
  //               .es-m-txt-l h3 {
  //                   text-align: left !important
  //               }

  //               .es-m-txt-r img,
  //               .es-m-txt-c img,
  //               .es-m-txt-l img {
  //                   display: inline !important
  //               }

  //               .es-button-border {
  //                   display: inline-block !important
  //               }

  //               a.es-button,
  //               button.es-button {
  //                   font-size: 20px !important;
  //                   display: inline-block !important
  //               }

  //               .es-adaptive table,
  //               .es-left,
  //               .es-right {
  //                   width: 100% !important
  //               }

  //               .es-content table,
  //               .es-header table,
  //               .es-footer table,
  //               .es-content,
  //               .es-footer,
  //               .es-header {
  //                   width: 100% !important;
  //                   max-width: 600px !important
  //               }

  //               .es-adapt-td {
  //                   display: block !important;
  //                   width: 100% !important
  //               }

  //               .adapt-img {
  //                   width: 100% !important;
  //                   height: auto !important
  //               }

  //               .es-m-p0 {
  //                   padding: 0 !important
  //               }

  //               .es-m-p0r {
  //                   padding-right: 0 !important
  //               }

  //               .es-m-p0l {
  //                   padding-left: 0 !important
  //               }

  //               .es-m-p0t {
  //                   padding-top: 0 !important
  //               }

  //               .es-m-p0b {
  //                   padding-bottom: 0 !important
  //               }

  //               .es-m-p20b {
  //                   padding-bottom: 20px !important
  //               }

  //               .es-mobile-hidden,
  //               .es-hidden {
  //                   display: none !important
  //               }

  //               tr.es-desk-hidden,
  //               td.es-desk-hidden,
  //               table.es-desk-hidden {
  //                   width: auto !important;
  //                   overflow: visible !important;
  //                   float: none !important;
  //                   max-height: inherit !important;
  //                   line-height: inherit !important
  //               }

  //               tr.es-desk-hidden {
  //                   display: table-row !important
  //               }

  //               table.es-desk-hidden {
  //                   display: table !important
  //               }

  //               td.es-desk-menu-hidden {
  //                   display: table-cell !important
  //               }

  //               .es-menu td {
  //                   width: 1% !important
  //               }

  //               table.es-table-not-adapt,
  //               .esd-block-html table {
  //                   width: auto !important
  //               }

  //               table.es-social {
  //                   display: inline-block !important
  //               }

  //               table.es-social td {
  //                   display: inline-block !important
  //               }

  //               .es-m-p5 {
  //                   padding: 5px !important
  //               }

  //               .es-m-p5t {
  //                   padding-top: 5px !important
  //               }

  //               .es-m-p5b {
  //                   padding-bottom: 5px !important
  //               }

  //               .es-m-p5r {
  //                   padding-right: 5px !important
  //               }

  //               .es-m-p5l {
  //                   padding-left: 5px !important
  //               }

  //               .es-m-p10 {
  //                   padding: 10px !important
  //               }

  //               .es-m-p10t {
  //                   padding-top: 10px !important
  //               }

  //               .es-m-p10b {
  //                   padding-bottom: 10px !important
  //               }

  //               .es-m-p10r {
  //                   padding-right: 10px !important
  //               }

  //               .es-m-p10l {
  //                   padding-left: 10px !important
  //               }

  //               .es-m-p15 {
  //                   padding: 15px !important
  //               }

  //               .es-m-p15t {
  //                   padding-top: 15px !important
  //               }

  //               .es-m-p15b {
  //                   padding-bottom: 15px !important
  //               }

  //               .es-m-p15r {
  //                   padding-right: 15px !important
  //               }

  //               .es-m-p15l {
  //                   padding-left: 15px !important
  //               }

  //               .es-m-p20 {
  //                   padding: 20px !important
  //               }

  //            .es-m-p20t {
  //             padding-top: 20px !important
  //         }

  //         .es-m-p20r {
  //             padding-right: 20px !important
  //         }

  //         .es-m-p20l {
  //             padding-left: 20px !important
  //         }

  //         .es-m-p25 {
  //             padding: 25px !important
  //         }

  //         .es-m-p25t {
  //             padding-top: 25px !important
  //         }

  //         .es-m-p25b {
  //             padding-bottom: 25px !important
  //         }

  //         .es-m-p25r {
  //             padding-right: 25px !important
  //         }

  //         .es-m-p25l {
  //             padding-left: 25px !important
  //         }

  //         .es-m-p30 {
  //             padding: 30px !important
  //         }

  //         .es-m-p30t {
  //             padding-top: 30px !important
  //         }

  //         .es-m-p30b {
  //             padding-bottom: 30px !important
  //         }

  //         .es-m-p30r {
  //             padding-right: 30px !important
  //         }

  //         .es-m-p30l {
  //             padding-left: 30px !important
  //         }

  //         .es-m-p35 {
  //             padding: 35px !important
  //         }

  //         .es-m-p35t {
  //             padding-top: 35px !important
  //         }

  //         .es-m-p35b {
  //             padding-bottom: 35px !important
  //         }

  //         .es-m-p35r {
  //             padding-right: 35px !important
  //         }

  //         .es-m-p35l {
  //             padding-left: 35px !important
  //         }

  //         .es-m-p40 {
  //             padding: 40px !important
  //         }

  //         .es-m-p40t {
  //             padding-top: 40px !important
  //         }

  //         .es-m-p40b {
  //             padding-bottom: 40px !important
  //         }

  //         .es-m-p40r {
  //             padding-right: 40px !important
  //         }

  //         .es-m-p40l {
  //             padding-left: 40px !important
  //         }

  //         .m-c-p16r {
  //             padding-right: 8vw
  //         }

  //         .es-desk-hidden {
  //             display: table-row !important;
  //             width: auto !important;
  //             overflow: visible !important;
  //             max-height: inherit !important
  //         }

  //           }
  //       </style>
  //    </head>

  //    <body
  //       style="width:100%;font-family:'Exo 2', sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  //       <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:aliceblue">
  //           <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" src="https://tlr.stripocdn.email/content/guids/CABINET_bf3f28777a864b4fca3f15706a2554aa/images/group_10.png" color="#12022f" origin="0.5, 0" position="0.5, 0"></v:fill> </v:background><![endif]-->
  //           <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
  //              style="border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;"
  //               role="none">
  //               <tr>
  //                   <td valign="top" style="padding:0;Margin:0">
  //                       <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
  //                           style="border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
  //                           <tr>
  //                               <td class="es-m-p15r es-m-p15l" align="center" style="padding:0;Margin:0">
  //                                   <table class="es-content-body" align="center" cellpadding="0" cellspacing="0"
  //                                       style="border-collapse:collapse;border-spacing:0px;background-color:aliceblue;width:640px"
  //                                       role="none">
  //                                       <tr>
  //                                           <td align="left"
  //                                               style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
  //                                               <table cellpadding="0" cellspacing="0" width="100%" role="none"
  //                                                   style="border-collapse:collapse;border-spacing:0px">
  //                                                   <tr>
  //                                                       <td align="center" valign="top"
  //                                                           style="padding:0;Margin:0;width:560px">
  //                                                           <table cellpadding="0" cellspacing="0" width="100%"
  //                                                               role="presentation"
  //                                                               style="border-collapse:collapse;border-spacing:0px">
  //                                                               <tr class="es-mobile-hidden">
  //                                                                   <td align="center" height="15"
  //                                                                       style="padding:0;Margin:0"></td>
  //                                                               </tr>
  //                                                           </table>
  //                                                       </td>
  //                                                   </tr>
  //                                               </table>
  //                                           </td>
  //                                       </tr>
  //                                       <tr>
  //                                           <td class="es-m-p20" align="left" bgcolor="#ffffff"
  //                                               style="Margin:0;padding-top:30px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-color:#ffffff;border-radius:20px">
  //                                               <table cellpadding="0" cellspacing="0" width="100%" role="none"
  //                                                   style="border-collapse:collapse;border-spacing:0px">
  //                                                   <tr>
  //                                                       <td align="left" style="padding:0;Margin:0;width:560px">
  //                                                           <table cellpadding="0" cellspacing="0" width="100%"
  //                                                               role="presentation"
  //                                                               style="border-collapse:collapse;border-spacing:0px">
  //                                                               <tr>
  //                                                                  ${content}
  //                                                               </tr>

  //                                                           </table>
  //                                                       </td>
  //                                                   </tr>
  //                                                   <div ><p style="font-size:10px;text-align:center">Kids Eat Free Card | Copyright 2023 | All Rights Reserved</p></div>
  //                                               </table>
  //                                           </td>
  //                                       </tr>

  //                                   </table>
  //                               </td>
  //                           </tr>
  //                       </table>

  //                   </td>

  //               </tr>
  //           </table>
  //       </div>
  //    </body>

  //    </html>`,
  //     };

  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         console.error(error);
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     });
};

export function dateFormater(dynamicDate) {
  const parsedDate = new Date(dynamicDate);
  const options = { month: "short", day: "2-digit", year: "numeric" };
  const formattedDate = parsedDate.toLocaleDateString(undefined, options);
  return formattedDate;
}
async function generateQrCode(url) {
  return new Promise((resolve, reject) => {
    qr.toDataURL(url, (err, data) => {
      if (err) {
        reject("Error generating QR Code");
      }
      resolve(data);
    });
  });
}
//   async function generatePdf(htmlContent, qrCode) {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Set content to be converted to PDF
//     await page.setContent(`${htmlContent}<img src="${qrCode}" alt="QR Code">`);

//     // Generate PDF
//     const pdfBuffer = await page.pdf({ format: 'A4' });

//     // Close browser
//     await browser.close();

//     return pdfBuffer;
//   }

const queryPromise = (qu) => {
  return new Promise((resolve, reject) => {
    connection.query(qu, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

export const resetPasswordEmail = (data) => {

    connection.query(s, [data.filter], (e, r) => {
        if (e) {
          // console.log(e)
          console.error("Error.", e);
          return;
        }
        // console.log('dm',r)
        if (r.length === 0) {
          console.error("No results found in the database.");
          // Handle the case where no results are found
          return;
        }
        const dataN = r[0];
    
        // Assuming `data.Body` contains the email content
        let content = dataN.Body;
        let subject = dataN.Subject;
        Object.keys(data).forEach((placeholder) => {
        //   console.log(placeholder)
          const regex = new RegExp(`{{${placeholder}}}`, "g");
            // console.log(regex);
          if (placeholder) {
            // subject =
            content = content.replace(regex, data[placeholder]);
          }
        });
        // console.log(subject)
        // console.log(content)
        // return 
        const mailOptions = {
          to: data.email, // assuming user's email is stored in data.user_email
          subject: `${subject} at ${data.email}`,
          html: `<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und"
            style="font-family:'Exo 2', sans-serif">
         <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title>New email template 2023-11-21</title>
            <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
            <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
         <![endif]--> <!--[if !mso]><!-- -->
            <link
                href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                rel="stylesheet"> <!--<![endif]-->
            <style type="text/css">
                .rollover div {
                    font-size: 0;
                }
         
                .rollover:hover .rollover-first {
                    max-height: 0px !important;
                    display: none !important;
                }
         
                .rollover:hover .rollover-second {
                    max-height: none !important;
                    display: block !important;
                }
         
                .container-hover:hover>table {
                    background: linear-gradient(153.06deg, #7EE8FA -0.31%, #EEC0C6 99.69%) !important;
                    transition: 0.3s all !important;
                }
         
                .es-menu.es-table-not-adapt td a:hover,
                a.es-button:hover {
                    text-decoration: underline !important;
                }
         
                #outlook a {
                    padding: 0;
                }
         
                .es-button {
                    mso-style-priority: 100 !important;
                    text-decoration: none !important;
                }
         
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
         
                .es-desk-hidden {
                    display: none;
                    float: left;
                    overflow: hidden;
                    width: 0;
                    max-height: 0;
                    line-height: 0;
                    mso-hide: all;
                }
         
                @media only screen and (max-width:600px) {
         
                    p,
                    ul li,
                    ol li,
                    a {
                        line-height: 150% !important
                    }
         
                    h1,
                    h2,
                    h3,
                    h1 a,
                    h2 a,
                    h3 a {
                        line-height: 120% !important
                    }
         
                    h1 {
                        font-size: 28px !important;
                        text-align: left
                    }
         
                    h2 {
                        font-size: 24px !important;
                        text-align: left
                    }
         
                    h3 {
                        font-size: 20px !important;
                        text-align: left
                    }
         
                    .es-header-body h1 a,
                    .es-content-body h1 a,
                    .es-footer-body h1 a {
                        font-size: 28px !important;
                        text-align: left
                    }
         
                    .es-header-body h2 a,
                    .es-content-body h2 a,
                    .es-footer-body h2 a {
                        font-size: 24px !important;
                        text-align: left
                    }
         
                    .es-header-body h3 a,
                    .es-content-body h3 a,
                    .es-footer-body h3 a {
                        font-size: 20px !important;
                        text-align: left
                    }
         
                    .es-menu td a {
                        font-size: 16px !important
                    }
         
                    .es-header-body p,
                    .es-header-body ul li,
                    .es-header-body ol li,
                    .es-header-body a {
                        font-size: 16px !important
                    }
         
                    .es-content-body p,
                    .es-content-body ul li,
                    .es-content-body ol li,
                    .es-content-body a {
                        font-size: 16px !important
                    }
         
                    .es-footer-body p,
                    .es-footer-body ul li,
                    .es-footer-body ol li,
                    .es-footer-body a {
                        font-size: 16px !important
                    }
         
                    .es-infoblock p,
                    .es-infoblock ul li,
                    .es-infoblock ol li,
                    .es-infoblock a {
                        font-size: 12px !important
                    }
         
                    *[class="gmail-fix"] {
                        display: none !important
                    }
         
                    .es-m-txt-c,
                    .es-m-txt-c h1,
                    .es-m-txt-c h2,
                    .es-m-txt-c h3 {
                        text-align: center !important
                    }
         
                    .es-m-txt-r,
                    .es-m-txt-r h1,
                    .es-m-txt-r h2,
                    .es-m-txt-r h3 {
                        text-align: right !important
                    }
         
                    .es-m-txt-l,
                    .es-m-txt-l h1,
                    .es-m-txt-l h2,
                    .es-m-txt-l h3 {
                        text-align: left !important
                    }
         
                    .es-m-txt-r img,
                    .es-m-txt-c img,
                    .es-m-txt-l img {
                        display: inline !important
                    }
         
                    .es-button-border {
                        display: inline-block !important
                    }
         
                    a.es-button,
                    button.es-button {
                        font-size: 20px !important;
                        display: inline-block !important
                    }
         
                    .es-adaptive table,
                    .es-left,
                    .es-right {
                        width: 100% !important
                    }
         
                    .es-content table,
                    .es-header table,
                    .es-footer table,
                    .es-content,
                    .es-footer,
                    .es-header {
                        width: 100% !important;
                        max-width: 600px !important
                    }
         
                    .es-adapt-td {
                        display: block !important;
                        width: 100% !important
                    }
         
                    .adapt-img {
                        width: 100% !important;
                        height: auto !important
                    }
         
                    .es-m-p0 {
                        padding: 0 !important
                    }
         
                    .es-m-p0r {
                        padding-right: 0 !important
                    }
         
                    .es-m-p0l {
                        padding-left: 0 !important
                    }
         
                    .es-m-p0t {
                        padding-top: 0 !important
                    }
         
                    .es-m-p0b {
                        padding-bottom: 0 !important
                    }
         
                    .es-m-p20b {
                        padding-bottom: 20px !important
                    }
         
                    .es-mobile-hidden,
                    .es-hidden {
                        display: none !important
                    }
         
                    tr.es-desk-hidden,
                    td.es-desk-hidden,
                    table.es-desk-hidden {
                        width: auto !important;
                        overflow: visible !important;
                        float: none !important;
                        max-height: inherit !important;
                        line-height: inherit !important
                    }
         
                    tr.es-desk-hidden {
                        display: table-row !important
                    }
         
                    table.es-desk-hidden {
                        display: table !important
                    }
         
                    td.es-desk-menu-hidden {
                        display: table-cell !important
                    }
         
                    .es-menu td {
                        width: 1% !important
                    }
         
                    table.es-table-not-adapt,
                    .esd-block-html table {
                        width: auto !important
                    }
         
                    table.es-social {
                        display: inline-block !important
                    }
         
                    table.es-social td {
                        display: inline-block !important
                    }
         
                    .es-m-p5 {
                        padding: 5px !important
                    }
         
                    .es-m-p5t {
                        padding-top: 5px !important
                    }
         
                    .es-m-p5b {
                        padding-bottom: 5px !important
                    }
         
                    .es-m-p5r {
                        padding-right: 5px !important
                    }
         
                    .es-m-p5l {
                        padding-left: 5px !important
                    }
         
                    .es-m-p10 {
                        padding: 10px !important
                    }
         
                    .es-m-p10t {
                        padding-top: 10px !important
                    }
         
                    .es-m-p10b {
                        padding-bottom: 10px !important
                    }
         
                    .es-m-p10r {
                        padding-right: 10px !important
                    }
         
                    .es-m-p10l {
                        padding-left: 10px !important
                    }
         
                    .es-m-p15 {
                        padding: 15px !important
                    }
         
                    .es-m-p15t {
                        padding-top: 15px !important
                    }
         
                    .es-m-p15b {
                        padding-bottom: 15px !important
                    }
         
                    .es-m-p15r {
                        padding-right: 15px !important
                    }
         
                    .es-m-p15l {
                        padding-left: 15px !important
                    }
         
                    .es-m-p20 {
                        padding: 20px !important
                    }
                    
                 .es-m-p20t {
                  padding-top: 20px !important
              }
      
              .es-m-p20r {
                  padding-right: 20px !important
              }
      
              .es-m-p20l {
                  padding-left: 20px !important
              }
      
              .es-m-p25 {
                  padding: 25px !important
              }
      
              .es-m-p25t {
                  padding-top: 25px !important
              }
      
              .es-m-p25b {
                  padding-bottom: 25px !important
              }
      
              .es-m-p25r {
                  padding-right: 25px !important
              }
      
              .es-m-p25l {
                  padding-left: 25px !important
              }
      
              .es-m-p30 {
                  padding: 30px !important
              }
      
              .es-m-p30t {
                  padding-top: 30px !important
              }
      
              .es-m-p30b {
                  padding-bottom: 30px !important
              }
      
              .es-m-p30r {
                  padding-right: 30px !important
              }
      
              .es-m-p30l {
                  padding-left: 30px !important
              }
      
              .es-m-p35 {
                  padding: 35px !important
              }
      
              .es-m-p35t {
                  padding-top: 35px !important
              }
      
              .es-m-p35b {
                  padding-bottom: 35px !important
              }
      
              .es-m-p35r {
                  padding-right: 35px !important
              }
      
              .es-m-p35l {
                  padding-left: 35px !important
              }
      
              .es-m-p40 {
                  padding: 40px !important
              }
      
              .es-m-p40t {
                  padding-top: 40px !important
              }
      
              .es-m-p40b {
                  padding-bottom: 40px !important
              }
      
              .es-m-p40r {
                  padding-right: 40px !important
              }
      
              .es-m-p40l {
                  padding-left: 40px !important
              }
      
              .m-c-p16r {
                  padding-right: 8vw
              }
      
              .es-desk-hidden {
                  display: table-row !important;
                  width: auto !important;
                  overflow: visible !important;
                  max-height: inherit !important
              }
         
                }
            </style>
         </head>
         
         <body
            style="width:100%;font-family:'Exo 2', sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
            <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:aliceblue">
                <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" src="https://tlr.stripocdn.email/content/guids/CABINET_bf3f28777a864b4fca3f15706a2554aa/images/group_10.png" color="#12022f" origin="0.5, 0" position="0.5, 0"></v:fill> </v:background><![endif]-->
                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
                   style="border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;"
                    role="none">
                    <tr>
                        <td valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
                                style="border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                                <tr>
                                    <td class="es-m-p15r es-m-p15l" align="center" style="padding-bottom:40px;Margin:0">
                                        <table class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                                            style="border-collapse:collapse;border-spacing:0px;background-color:aliceblue;width:640px"
                                            role="none">
                                            <tr>
                                                <td align="left"
                                                    style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
                                                    <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                        style="border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="center" valign="top"
                                                                style="padding:0;Margin:0;width:560px">
                                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                                    role="presentation"
                                                                    style="border-collapse:collapse;border-spacing:0px">
                                                                    <tr class="es-mobile-hidden">
                                                                        <td align="center" height="15"
                                                                            style="padding:0;Margin:0"></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="es-m-p20" align="left" bgcolor="#ffffff"
                                                    style="Margin:0;padding-top:30px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-color:#ffffff;border-radius:20px">
                                                    <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                                        style="border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0;width:560px">
                                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                                    role="presentation"
                                                                    style="border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                   ${content}
                                                                </tr>
         
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <div ><p style="font-size:10px;text-align:center">Kids Eat Free Card | Copyright 2023 | All Rights Reserved</p></div>
                                                    </table>
                                                </td>
                                            </tr>
                                            
                                        </table>
                                    </td>
                                </tr>
                            </table>
                          
                        </td>
         
                    </tr>
                </table>
            </div>
         </body>
         
         </html>`,
        };
        const transporter = nodemailer.createTransport({
          // configure your email provider here
          service: "gmail",
          auth: {
            user: "webseowiz1@gmail.com",
            pass: "jhss nshv cxnx seay",
          },
        });
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return false;
          } else {
            return true;
          }
        });
        // Now `content` holds the modified email content
    
        // Proceed with sending the email or storing the content, etc.
      });
  return
//   const transporter = nodemailer.createTransport({
//     // configure your email provider here
//     service: "gmail",
//     auth: {
//       user: "webseowiz1@gmail.com",
//       pass: "jhss nshv cxnx seay",
//     },
//   });
//   const mailOptions = {
//     to: data.email, // assuming user's email is stored in data.user_email
//     subject: `Reset Your Password`,
//     html: `<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="und"
//       style="font-family:'Exo 2', sans-serif">
//    <head>
//       <meta charset="UTF-8">
//       <meta content="width=device-width, initial-scale=1" name="viewport">
//       <meta name="x-apple-disable-message-reformatting">
//       <meta http-equiv="X-UA-Compatible" content="IE=edge">
//       <meta content="telephone=no" name="format-detection">
//       <title>New email template 2023-11-21</title>
//       <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
//       <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
//    <![endif]--> <!--[if !mso]><!-- -->
//       <link
//           href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
//           rel="stylesheet"> <!--<![endif]-->
//       <style type="text/css">
//           .rollover div {
//               font-size: 0;
//           }
   
//           .rollover:hover .rollover-first {
//               max-height: 0px !important;
//               display: none !important;
//           }
   
//           .rollover:hover .rollover-second {
//               max-height: none !important;
//               display: block !important;
//           }
   
//           .container-hover:hover>table {
//               background: linear-gradient(153.06deg, #7EE8FA -0.31%, #EEC0C6 99.69%) !important;
//               transition: 0.3s all !important;
//           }
   
//           .es-menu.es-table-not-adapt td a:hover,
//           a.es-button:hover {
//               text-decoration: underline !important;
//           }
   
//           #outlook a {
//               padding: 0;
//           }
   
//           .es-button {
//               mso-style-priority: 100 !important;
//               text-decoration: none !important;
//           }
   
//           a[x-apple-data-detectors] {
//               color: inherit !important;
//               text-decoration: none !important;
//               font-size: inherit !important;
//               font-family: inherit !important;
//               font-weight: inherit !important;
//               line-height: inherit !important;
//           }
   
//           .es-desk-hidden {
//               display: none;
//               float: left;
//               overflow: hidden;
//               width: 0;
//               max-height: 0;
//               line-height: 0;
//               mso-hide: all;
//           }
   
//           @media only screen and (max-width:600px) {
   
//               p,
//               ul li,
//               ol li,
//               a {
//                   line-height: 150% !important
//               }
   
//               h1,
//               h2,
//               h3,
//               h1 a,
//               h2 a,
//               h3 a {
//                   line-height: 120% !important
//               }
   
//               h1 {
//                   font-size: 28px !important;
//                   text-align: left
//               }
   
//               h2 {
//                   font-size: 24px !important;
//                   text-align: left
//               }
   
//               h3 {
//                   font-size: 20px !important;
//                   text-align: left
//               }
   
//               .es-header-body h1 a,
//               .es-content-body h1 a,
//               .es-footer-body h1 a {
//                   font-size: 28px !important;
//                   text-align: left
//               }
   
//               .es-header-body h2 a,
//               .es-content-body h2 a,
//               .es-footer-body h2 a {
//                   font-size: 24px !important;
//                   text-align: left
//               }
   
//               .es-header-body h3 a,
//               .es-content-body h3 a,
//               .es-footer-body h3 a {
//                   font-size: 20px !important;
//                   text-align: left
//               }
   
//               .es-menu td a {
//                   font-size: 16px !important
//               }
   
//               .es-header-body p,
//               .es-header-body ul li,
//               .es-header-body ol li,
//               .es-header-body a {
//                   font-size: 16px !important
//               }
   
//               .es-content-body p,
//               .es-content-body ul li,
//               .es-content-body ol li,
//               .es-content-body a {
//                   font-size: 16px !important
//               }
   
//               .es-footer-body p,
//               .es-footer-body ul li,
//               .es-footer-body ol li,
//               .es-footer-body a {
//                   font-size: 16px !important
//               }
   
//               .es-infoblock p,
//               .es-infoblock ul li,
//               .es-infoblock ol li,
//               .es-infoblock a {
//                   font-size: 12px !important
//               }
   
//               *[class="gmail-fix"] {
//                   display: none !important
//               }
   
//               .es-m-txt-c,
//               .es-m-txt-c h1,
//               .es-m-txt-c h2,
//               .es-m-txt-c h3 {
//                   text-align: center !important
//               }
   
//               .es-m-txt-r,
//               .es-m-txt-r h1,
//               .es-m-txt-r h2,
//               .es-m-txt-r h3 {
//                   text-align: right !important
//               }
   
//               .es-m-txt-l,
//               .es-m-txt-l h1,
//               .es-m-txt-l h2,
//               .es-m-txt-l h3 {
//                   text-align: left !important
//               }
   
//               .es-m-txt-r img,
//               .es-m-txt-c img,
//               .es-m-txt-l img {
//                   display: inline !important
//               }
   
//               .es-button-border {
//                   display: inline-block !important
//               }
   
//               a.es-button,
//               button.es-button {
//                   font-size: 20px !important;
//                   display: inline-block !important
//               }
   
//               .es-adaptive table,
//               .es-left,
//               .es-right {
//                   width: 100% !important
//               }
   
//               .es-content table,
//               .es-header table,
//               .es-footer table,
//               .es-content,
//               .es-footer,
//               .es-header {
//                   width: 100% !important;
//                   max-width: 600px !important
//               }
   
//               .es-adapt-td {
//                   display: block !important;
//                   width: 100% !important
//               }
   
//               .adapt-img {
//                   width: 100% !important;
//                   height: auto !important
//               }
   
//               .es-m-p0 {
//                   padding: 0 !important
//               }
   
//               .es-m-p0r {
//                   padding-right: 0 !important
//               }
   
//               .es-m-p0l {
//                   padding-left: 0 !important
//               }
   
//               .es-m-p0t {
//                   padding-top: 0 !important
//               }
   
//               .es-m-p0b {
//                   padding-bottom: 0 !important
//               }
   
//               .es-m-p20b {
//                   padding-bottom: 20px !important
//               }
   
//               .es-mobile-hidden,
//               .es-hidden {
//                   display: none !important
//               }
   
//               tr.es-desk-hidden,
//               td.es-desk-hidden,
//               table.es-desk-hidden {
//                   width: auto !important;
//                   overflow: visible !important;
//                   float: none !important;
//                   max-height: inherit !important;
//                   line-height: inherit !important
//               }
   
//               tr.es-desk-hidden {
//                   display: table-row !important
//               }
   
//               table.es-desk-hidden {
//                   display: table !important
//               }
   
//               td.es-desk-menu-hidden {
//                   display: table-cell !important
//               }
   
//               .es-menu td {
//                   width: 1% !important
//               }
   
//               table.es-table-not-adapt,
//               .esd-block-html table {
//                   width: auto !important
//               }
   
//               table.es-social {
//                   display: inline-block !important
//               }
   
//               table.es-social td {
//                   display: inline-block !important
//               }
   
//               .es-m-p5 {
//                   padding: 5px !important
//               }
   
//               .es-m-p5t {
//                   padding-top: 5px !important
//               }
   
//               .es-m-p5b {
//                   padding-bottom: 5px !important
//               }
   
//               .es-m-p5r {
//                   padding-right: 5px !important
//               }
   
//               .es-m-p5l {
//                   padding-left: 5px !important
//               }
   
//               .es-m-p10 {
//                   padding: 10px !important
//               }
   
//               .es-m-p10t {
//                   padding-top: 10px !important
//               }
   
//               .es-m-p10b {
//                   padding-bottom: 10px !important
//               }
   
//               .es-m-p10r {
//                   padding-right: 10px !important
//               }
   
//               .es-m-p10l {
//                   padding-left: 10px !important
//               }
   
//               .es-m-p15 {
//                   padding: 15px !important
//               }
   
//               .es-m-p15t {
//                   padding-top: 15px !important
//               }
   
//               .es-m-p15b {
//                   padding-bottom: 15px !important
//               }
   
//               .es-m-p15r {
//                   padding-right: 15px !important
//               }
   
//               .es-m-p15l {
//                   padding-left: 15px !important
//               }
   
//               .es-m-p20 {
//                   padding: 20px !important
//               }
              
//            .es-m-p20t {
//             padding-top: 20px !important
//         }

//         .es-m-p20r {
//             padding-right: 20px !important
//         }

//         .es-m-p20l {
//             padding-left: 20px !important
//         }

//         .es-m-p25 {
//             padding: 25px !important
//         }

//         .es-m-p25t {
//             padding-top: 25px !important
//         }

//         .es-m-p25b {
//             padding-bottom: 25px !important
//         }

//         .es-m-p25r {
//             padding-right: 25px !important
//         }

//         .es-m-p25l {
//             padding-left: 25px !important
//         }

//         .es-m-p30 {
//             padding: 30px !important
//         }

//         .es-m-p30t {
//             padding-top: 30px !important
//         }

//         .es-m-p30b {
//             padding-bottom: 30px !important
//         }

//         .es-m-p30r {
//             padding-right: 30px !important
//         }

//         .es-m-p30l {
//             padding-left: 30px !important
//         }

//         .es-m-p35 {
//             padding: 35px !important
//         }

//         .es-m-p35t {
//             padding-top: 35px !important
//         }

//         .es-m-p35b {
//             padding-bottom: 35px !important
//         }

//         .es-m-p35r {
//             padding-right: 35px !important
//         }

//         .es-m-p35l {
//             padding-left: 35px !important
//         }

//         .es-m-p40 {
//             padding: 40px !important
//         }

//         .es-m-p40t {
//             padding-top: 40px !important
//         }

//         .es-m-p40b {
//             padding-bottom: 40px !important
//         }

//         .es-m-p40r {
//             padding-right: 40px !important
//         }

//         .es-m-p40l {
//             padding-left: 40px !important
//         }

//         .m-c-p16r {
//             padding-right: 8vw
//         }

//         .es-desk-hidden {
//             display: table-row !important;
//             width: auto !important;
//             overflow: visible !important;
//             max-height: inherit !important
//         }
   
//           }
//       </style>
//    </head>
   
//    <body
//       style="width:100%;font-family:'Exo 2', sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
//       <div dir="ltr" class="es-wrapper-color" lang="und" style="background-color:aliceblue">
//           <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" src="https://tlr.stripocdn.email/content/guids/CABINET_bf3f28777a864b4fca3f15706a2554aa/images/group_10.png" color="#12022f" origin="0.5, 0" position="0.5, 0"></v:fill> </v:background><![endif]-->
//           <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
//              style="border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;"
//               role="none">
//               <tr>
//                   <td valign="top" style="padding:0;Margin:0">
//                       <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
//                           style="border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
//                           <tr>
//                               <td class="es-m-p15r es-m-p15l" align="center" style="Margin:0; padding-bottom:20px !important">
//                                   <table class="es-content-body" align="center" cellpadding="0" cellspacing="0"
//                                       style="border-collapse:collapse;border-spacing:0px;background-color:aliceblue;width:640px"
//                                       role="none">
//                                       <tr>
//                                           <td align="left"
//                                               style="box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;padding:0;Margin:0;padding-top:30px;padding-left:40px;padding-right:40px;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
//                                               <table cellpadding="0" cellspacing="0" width="100%" role="none"
//                                                   style="border-collapse:collapse;border-spacing:0px">
//                                                   <tr>
//                                                       <td align="center" valign="top"
//                                                           style="padding:0;Margin:0;width:560px">
//                                                           <table cellpadding="0" cellspacing="0" width="100%"
//                                                               role="presentation"
//                                                               style="border-collapse:collapse;border-spacing:0px">
//                                                               <tr class="es-mobile-hidden">
//                                                                   <td align="center" height="15"
//                                                                       style="padding:0;Margin:0"></td>
//                                                               </tr>
//                                                           </table>
//                                                       </td>
//                                                   </tr>
//                                               </table>
//                                           </td>
//                                       </tr>
//                                       <tr>
//                                           <td class="es-m-p20" align="left" bgcolor="#ffffff"
//                                               style="Margin:0;padding-top:30px;padding-bottom:40px;padding-left:40px;padding-right:40px;background-color:#ffffff;border-radius:20px">
//                                               <table cellpadding="0" cellspacing="0" width="100%" role="none"
//                                                   style="border-collapse:collapse;border-spacing:0px">
//                                                   <tr>
//                                                       <td align="left" style="padding:0;Margin:0;width:560px">
//                                                           <table cellpadding="0" cellspacing="0" width="100%"
//                                                               role="presentation"
//                                                               style="border-collapse:collapse;border-spacing:0px">
//                                                               <td style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;padding:25px 0;text-align:center">
//         <a href="" style="font-family:Avenir,Helvetica,sans-serif;box-sizing:border-box;color:#bbbfc3;font-size:19px;font-weight:bold;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://localhost:8081&amp;source=gmail&amp;ust=1700914849973000&amp;usg=AOvVaw2um276LAN7XDXJstAQUjiK">
//             Kids
//         </a>
//     </td>
//                                                               <tr>
//                                                                   <td align="left"
//                                                                       style="padding:0;Margin:0;padding-top:30px">
//                                                                       <p
//                                                                           style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;font-family:'Exo 2 !important',color:#666666;font-size:14px">
//                                                                           <h3 style="padding:0;margin:0">Dear ${data.email},</h3><br>
//                                                                           <h3 style="padding:0;margin:0">To reset your password, complete this form:.</h3><br>
//                                                                            ${data.resetLink}<br><br>
//                                                                            <strong>Your link will expire at ${data.expire}.<br>(after 1 hour)</strong><br><br><br>
//                                                                            <span style="font-size:10px">Taktik Enterprises, Inc & Subsidiaries<span><br><br>
//                                                                            <span>(Kids Eat Free Card, VIP Shop & Dine 4Less Card and Play 4Less Card)<span><br>
//                                                                            <span>Regards,
//                                                                            Kids<span>
//                                                                          </div>
                                                                     
//                                                                          </p>
//                                                                   </td>
//                                                               </tr>
//                                                           </table>
//                                                       </td>
//                                                   </tr>
//                                                   <div ><p style="font-size:10px;text-align:center">Kids Eat Free Card | Copyright 2023 | All Rights Reserved</p></div>
//                                               </table>
//                                           </td>
//                                       </tr>
//                                   </table>
//                               </td>
//                           </tr>
//                       </table>
//                   </td>
//               </tr>
//           </table>
//       </div>
//    </body>
   
//    </html>`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error(error);
//       return false;
//     } else {
//       return true;
//     }
//   });
};
