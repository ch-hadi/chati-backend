import connection from '../../config/db.js';
import Joi from 'joi';

//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM reviews';
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM reviews LIMIT ${startingLimit}, ${resultsPerPage}`;
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

//get all Reviews lists
export const getReviewList = (req, res) => {
  try {
    connection.query('SELECT * FROM reviews', function (err, result, fields) {
      if (err) throw err;
      res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//get all Reviews list
export const getReviewApproveList = (req, res) => {
  try {
    const id = req.params.id;
    connection.query(
      `SELECT * FROM reviews where approve=1 AND id_card=${id}`,
      function (err, result, fields) {
        if (err) throw err;
        res.json({ success: true, data: result });
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

//Create new Review
export const createNewReview = async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({ data: null, message: error.message });
  const { name, email, save_type, rating, review, agree, id_card } = req.body;
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    await connection.query(
      `INSERT INTO reviews (name, email, save_type, rating, review, agree, id_card, created_at) values("${name}", "${email}", "${save_type}", "${rating}", "${review}", "${agree}", "${id_card}", "${time}")`,
      function (err, result, fields) {
        // if any error while executing above query, throw error
        if (err) return res.status(400).send({ success: false, err });
        // if there is no error, you have the result
        if (result.affectedRows > 0)
          return res.status(201).send({
            success: true,
            message: 'Your Review Add For Approval',
          });
        res.status(201).json({
          success: false,
          message: result.details,
        });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateReview = async (req, res) => {
  try {
    const update_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const id = req.params.id;
    const { approve } = req.body;
    var sql = `UPDATE reviews SET approve = '${approve}', updated_at= '${update_time}'  WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });

      if (result.affectedRows > 0) {
        res.send({
          success: true,
          message: 'Review Approved',
        });
      } else {
        res.send({
          success: false,
          message: 'Review not Exist',
        });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

export const updateBatchReviews = async (req, res) => {
  try {
    const update_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const { approve, ids } = req.body;
    var sql = `UPDATE reviews SET approve = '${approve}', updated_at= '${update_time}'  WHERE id IN (${ids.map(
      (item) => parseInt(item)
    )})`;
    connection.query(sql, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });
      res.send({
        success: true,
        message: 'Reviews' + (approve == 1 ? ' Approved!' : ' Rejected!'),
      });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

function validate(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    save_type: Joi.string(),
    rating: Joi.number(),
    review: Joi.string(),
    agree: Joi.number(),
    id_card: Joi.number().required(),
  });
  return schema.validate(data);
}
