import connection from '../config/db.js';
import Joi from 'joi';
import mysql from 'mysql';
import { dateFormater, redeemEmail } from '../utils/sentEmail.js';
import { rollbackUploads, uploadFile } from '../utils/fileUpload.js';

// const pool = mysql.createPool({
//   host: process.env.ENVIRONMENT,
//   user: process.env.ROOTS,
//   password: process.env.PASSWORD,
//   database: process.env.DB_NAME,
//   dateStrings: true,
// });

//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 10;
  try {
    let sql = 'SELECT * FROM redeem ORDER BY created DESC';
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      if (!req.query.size || req.query.size == undefined) {
        result.forEach((item) => {
          if (
            item.bill_image &&
            item.bill_image != null &&
            item.bill_image != 'NULL' &&
            item.bill_image != 'null'
          ) {
            item.bill_image = `${process.env.BASE_URL}/uploads/redeem_images/${item.bill_image}`;
          } else {
            item.bill_image = null;
          }
        });
        return res.json({
          success: true,
          data: result,
        });
      }
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM redeem LIMIT ${startingLimit}, ${resultsPerPage}`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        let iterator = page - 3 < 1 ? 1 : page - 3;
        let endingLink =
          iterator + 4 <= numberOfPages
            ? iterator + 4
            : page + (numberOfPages - page);

        results.forEach((item) => {
          if (
            item.bill_image &&
            item.bill_image != null &&
            item.bill_image != 'NULL' &&
            item.bill_image != 'null'
          ) {
            item.bill_image = `${process.env.BASE_URL}/uploads/redeem_images/${item.bill_image}`;
          } else {
            item.bill_image = null;
          }
        });
        res.json({
          success: true,
          data: results,
          page,
          iterator,
          endingLink,
          numberOfPages,
        });
      });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

//Create new Location
export const createNewRedeem = async (req, res) => {
  const {
    offer_name,
    resturant_id,
    resturant_name,
    user_id,
    card_image,
    resturant_image,
    offer_value,
    user_email,
    user_name,
    card_name,
    card_number,
    offer_id,
    sub_total,
    total_discount,
    comment,
    latitude,
    longitude,
  } = req.body;
  const created = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  let bill_image = null;
  try {
    if (req.files && req.files.bill_image) {
      bill_image = await uploadFile(req.files.bill_image, 'redeem_images');
    }
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = `INSERT INTO redeem (offer_name, resturant_id, resturant_name, user_id, created, card_image, resturant_image, offer_value, user_name, card_name, card_number, user_email, offer_id, sub_total, total_discount, bill_image, latitude, longitude, comment ) VALUES ("${offer_name}", "${resturant_id}", "${resturant_name}", "${user_id}", "${created}", "${card_image}", "${resturant_image}", "${offer_value}", "${user_name}", "${card_name}", "${card_number}", "${user_email}", "${offer_id}", "${sub_total}", "${total_discount}", "${bill_image}", "${latitude}", "${longitude}", "${comment}")`;
    await connection.query(sql, (err, result) => {
      if (err) {
        res.status(400).send({ success: false, message: err.sqlMessage });
      } else {
        redeemEmail({
          email: user_email,
          // subject: `${resturant_name}`,
          date:dateFormater(now),
          // offer_name,
          // resturant_id,
          resturant_name,
          // user_id,
          // card_image,
          // resturant_image,
          offer_value,
          // user_email,
          user_name,
          card_name,
          card_number,
          // offer_id,
          filter:'redeem_receipt'
        });
        res.status(200).send({
          success: true,
          message: 'Successfully inserted into redeem.',
        });
      }
    });
  } catch (error) {
    // console.log(error);
    await rollbackUploads(bill_image, 'redeem_images');
    res.status(500).send(error);
  }
};

function validate(data) {
  const schema = Joi.object({
    offer_name: Joi.string().required(),
    resturant_id: Joi.number().required(),
    resturant_name: Joi.string().required(),
    user_id: Joi.number().required(),
    card_image: Joi.string().required(),
    resturant_image: Joi.string().required(),
    offer_value: Joi.string().required(),
    user_name: Joi.string().required(),
    user_email: Joi.string().required(),
    card_name: Joi.string().required(),
    card_number: Joi.string().required(),
    offer_id: Joi.number().required(),
    sub_total: Joi.number().required(),
    total_discount: Joi.number().required(),
    bill_image: Joi.string().allow(null, '').optional(),
    comment: Joi.string().allow(null, '').optional(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  });
  return schema.validate(data);
}
