import connection from '../config/db.js';
import Joi from 'joi';
import { uploadFile, rollbackUploads } from '../utils/fileUpload.js';

//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM offers ORDER BY created_at DESC';
    connection.query(sql, function (err, result, fields) {
      if (err) return res.status(200).send({ success: false, message: err });
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT o.*, GROUP_CONCAT(oc.card_id) AS card_ids FROM offers o LEFT JOIN offer_cards oc ON oc.offer_id = o.id GROUP BY o.id ORDER BY created_at DESC LIMIT ${startingLimit}, ${resultsPerPage}`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        let iterator = page - 3 < 1 ? 1 : page - 3;
        let endingLink =
          iterator + 4 <= numberOfPages
            ? iterator + 4
            : page + (numberOfPages - page);
        results.forEach((item) => {
          item.card_ids = item.card_ids
            ? item.card_ids.split(',').map(Number)
            : null;
          if (
            item.image &&
            item.image != null &&
            item.image != 'null' &&
            item.image != 'NULL'
          ) {
            item.image = `${process.env.BASE_URL}/uploads/offer_images/${item.image}`;
          } else {
            item.image = null;
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

//Get Offers list
export const getOffersList = async (req, res, next) => {
  try {
    const sql = `SELECT * FROM offers ORDER BY created_at DESC`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(200).send({ success: false, message: err });
      res.status(200).send({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Create new Offer
export const createNewOffer = async (req, res) => {
  req.body.card_ids = Array.isArray(req.body.card_ids)
    ? req.body.card_ids
    : [req.body.card_ids];
  const {
    title,
    resturant_id,
    description,
    is_active,
    card_ids,
    latitude,
    longitude,
    offer_value,
  } = req.body;
  const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({ data: null, message: error.message });

  try {
    let image = null;
    if (req.files && req.files.image) {
      image = await uploadFile(req.files.image, 'offer_images');
    }

    const sql = `INSERT INTO offers (title, resturant_id, image, description, is_active, created_at, latitude, longitude, offer_value) VALUES ("${title}", "${resturant_id}", ${
      image ? `"${image}"` : 'NULL'
    }, '${description}', "${is_active}", "${created_at}", "${latitude}", "${longitude}", "${offer_value}")`;
    await connection.query(sql, (err, result) => {
      if (err) return res.status(200).send({ success: false, message: err });
      const offerId = result.insertId;
      if (offerId) {
        connection.query(
          `INSERT INTO offer_cards(offer_id, card_id) VALUES ?`,
          [card_ids.map((item) => [offerId, item])],
          (errTwo, resultTwo) => {
            if (errTwo) {
              res.status(404).send({ success: false, message: errTwo });
            } else {
              res.status(201).send({
                success: true,
                message: 'Successfully created new offer',
              });
            }
          }
        );
      } else {
        res
          .status(404)
          .send({ success: false, message: 'Offer creation failed.' });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Update Existing Offer
export const updateOffer = async (req, res) => {
  const id = req.params.id;
  const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  req.body.card_ids = Array.isArray(req.body.card_ids)
    ? req.body.card_ids
    : [req.body.card_ids];
  const { title, resturant_id, description, is_active, card_ids, offer_value,longitude,latitude } =
    req.body;

  let image;
  const queryPromise = new Promise((resolve, reject) => {
    let sqlSelect = `SELECT * FROM offers WHERE id=${id} LIMIT 1`;
    connection.query(sqlSelect, async (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        image = results[0].image;
        if (req.files && req.files.image) {
          //Delete previous image file from directory
          if (image) {
            await rollbackUploads(image, 'offer_images');
          }
          image = await uploadFile(req.files.image, 'offer_images');
        }
        resolve(image);
      } else {
        res.json({ success: false, message: 'No records found' });
      }
    });
  });

  image = await queryPromise;

  try {
    const sql = `UPDATE offers SET title="${title}", resturant_id="${resturant_id}", description='${description}', image=${
      image ? `"${image}"` : 'NULL'}, is_active="${is_active}", updated_at="${updated_at}", latitude="${latitude}", longitude="${longitude}", offer_value="${offer_value}" WHERE id=${id}`;
    connection.query(sql, async (err, result) => {
      if (err) return res.status(200).send(err);
      if (result.affectedRows > 0) {
        // Deleting previous data against this coupon id
        await connection.query(
          `DELETE FROM offer_cards WHERE offer_id=${id}`,
          (err, result) => {}
        );
        connection.query(
          `INSERT INTO offer_cards(offer_id, card_id) VALUES ?`,
          [card_ids.map((item) => [id, item])],
          (errTwo, resultTwo) => {
            if (errTwo) {
              console.log('err 2->',errTwo)
              res.status(404).send({ success: false, message: errTwo });
            } else {
              return res
                .status(200)
                .send({ success: true, message: 'Successfully updated' });
            }
          }
        );
      } else {
        res.status(200).send({ success: false, data: 'Record not found.' });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

//Delete Offer
export const deleteOffer = async (req, res) => {
  const id = req.params.id;
  try {
    let image;
    const queryPromise = new Promise((resolve, reject) => {
      let sqlSelect = `SELECT * FROM offers WHERE id=${id} LIMIT 1`;
      connection.query(sqlSelect, async (err, results) => {
        if (err) reject(err);
        if (results.length > 0) {
          image = results[0].image;
          resolve(image);
        } else {
          res.json({ success: false, message: 'No records found' });
        }
      });
    });

    image = await queryPromise;

    const sql = `DELETE FROM offers WHERE id=${id}`;
    connection.query(sql, async (err, result) => {
      if (err) return res.status(200).send(err);
      if (result.affectedRows > 0) {
        if (image) {
          await rollbackUploads(image, 'offer_images');
        }
        return res
          .status(200)
          .send({ success: true, message: 'Successfully deleted' });
      } else {
        res.status(200).send({ success: false, message: 'Record not found' });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getRestaurantOffers = async (req, res, next) => {
  const { card_id, searchValue, pricing_range } = req.body;
  if (!card_id)
    return res
      .status(404)
      .send({ success: false, message: 'Card is required.' });
  try {
    let sql = `SELECT oc.card_id, o.id AS offer_id, o.title,o.image AS offer_image, o.description AS offer_description, r.id AS resturant_id, r.name, r.image AS resturant_image, r.description AS resturant_description, r.pricing_range, r.recommended, r.web_url, r.menu_urls, r.delivery_url, r.ubereat_url, r.doordash_url, r.grubhug_url, r.yelp_reviews_url, r.ta_reviews_url, r.fb_reviews_url
    FROM offers o
    JOIN resturants r ON r.id = o.resturant_id
    JOIN offer_cards oc ON oc.offer_id = o.id
    WHERE oc.card_id = ${card_id}
    AND o.is_active = 1
    AND r.is_active = 1`;
    if (searchValue != '') {
      sql += ` AND r.name LIKE '%${searchValue}%'`;
    }
    if (pricing_range != '') {
      sql += ` AND r.pricing_range = '${pricing_range}'`;
    }
    connection.query(sql, (err, results) => {
      if (err) return res.status(200).send({ success: false, message: err });
      if (results.length > 0) {
        results.forEach((item) => {
          if (
            item.offer_image &&
            item.offer_image != null &&
            item.offer_image != 'null' &&
            item.offer_image != 'NULL'
          ) {
            item.offer_image = `${process.env.BASE_URL}/uploads/offer_images/${item.offer_image}`;
          } else {
            item.offer_image = null;
          }

          if (
            item.resturant_image &&
            item.resturant_image != null &&
            item.resturant_image != 'null' &&
            item.resturant_image != 'NULL'
          ) {
            item.resturant_image = `${process.env.BASE_URL}/uploads/restaurant_images/${item.resturant_image}`;
          } else {
            item.resturant_image = null;
          }

          if (
            item.menu_urls &&
            item.menu_urls != null &&
            item.menu_urls != '' &&
            item.menu_urls != 'null'
          ) {
            item.menu_urls = JSON.parse(item.menu_urls);
          } else {
            item.menu_urls = [];
          }
        });
        res.status(200).send({ success: true, data: results });
      } else {
        res.status(200).send({ success: true, data: [] });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

function validate(data) {
  const schema = Joi.object({
    title: Joi.string().required(),
    resturant_id: Joi.number().required(),
    image: Joi.string().allow(null, '').optional(),
    description: Joi.string().allow(null, '').optional(),
    is_active: Joi.number().required(),
    card_ids: Joi.array().items(Joi.number()).min(1).unique().required(),
    latitude: Joi.string().allow(null, '').optional(),
    longitude: Joi.string().allow(null, '').optional(),
    offer_value: Joi.string().allow(null, '').required(),
  });
  return schema.validate(data);
}
