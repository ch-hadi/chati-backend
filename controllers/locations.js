import connection from '../config/db.js';
import Joi from 'joi';
import mysql from 'mysql';

const pool = mysql.createPool({
  host: process.env.ENVIRONMENT,
  user: process.env.ROOTS,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
});

//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM locations ORDER BY created_at DESC';
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM locations ORDER BY created_at DESC LIMIT ${startingLimit}, ${resultsPerPage} `;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        let iterator = page - 3 < 1 ? 1 : page - 3;
        let endingLink =
          iterator + 4 <= numberOfPages
            ? iterator + 4
            : page + (numberOfPages - page);
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

//Get Locations list
export const getLocationsList = async (req, res) => {
  try {
    const sql = `SELECT * FROM locations ORDER BY created_at DESC`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(200).send({ success: false, message: err });
      res.status(200).send({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
//Filter List
// export const getFilterlist = async (req, res) => {
//     const { inputValue } = req.body;
//     try {
//         const sql = `SELECT * FROM locations WHERE name LIKE '%${inputValue}%'`;
//         connection.query(sql, (err, result) => {
//             if (err) return res.status(200).send({ success: false, message: err });
//             res.status(200).send({ success: true, data: result });
//         });
//     } catch (error) {
//         res.status(500).send(error);
//     }
// };

export const getFilterlist = async (req, res) => {
  const { latitude, longitude, radius } = req.body;
  try {
    // Convert radius from kilometers to degrees (assuming Earth's radius is approximately 6371 kilometers)
    const radiusInDegrees = radius / 111.32; // 1 degree is approximately 111.32 kilometers

    // Haversine formula for calculating distances between geographical points
    const sql = `
      SELECT latitude, longitude, resturant_id
      FROM locations
      WHERE (
        6371 * ACOS(
          COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(?)) +
          SIN(RADIANS(?)) * SIN(RADIANS(latitude))
        )
      ) < ?
    ORDER BY created_at DESC`;

    pool.query(
      sql,
      [latitude, longitude, latitude, radiusInDegrees],
      (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results);
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Create new Location
export const createNewLocation = async (req, res) => {
  const {
    name,
    resturant_id,
    address,
    phone,
    email,
    city_id,
    latitude,
    longitude,
    is_active,
    address2,
    neighbourhood,
    post_code
  } = req.body;
  const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });

  try {
    const sql = `INSERT INTO locations (name, resturant_id, address, phone, email, city_id, latitude, longitude, is_active, created_at, address2, neighbourhood, post_code) VALUES ("${name}", "${resturant_id}", "${address}", "${phone}", "${email}", "${city_id}", "${latitude}", "${longitude}", "${is_active}", "${created_at}", "${address2}", "${neighbourhood}", "${post_code}")`;
    await connection.query(sql, (err, result) => {
      if (err) {
        res.status(400).send({ success: false, message: err.sqlMessage });
      } else {
        res.status(201).send({
          success: true,
          message: 'Successfully new location created.',
        });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Update Existing Location
export const updateLocation = async (req, res) => {
  const id = req.params.id;
  const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const {
    name,
    resturant_id,
    address,
    phone,
    email,
    city_id,
    latitude,
    longitude,
    is_active,
    address2,
    neighbourhood,
    post_code
  } = req.body;
  try {
    const sql = `UPDATE locations SET name="${name}", resturant_id="${resturant_id}", address="${address}", phone="${phone}", email="${email}", city_id="${city_id}", latitude="${latitude}", longitude="${longitude}", is_active="${is_active}", updated_at="${updated_at}", address2="${address2}", neighbourhood="${neighbourhood}", post_code="${post_code}" WHERE id=${id}`;
    connection.query(sql, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });
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

//Delete Location
export const deleteLocation = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `DELETE FROM locations WHERE id=${id}`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(200).send(err);
      if (result.affectedRows > 0)
        return res
          .status(200)
          .send({ success: true, message: 'Successfully deleted' });
      res.status(200).send({ success: false, message: 'Record not found' });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

function validate(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    resturant_id: Joi.number().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    city_id: Joi.number().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    is_active: Joi.number().required(),
    address2: Joi.string().allow(null),
    neighbourhood: Joi.string().allow(null),
    post_code: Joi.string().allow(null)
  });
  return schema.validate(data);
}
