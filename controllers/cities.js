import connection from "../config/db.js";
import Joi from "joi";

//Pagination list
export const getPaginationList = (req, res) => {
    const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
    try {
        let sql = "SELECT * FROM cities ORDER BY created_at DESC";
        connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            const numOfResults = result.length;
            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            //Determine the SQL LIMIT starting number
            const startingLimit = (page - 1) * resultsPerPage;
            sql = `SELECT * FROM cities ORDER BY created_at DESC LIMIT ${startingLimit}, ${resultsPerPage}`;
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

//Get cities list
export const getCitiesList = async (req, res, next) => {
    try {
        const sql = `SELECT * FROM cities ORDER BY created_at DESC`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(200).send({ success: false, message: err });
            res.status(200).send({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

//Create new cities
export const createNewCities = async (req, res) => {
    const { name, state, lat, lang, is_active } = req.body;
    const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ data: null, message: error.message });
    try {
        const sql = `INSERT INTO cities (name, state, lat, lang, is_active, created_at) VALUES ("${name}", "${state}", "${lat}", "${lang}", "${is_active}", "${created_at}")`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(200).send({ success: false, message: err });
            res.status(201).send({ success: true, message: "Successfully created new city" });
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

//Update Existing cities
export const updateCity = async (req, res) => {
    const id = req.params.id;
    const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const { name, state, lat, lang, is_active } = req.body;
    try {
        const sql = `UPDATE cities SET name="${name}", state="${state}", lat="${lat}", lang="${lang}", is_active="${is_active}", updated_at="${updated_at}" WHERE id=${id}`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(200).send(err);
            if (result.affectedRows > 0)
                return res.status(200).send({ success: true, message: "Successfully updated" });
            res.status(200).send({ success: false, data: "Id not Exist" });
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};

//Delete cities
export const deleteCity = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = `DELETE FROM cities WHERE id=${id}`;
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
        state: Joi.string().required(),
        lat: Joi.string().required(),
        lang: Joi.string().required(),
        is_active: Joi.string().required(),
    });
    return schema.validate(data);
}
