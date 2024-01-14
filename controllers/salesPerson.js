import connection from "../config/db.js";
import Joi from "joi";

//Pagination list
export const getPaginationList = (req, res) => {
    const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
    try {
        let sql = "SELECT * FROM sales_people";
        connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            const numOfResults = result.length;
            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;
            //Determine the SQL LIMIT starting number
            const startingLimit = (page - 1) * resultsPerPage;
            sql = `SELECT * FROM sales_people LIMIT ${startingLimit}, ${resultsPerPage}`;
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

//Get sales_people list
export const getSalesPeopleList = async (req, res, next) => {
    try {
        const sql = `SELECT * FROM sales_people`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(200).send({ success: false, message: err });
            res.status(200).send({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).send(error);
    }
};
//Get sales_people list
export const getSalesPeopleCity = async (req, res, next) => {
    try {
        const sql = `SELECT * FROM sales_people_and_cities`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(200).send({ success: false, message: err });
            res.status(200).send({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).send(error);
    }
};
//Create new sales_people
export const createNewSalesPeople = async (req, res) => {
    const { first_name, last_name, phone, email, is_active, role, citiesId } = req.body;
    const created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ data: "Send proper value", message: error.message });
    try {


        const sql = `INSERT INTO sales_people (first_name, last_name, phone, email, is_active, role, created_at) VALUES ("${first_name}", "${last_name}", "${phone}", "${email}", "${is_active}", "${role}", "${created_at}")`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(200).send({ success: false, message: err });
            connection.query(`SELECT id FROM sales_people WHERE email='${email}'`, (err, record) => {
                if (err) return res.status(200).send({ success: false, message: err });
                if (record.length > 0) {
                    var query1 = `INSERT INTO sales_people_and_cities (person_id, city_id) VALUES `;
                    let personId = JSON.parse(JSON.stringify(record))
                    query1 += `${citiesId.map((item) => {
                        return (`(${personId[0].id}, ${item})`)
                    })}`

                    connection.query(query1, [citiesId.map(item => (record.id, item))], (err, result) => {
                        if (err) return res.status(200).send({ success: false, message: err });
                        res.status(201).send({ success: true, message: "Successfully created new Sale Person" });
                    })
                }
            })

        });
    } catch (error) {
        res.status(500).send(error);
    }
};

//Update Existing sales_people
export const updateSalePeople = async (req, res) => {
    const id = req.params.id;
    const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
    const { first_name, last_name, phone, email, is_active, role, citiesId } = req.body;
    try {
        const sql = `UPDATE sales_people SET first_name="${first_name}", last_name="${last_name}", phone="${phone}", email="${email}", is_active="${is_active}", role="${role}", updated_at="${updated_at}" WHERE id=${id}`;
        await connection.query(sql, async function (err, result) {
            if (err) return res.status(200).send(err);

            if (result.affectedRows > 0) {
                // Deleting previous data against this coupon id
                await connection.query(`DELETE FROM sales_people_and_cities WHERE person_id=${id}`, (err, result) => {});

                if (citiesId.length > 0) {
                    const data = citiesId.map((value, index) => [id, value]);
                    var query1 = `INSERT INTO sales_people_and_cities (person_id, city_id) VALUES ?`;
                    await connection.query(query1, [data], (err, results) => {
                        if (err) return res.status(400).send(err);
                        if (results) {
                          res.status(201).send({ success: true, message: "Successfully updated" });
                        } else {
                            res.status(201).json({ success: false, message: "Update Failed" });
                        }
                    })
                }
            } else {
                res.status(201).json({ success: true, message: "Successfully updated" });
            }
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};

// Delete sales_people
export const deleteSalePeople = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = `DELETE FROM sales_people WHERE id=${id}`;
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
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().required(),
        is_active: Joi.string().required(),
        role: Joi.string().required(),
        citiesId: Joi.array().items(Joi.number())
    });
    return schema.validate(data);
}
