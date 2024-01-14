import connection from '../config/db.js';
import Joi from 'joi';
import moment from 'moment';
import { uploadFile, rollbackUploads } from '../utils/fileUpload.js';

//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM ads ORDER BY created_at DESC';
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM ads ORDER BY created_at DESC LIMIT ${startingLimit}, ${resultsPerPage}`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        let iterator = page - 3 < 1 ? 1 : page - 3;
        let endingLink =
          iterator + 4 <= numberOfPages
            ? iterator + 4
            : page + (numberOfPages - page);
        results.forEach((item) => {
          if (item.banner_image && item.banner_image != null) {
            item.banner_image = `${process.env.BASE_URL}/uploads/ads_images/${item.banner_image}`;
          }
          if (item.popup_image && item.popup_image != null) {
            item.popup_image = `${process.env.BASE_URL}/uploads/ads_images/${item.popup_image}`;
          }
          if (item.linked_card_ids) {
            item.linked_card_ids = JSON.parse(item.linked_card_ids); // Parse the JSON string to an array
          }
          if (!item.linked_card_ids) {
            item.linked_card_ids = [];
          }
          const startHours = new Date(item.active_at);
          const endHours = new Date(item.expire_at);
          const currentTime = new Date();
          // Determine if the offer is active based on current time
          item.is_active = currentTime >= startHours && currentTime <= endHours;
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

//get all ads list
export const getAdsList = (req, res) => {
  try {
    connection.query('SELECT * FROM ads ORDER BY created_at DESC', function (err, result, fields) {
      if (err)
        return res.status(400).send({ success: false, message: err.message });
      if (result) {
        result.forEach((item) => {
          // console.log(item);
          if (item.banner_image && item.banner_image != null) {
            item.banner_image = `${process.env.BASE_URL}/uploads/ads_images/${item.banner_image}`;
          }
          if (item.popup_image && item.popup_image != null) {
            item.popup_image = `${process.env.BASE_URL}/uploads/ads_images/${item.popup_image}`;
          }
          if (item.linked_card_ids) {
            item.linked_card_ids = JSON.parse(item.linked_card_ids); // Parse the JSON string to an array
          }
          if (!item.linked_card_ids) {
            item.linked_card_ids = [];
          }
          // item.active_at = new Date(
          //   item.active_at.toLocaleString('en-US', {
          //     timeZone: 'America/New_York',
          //   })
          // );
          // item.expire_at = new Date(
          //   item.expire_at.toLocaleString('en-US', {
          //     timeZone: 'America/New_York',
          //   })
          // );
          const startHours = new Date(item.active_at);
          const endHours = new Date(item.expire_at);
          const currentTime = new Date();

          // Determine if the offer is active based on current time
          item.is_active = currentTime >= startHours && currentTime <= endHours;
        });
        return res.status(200).send({ success: true, data: result });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

//Create new Ad
export const createNewAd = async (req, res) => {
  const cards = Array.isArray(req.body.cards)
    ? req.body.cards
    : [req.body.cards];
  const { error } = validate({ ...req.body, cards });
  if (error) {
    return res.status(400).send({ data: null, message: error.message });
  }

  const {
    title,
    body,
    active_at,
    expire_at,
    in_new_window,
    venue_to_open,
    url,
    hours_start,
    hours_end,
  } = req.body;

  // time format
  const activeAt = new Date(active_at);
  const expireAt = new Date(expire_at);
  // Convert dates to EST timezone
  const activeAtEST = new Date(
    activeAt.toLocaleString('en-US', { timeZone: 'America/New_York' })
  );
  const expireAtEST = new Date(
    expireAt.toLocaleString('en-US', { timeZone: 'America/New_York' })
  );

  // Convert the dates to SQL DATETIME format (YYYY-MM-DD HH:mm:ss)
  const activeAtSQLFormat = activeAtEST
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  const expireAtSQLFormat = expireAtEST
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  const new_cards = JSON.stringify(cards);
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
  try {
    let new_banner_image = null;
    let new_popup_image = null;

    if (req.files && req.files.banner_image && req.files.popup_image) {
      new_banner_image = await uploadFile(req.files.banner_image, 'ads_images');
      new_popup_image = await uploadFile(req.files.popup_image, 'ads_images');
    }

    const insertAdQuery = `
  INSERT INTO ads (title, body, active_at, expire_at, in_new_window, url, banner_image, created_at, updated_at, popup_image, linked_card_ids)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const adValues = [
      title,
      body,
      activeAtSQLFormat,
      expireAtSQLFormat,
      in_new_window,
      url,
      new_banner_image,
      time, // This assumes `time` is in UTC. If it's in your local time zone, convert it to UTC before passing it here.
      time, // Same as above, if `time` is in local time, convert it to UTC before passing.
      new_popup_image,
      new_cards,
    ];

    await connection.query(insertAdQuery, adValues, (error, results) => {
      if (error) {
        console.error('Error inserting ad:', error);
        return res
          .status(500)
          .send({ success: false, message: 'Failed to create ad.' });
      }
      res.status(200).send({ success: true, message: 'Ad created!' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ success: false, message: 'Internal server error.' });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const id = req.params.id;
    var sql = `DELETE FROM ads WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });
      if (result.affectedRows > 0) {
        res.status(200).send({
          success: true,
          message: 'Successfully deleted',
        });
      } else {
        res.status(404).send({ success: false, message: 'Record not found!' });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

export const updateAd = async (req, res) => {
  const adId = req.params.id; // Assuming the ad ID is passed in the request parameters
  const cards = Array.isArray(req.body.cards)
    ? req.body.cards
    : [req.body.cards];
  const { error } = validate({ ...req.body, cards });
  if (error) {
    return res.status(400).send({ success: false, message: error.message });
  }

  const {
    title,
    body,
    active_at,
    expire_at,
    in_new_window,
    venue_to_open,
    url,
    hours_start,
    hours_end,
  } = req.body;

  const activeAt = new Date(active_at);
  const expireAt = new Date(expire_at);
  const activeAtEST = new Date(
    activeAt.toLocaleString('en-US', { timeZone: 'America/New_York' })
  );
  const expireAtEST = new Date(
    expireAt.toLocaleString('en-US', { timeZone: 'America/New_York' })
  );

  const activeAtSQLFormat = activeAtEST
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  const expireAtSQLFormat = expireAtEST
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

  const new_cards = JSON.stringify(cards);
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let querySet = `
      SET title=?, body=?, active_at=?, expire_at=?, in_new_window=?, url=?, updated_at=?, linked_card_ids=?
  `;
  const adValues = [
    title,
    body,
    activeAtSQLFormat,
    expireAtSQLFormat,
    in_new_window,
    url,
    time, // Update with the current UTC time
    new_cards,
  ];

  if (req.files && req.files.banner_image) {
    querySet += ', banner_image=?';
    const new_banner_image = await uploadFile(
      req.files.banner_image,
      'ads_images'
    );
    adValues.push(new_banner_image);
  }

  if (req.files && req.files.popup_image) {
    querySet += ', popup_image=?';
    const new_popup_image = await uploadFile(
      req.files.popup_image,
      'ads_images'
    );
    adValues.push(new_popup_image);
  }

  try {
    const updateAdQuery = `
      UPDATE ads 
      ${querySet}
      WHERE id=?
    `;

    adValues.push(adId); // ID of the ad to update

    await connection.query(updateAdQuery, adValues, (error, results) => {
      if (error) {
        console.error('Error updating ad:', error);
        return res
          .status(500)
          .send({ success: false, message: 'Failed to update ad.' });
      }
      res.status(200).send({ success: true, message: 'Ad updated!' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ success: false, message: 'Internal server error.' });
  }
};

export const countAdClicks = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    var sql = `UPDATE ads SET clicks = clicks + 1 WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });
      if (result.affectedRows > 0) {
        res.status(200).send({
          success: true,
          message: 'Click added',
        });
      } else {
        res.status(404).send({ success: false, message: 'Record not found!' });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

export const countAdImpression = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    var sql = `UPDATE ads SET impressions = impressions + 1 WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });
      if (result.affectedRows > 0) {
        res.status(200).send({
          success: true,
          message: 'impression added',
        });
      } else {
        res.status(404).send({ success: false, message: 'Record not found!' });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

function validate(data) {
  const schema = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    cards: Joi.array().optional(),
    active_at: Joi.date().required(),
    expire_at: Joi.date().required(),
    // weight: Joi.string().required(),
    // url_type: Joi.string().required(),
    in_new_window: Joi.string().allow(null, '').optional(),
    // venue_to_open: Joi.string().allow(null, '').optional(),
    url: Joi.string().required(),
    popup_image: Joi.string().allow(null, ''),
    banner_image: Joi.string().allow(null, ''),
    // hours_start: Joi.date().required(),
    // hours_end: Joi.date().required(),
  });
  return schema.validate(data);
}
