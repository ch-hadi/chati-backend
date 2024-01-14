import connection from "../config/db.js";
import Joi from "joi";

//Pagination list
export const getPaginationList = (req, res) => {
    const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
    try {
      let sql = "SELECT * FROM venues ORDER BY created_at DESC";
      connection.query(sql, function (err, result, fields) {
        if (err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        sql = `SELECT * FROM venues ORDER BY created_at DESC LIMIT ${startingLimit}, ${resultsPerPage}`;
        connection.query(sql, (err, results) => {
          if (err) throw err;
          let iterator = (page - 3) < 1 ? 1 : page - 3;
          let endingLink = (iterator + 4) <= numberOfPages ? (iterator + 4) : page + (numberOfPages - page);
          res.json({ success: true, data: results, page, iterator, endingLink, numberOfPages });
        })
  
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error });
    }
  };

//Get Venue list
export const getVenueList = async (req, res) => {
    try {
        const sql = `SELECT * FROM venues ORDER BY created_at DESC`;
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
    const { inputValue, dropDownValue } = req.body;
    try {
        const sql = `SELECT * FROM venues WHERE name LIKE '%${inputValue}%' OR pricing_range='${dropDownValue}'`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(200).send({ success: false, message: err });
            res.status(200).send({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).send(error);
    }
};
//Create new Venue
export const createNewVenue = async (req, res) => {
    const { name, region, description, pricing_range, cusine, website_url, menu, rating, votes, resturant_id } = req.body;
      const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ success: false, message: error.message });
    try {
        const sql = `INSERT INTO venues (name, region, description, pricing_range, cusine, website_url, menu, rating, votes, resturant_id, created_at) VALUES ("${name}", "${region}", "${description}", "${pricing_range}", "${cusine}", "${website_url}", "${menu}", "${rating || 0}", "${votes}", "${resturant_id}", "${created_at}")`;
        await connection.query(sql, (err, result) => {
            if (err) {
                res.status(400).send({ success: false, message: err.sqlMessage });
            } else {
                res.status(201).send({ success: true, message: "Successfully New Venue created." });
            }

        });
    } catch (error) {
        res.status(500).send(error);
    }
};

//Update Existing Venue
export const updateVenue = async (req, res) => {
    const id = req.params.id;
      const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const { name, region, description, pricing_range, cusine, website_url, menu, rating, votes, resturant_id } = req.body;
    try {
        const sql = `UPDATE venues SET name="${name}", region="${region}", description="${description}", pricing_range="${pricing_range}", cusine="${cusine}", website_url="${website_url}", menu="${menu}", rating="${rating || 0}", votes="${votes}", resturant_id="${resturant_id}", updated_at="${updated_at}" WHERE id=${id}`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(400).send({ success: false, message: err.sqlMessage });
            if (result.affectedRows > 0)
                return res.status(200).send({ success: true, message: "Successfully updated" });
            res.status(200).send({ success: false, data: "Id not Exist" });
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};

//Delete Venue
export const deleteVenue = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = `DELETE FROM venues WHERE id=${id}`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(200).send(err);
            if (result.affectedRows > 0)
                return res
                    .status(200)
                    .send({ success: true, message: "Successfully deleted" });
            res.status(200).send({ success: false, message: "Record not found" });
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

function validate(data) {
    const schema = Joi.object({
        name: Joi.string().required(),
        region: Joi.string().required(),
        description: Joi.string(),
        pricing_range: Joi.string().required(),
        cusine: Joi.string(),
        website_url: Joi.string(),
        menu: Joi.string(),
        rating: Joi.number(),
        votes: Joi.number(),
        resturant_id: Joi.string().required()
    });
    return schema.validate(data);
}
