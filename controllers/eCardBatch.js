import connection from "../config/db.js";
import Joi from "joi";
import moment from "moment";
import { getUniqueECardNumber } from "../utils/helpers.js";

export const getPaginatedList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 25;
  try {
    let sql = "SELECT * FROM ecard_batches ORDER BY created_at DESC";
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT eb.*, c.card_name FROM ecard_batches AS eb JOIN cards AS c ON c.id = eb.card_id ORDER BY created_at DESC LIMIT ${startingLimit}, ${resultsPerPage}`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        return res.json({ success: true, data: results, page, numberOfPages });
      })

    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

export const generateBulkEcards = (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ data: null, message: error.message });
  
  let { card_id, quantity, prefix } = req.body;
  const now = moment();
  const currentDate = now.format('YYYY-MM-DD');
  const currentDateTime = now.format('YYYY-MM-DD HH:mm:ss');

  try {
    const sqlbatch = `INSERT INTO ecard_batches (card_id, prefix, quantity, created_at) VALUES (?, ?, ?, ?)`;
    connection.query(sqlbatch, [card_id, prefix, quantity, currentDateTime], (err, result) => {
      if (err) return res.status(404).send({ success: false, message: err })
      
      const batchId = result.insertId;
      let eCardsData = [];
      for (let i = 0; i < quantity; i++) {
        eCardsData.push([getUniqueECardNumber(prefix), card_id, currentDate, 0, batchId]);
      }
      const sqlCards = `INSERT INTO e_cards (ecard_no, card_id, start_date, registered_count, ecard_batch_id) VALUES ?`;
      connection.query(sqlCards, [eCardsData], (errcards, resultCards) => {
        if (errcards) return res.status(400).send(errcards);
        
        return res.status(201).send({ success: true, message: "E-Cards generated successfully!", data: {id: batchId} });
      });
    });
  } catch (error) {
    return res.status(502).send({ success: false, message: error });
  }
};

export const getBatchData = (req, res) => {
  const id = req.params.id;
  try {
    connection.query(`SELECT ec.ecard_no, ec.start_date FROM e_cards AS ec WHERE ec.ecard_batch_id=${id}`, function (err, result, fields) {
      if (err) return res.status(200).send({ success: false, message: err });

      return res.json({ success: true, message: "Success", data: result});
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error });
  }
};

function validate(data) {
  const schema = Joi.object({
    card_id: Joi.number().min(1).required().messages({
      'number.base': 'Card Id must be a number',
      'number.min': 'Card Id must be greater than or equal to 1',
      'any.required': 'Card is required'
    }),
    quantity: Joi.number().min(1).required().messages({
      'number.base': 'Quantity must be a number',
      'number.min': 'Quantity must be greater than or equal to 1',
      'any.required': 'Quantity is required'
    }),
    prefix: Joi.string().max(4).allow(null, '').optional().messages({
      'number.max': 'Prefix can be maximum 4 charcters'
    })
  });
  return schema.validate(data);
}