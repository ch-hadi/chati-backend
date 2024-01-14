import connection from '../config/db.js';

//get all delivery list
export const getDeliveryList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM deliveries ORDER BY created DESC';
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM deliveries LIMIT ${startingLimit}, ${resultsPerPage}`;
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
      // res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
