import connection from '../config/db.js';
import Joi from 'joi';
import { uploadFile, rollbackUploads } from '../utils/fileUpload.js';

export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM resturants ORDER BY created_at DESC';
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM resturants ORDER BY created_at DESC LIMIT ${startingLimit}, ${resultsPerPage}`;
      connection.query(sql, async (err, results) => {
        if (err) throw err;
        let iterator = page - 3 < 1 ? 1 : page - 3;
        let endingLink =
          iterator + 4 <= numberOfPages
            ? iterator + 4
            : page + (numberOfPages - page);
        await results.forEach((item) => {
          if (
            item.image &&
            item.image != null &&
            item.image != 'null' &&
            item.image != 'NULL'
          ) {
            item.image = `${process.env.BASE_URL}/uploads/restaurant_images/${item.image}`;
          } else {
            item.image = null;
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

//Get Resturent list
export const getResturentList = async (req, res, next) => {
  try {
    const sql = `SELECT * FROM resturants ORDER BY created_at DESC`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(200).send({ success: false, message: err });
      result.forEach((item) => {
        if (
          item.image &&
          item.image != null &&
          item.image != 'null' &&
          item.image != 'NULL'
        ) {
          item.image = `${process.env.BASE_URL}/uploads/restaurant_images/${item.image}`;
        } else {
          item.image = null;
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
      res.json({
        success: true,
        data: result,
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Create new Resturent
export const createNewResturent = async (req, res) => {
  // req.body.menu_urls = JSON.parse(req.body.menu_urls);
  const {
    name,
    description,
    pricing_range,
    domain_id,
    recommended,
    is_active,
    web_url,
    menu_urls,
    delivery_url,
    ubereat_url,
    doordash_url,
    grubhug_url,
    yelp_reviews_url,
    ta_reviews_url,
    fb_reviews_url,
  } = req.body;
  let parsedMenuUrls;
  try {
    parsedMenuUrls = JSON.parse(menu_urls);
    parsedMenuUrls = JSON.stringify(parsedMenuUrls);
  } catch (error) {
    return res
      .status(400)
      .send({ data: null, message: 'Invalid json string for menu_urls' });
  }

  const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({ data: null, message: error.message });
  try {
    let image = null;
    if (req.files && req.files.image) {
      image = await uploadFile(req.files.image, 'restaurant_images');
    }

    const sql = `INSERT INTO resturants (name, image, description, pricing_range, domain_id, recommended, is_active, created_at, web_url, menu_urls, delivery_url, ubereat_url, doordash_url, grubhug_url, yelp_reviews_url, ta_reviews_url, fb_reviews_url ) VALUES ("${name}", ${
      image ? `"${image}"` : 'NULL'
    }, '${description}', "${pricing_range}", "${domain_id}", "${recommended}", "${is_active}", "${created_at}", "${web_url}", '${parsedMenuUrls}', "${delivery_url}", "${ubereat_url}", "${doordash_url}", "${grubhug_url}", "${yelp_reviews_url}", "${ta_reviews_url}", "${fb_reviews_url}")`;
    await connection.query(sql, (err, result) => {
      if (err) {
        res.status(200).send({ success: false, message: err });
      }
      res.status(201).send({
        success: true,
        message: 'Successfully New Resturant created.',
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get single Resturent
export const getSingleResturent = async (req, res) => {
  const id = req.params.id;

  const queryPromise = new Promise((resolve, reject) => {
    let sqlSelect = `SELECT * FROM resturants WHERE id=${id} LIMIT 1`;
    connection.query(sqlSelect, async (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        await results.forEach((item) => {
          if (
            item.image &&
            item.image != null &&
            item.image != 'null' &&
            item.image != 'NULL'
          ) {
            item.image = `${process.env.BASE_URL}/uploads/restaurant_images/${item.image}`;
          } else {
            item.image = null;
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
        res.json({
          success: true,
          data: results,
        });
      } else {
        res.json({ success: false, message: 'No records found' });
      }
    });
  });
};

//Update Existing Resturent
export const updateResturant = async (req, res) => {
  const id = req.params.id;
  const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const {
    name,
    description,
    pricing_range,
    domain_id,
    recommended,
    is_active,
    web_url,
    menu_urls,
    delivery_url,
    ubereat_url,
    doordash_url,
    grubhug_url,
    yelp_reviews_url,
    ta_reviews_url,
    fb_reviews_url,
  } = req.body;

  let parsedMenuUrls;
  try {
    parsedMenuUrls = JSON.parse(menu_urls);
    parsedMenuUrls = JSON.stringify(parsedMenuUrls);
  } catch (error) {
    return res
      .status(400)
      .send({ data: null, message: 'Invalid json string for menu_urls' });
  }

  let image;
  const queryPromise = new Promise((resolve, reject) => {
    let sqlSelect = `SELECT * FROM resturants WHERE id=${id} LIMIT 1`;
    connection.query(sqlSelect, async (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        image = results[0].image;
        if (req.files && req.files.image) {
          //Delete previous image file from directory
          if (image) {
            await rollbackUploads(image, 'restaurant_images');
          }
          image = await uploadFile(req.files.image, 'restaurant_images');
        }
        resolve(image);
      } else {
        res.json({ success: false, message: 'No records found' });
      }
    });
  });

  image = await queryPromise;

  try {
    const sql = `UPDATE resturants SET name="${name}", image="${image}", description='${description}', pricing_range="${pricing_range}", domain_id="${domain_id}", recommended="${recommended}", is_active="${is_active}", web_url="${web_url}", menu_urls='${menu_urls}', delivery_url="${delivery_url}", ubereat_url="${ubereat_url}", doordash_url="${doordash_url}", grubhug_url="${grubhug_url}", yelp_reviews_url="${yelp_reviews_url}", ta_reviews_url="${ta_reviews_url}", fb_reviews_url="${fb_reviews_url}", updated_at="${updated_at}" WHERE id=${id}`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(200).send(err);
      if (result.affectedRows > 0)
        return res
          .status(200)
          .send({ success: true, message: 'Successfully updated' });
      res.status(200).send({ success: false, data: 'Id not Exist' });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

//Delete Resturant
export const deleteResturant = async (req, res) => {
  const id = req.params.id;
  try {
    let image;
    const queryPromise = new Promise((resolve, reject) => {
      let sqlSelect = `SELECT * FROM resturants WHERE id=${id} LIMIT 1`;
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

    const sql = `DELETE FROM resturants WHERE id=${id}`;
    connection.query(sql, async (err, result) => {
      if (err) return res.status(200).send(err);
      if (result.affectedRows > 0) {
        if (image) {
          await rollbackUploads(image, 'restaurant_images');
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

export const uploadResturantMenu = async (req, res) => {
  const allowedFileTypes = ['pdf', 'png', 'jpg', 'jpeg'];
  if (!req.files) {
    return res
      .status(200)
      .send({ success: false, message: 'File not uploaded correctly.' });
  }
  const uploadedFile = req.files.menu;
  const { name } = uploadedFile;
  const fileExtension = name.split('.').pop().toLowerCase();
  if (!allowedFileTypes.includes(fileExtension)) {
    return res
      .status(200)
      .send({ success: false, message: 'File format not supported.' });
  }
  try {
    if (uploadedFile) {
      const menu = await uploadFile(req.files.menu, 'restaurant_menus');
      const menuUrl = `${process.env.BASE_URL}/uploads/restaurant_menus/${menu}`;
      return res.status(200).send({
        success: true,
        message: 'Menu successfully uploaded.',
        data: { url: menuUrl },
      });
    } else {
      return res
        .status(200)
        .send({ success: false, message: 'Menu upload failed.' });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
};

function validate(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().allow(null, '').optional(),
    description: Joi.string().allow(null, '').optional(),
    pricing_range: Joi.string().required(),
    domain_id: Joi.number().required(),
    recommended: Joi.number().allow(null, '').optional(),
    is_active: Joi.number().optional(),
    web_url: Joi.string().allow(null, '').optional(),
    menu_urls: Joi.string().allow(null, '').optional().default([]),
    delivery_url: Joi.string().allow(null, '').optional(),
    ubereat_url: Joi.string().allow(null, '').optional(),
    doordash_url: Joi.string().allow(null, '').optional(),
    grubhug_url: Joi.string().allow(null, '').optional(),
    yelp_reviews_url: Joi.string().allow(null, '').optional(),
    ta_reviews_url: Joi.string().allow(null, '').optional(),
    fb_reviews_url: Joi.string().allow(null, '').optional(),
    longitude: Joi.string().allow(null, '').optional(),
    latitude: Joi.string().allow(null, '').optional(),
  });
  return schema.validate(data);
}
