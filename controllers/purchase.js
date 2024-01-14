import connection from '../config/db.js';
import Joi from 'joi';

//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM new_purchases ORDER BY created_at DESC';
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM new_purchases ORDER BY created_at DESC LIMIT ${startingLimit}, ${resultsPerPage}`;
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

//Get Venue list
export const getPurchaseList = async (req, res) => {
  try {
    const sql = `SELECT * FROM purchases ORDER BY created_at DESC`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(200).send({ success: false, message: err });
      res.status(200).send({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
//Filter List
export const getFilterlist = async (req, res) => {
  const { inputValue } = req.body;
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  const startingLimit =
    (parseInt(req.query.page ? req.query.page : 1) - 1) * resultsPerPage;
  try {
    const sql = `SELECT p.id, p.user, p.purchase_no, p.bought_at, p.email, p.status, p.delivery_type, p.address, p.note, p.card_type FROM purchases AS p LEFT JOIN users AS u on u.id=p.user LEFT JOIN deliveries AS d on d.id=p.delivery_type WHERE d.name LIKE '%${inputValue}%' OR u.first_name LIKE '%${inputValue}%' or p.purchase_no like '%${inputValue}%' LIMIT ${startingLimit},${resultsPerPage}`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(200).send({ success: false, message: err });
      res.status(200).send({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
//Create new Purchase
export const createNewPurchase = async (req, res) => {
  const {
    user,
    purchase_no,
    bought_at,
    email,
    status,
    delivery_type,
    address,
    note,
    card_type,
    e_card,
  } = req.body;
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
  //   const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  try {
    const sql = `INSERT INTO purchases (user, purchase_no, bought_at, email, status, delivery_type, address, note, card_type, e_card, created_at) VALUES ("${user}", "${purchase_no}", "${bought_at}", "${email}", "${status}", "${delivery_type}", "${address}", "${
      note || 0
    }", "${card_type}", "${e_card}", "${time}")`;
    connection.query(sql, (err, result) => {
      if (err) {
        res.status(400).send({ success: false, message: err.sqlMessage });
      } else {
        res.status(201).send({
          success: true,
          message: 'Successfully New Purchase created.',
        });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

//Update Existing Purchase
export const updatePurchase = async (req, res) => {
  const id = req.params.id;
  const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const {
    user,
    purchase_no,
    bought_at,
    email,
    status,
    delivery_type,
    address,
    note,
    card_type,
    e_card,
  } = req.body;
  try {
    const sql = `UPDATE purchases SET user="${user}", purchase_no="${purchase_no}", bought_at="${bought_at}", email="${email}", status="${status}", delivery_type="${delivery_type}", address="${address}", note="${note}", card_type="${card_type}", e_card="${e_card}", updated_at="${updated_at}" WHERE id=${id}`;
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

//Delete Purchase
export const deletePurchase = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `DELETE FROM purchases WHERE id=${id}`;
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
    user: Joi.string().required(),
    purchase_no: Joi.string().required(),
    bought_at: Joi.string(),
    email: Joi.string().required(),
    status: Joi.string(),
    delivery_type: Joi.string(),
    address: Joi.string(),
    note: Joi.string(),
    card_type: Joi.number(),
    e_card: Joi.string().required(),
  });
  return schema.validate(data);
}
