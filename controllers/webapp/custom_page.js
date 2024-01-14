import connection from '../../config/db.js';
import Joi from 'joi';

//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM custom_page';
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM custom_page LIMIT ${startingLimit}, ${resultsPerPage}`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        let iterator = page - 3 < 1 ? 1 : page - 3;
        let endingLink =
          iterator + 4 <= numberOfPages
            ? iterator + 4
            : page + (numberOfPages - page);
            results.forEach(item => {
              item.description = item.description.replace(/'/g, "");  // Remove all single quotes
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

//get all Page lists
export const getCustomPageList = (req, res) => {
  try {
    connection.query('SELECT * FROM custom_page WHERE status = 1', function (err, result, fields) {
      if (err) throw err;
      // Modify the "description" field to remove single quotes
      result.forEach(item => {
        item.description = item.description.replace(/'/g, "");  // Remove all single quotes
      });;

      res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
}

//Create new Page
export const createCustomPage = async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({ data: null, message: error.message });
  const { page_title, slug, page_description, description, card_id, status} = req.body;
  const escapedDescription = connection.escape(description);
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
  try {
    const qu = `SELECT slug from custom_page WHERE slug="${slug}"`
   await connection.query(qu,(er,resu)=>{
    if (er) return res.status(201).send({success:false, message:er.message})
    // console.log(resu[0])
    if(resu[0] ) return res.status(201).send({success:false, message:'Slug is already in use!'})
     connection.query(
      `INSERT INTO custom_page (page_title, slug, page_description, description, card_id, status, created_at) VALUES ("${page_title}", "${slug}", "${page_description}", "${escapedDescription}", "${card_id}", "${status}", "${time}")`,
      function (err, result) {
        // if any error while executing above query, throw error
        if (err) return res.status(400).send({ success: false, message: err });
        // if there is no error, you have the result
        if (result.affectedRows > 0)
          return res.status(201).send({
            success: true,
            message: 'Your page is added!',
          });
        res.status(201).json({
          success: false,
          message: result.details,
        });
      }
    );
   })
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
};

export const updateCustomPage = async (req, res) => {
  try {
    const update_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const id = req.params.id;
    const { page_title, slug, page_description, description, card_id, status} = req.body;
    const escapedDescription = connection.escape(description);
    var sql = `UPDATE custom_page SET page_title = '${page_title}', slug = "${slug}", page_description = "${page_description}", description = "${escapedDescription}", card_id = "${card_id}", status = "${status}", updated_at= '${update_time}'  WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });

      if (result.affectedRows > 0) {
        res.send({
          success: true,
          message: 'Page updated !',
        });
      } else {
        res.send({
          success: false,
          message: 'Page not Exist',
        });
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: error });
  }
};

export const deleteCustomPage = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `DELETE FROM custom_page WHERE id=${id}`;
    connection.query(sql, async (err, result) => {
      if (err) return res.status(200).send(err);
      if (result.affectedRows > 0) {
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

export const getCustomPage= async (req,res) => {
  const id = req.params.id;
  try {
    
    const sql = `SELECT * FROM custom_page WHERE slug="${id}" AND status = 1`;
    connection.query(sql, async (err, result) => {
      if (err) return res.status(200).send(err);
      if (result[0]) {
        result.forEach(item => {
          item.description = item.description.replace(/'/g, "");  // Remove all single quotes
        });
        return res
          .status(200)
          .send({ success: true, data:result[0] });
      } else {
        res.status(200).send({ success: false, message: 'Record not found' });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

export const getAllDetailsOnCardIdLikeOffersLocationsResturants =async(req,res)=>{
  const id = req.params.id;
  // console.log(id)
  try {
    const sql = `Select card_id FROM custom_page WHERE slug="${id}"`;
    connection.query(sql, async (err, result) => {
      if (err) return res.status(200).send(err);
      if (result && result.length>0) {
        // return;
        let cid = result[0].card_id
        let sqlDetailed = `SELECT DISTINCT o.*, r.name AS resturant_name, l.phone AS phone, l.address, l.latitude, l.latitude, r.pricing_range AS price, c.card_name AS card_name
        FROM offers o
        INNER JOIN offer_cards oc ON o.id = oc.offer_id
        INNER JOIN resturants r ON o.resturant_id = r.id
        INNER JOIN cards c ON oc.card_id = c.id
        INNER JOIN locations l ON r.id = l.resturant_id
        WHERE oc.card_id = ${cid}`;
        connection.query(sqlDetailed,async(err, result)=>{
          if(err) return res.status(200).send({ success: false, message: err });
          if(result){
            result.forEach((item) => {
            if(
                item.image &&
                item.image != null &&
                item.image != 'null' &&
                item.image != 'NULL'
              ) {
                item.image = `${process.env.BASE_URL}/uploads/restaurant_images/${item.image}`;
              }
          })
          return res.status(200).send({ success: false, data: result })
        }})
      } else {
        res.status(200).send({ success: false, message: 'Record not found' });
      }
    });
    
  } catch (error) {
    
  }
} 

function validate(data) {
  const schema = Joi.object({
    page_title: Joi.string().required(),
    description: Joi.string().allow(null, '').optional(),
    page_description: Joi.string().allow(null, '').optional(),
    domain_id: Joi.string(),
    slug: Joi.string(),
    card_id:Joi.number().required(),
    status:Joi.string().required()
  });
  return schema.validate(data);
}
