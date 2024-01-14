import connection from "../../config/db.js";
import Joi from "joi";

export const getPaymentCards = async (req, res) => {
    try {
        const sql = `SELECT * FROM payment_cards WHERE user_id = ${req.user.id} `;
        connection.query(sql, (err, result) => {
            if (err) return res.status(200).send({ success: false, message: err });
            return res.status(200).send({ success: true, data: result });
        });
    } catch (error) {
        return res.status(400).send({ success: false, message: error });
    }
};

export const createPaymentCard = async (req, res) => {
    const userId = req.user.id;
    const { card_number, expiration_date, cvv } = req.body;

    const { error } = validate(req.body);
    if (error) return res.status(400).send({ success: false, message: error.message });
    
    try {
        const sql = `INSERT INTO payment_cards (user_id, card_number, expiration_date, cvv) VALUES ("${userId}", "${card_number}", "${expiration_date}", "${cvv}")`;
        await connection.query(sql, (err, result) => {
            if (err) {
                res.status(400).send({ success: false, message: err.sqlMessage });
            } else {
                res.status(201).send({ success: true, message: "Payment card saved successfully!", data:{id: result.insertId} });
            }
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updatePaymentCard = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    const { card_number, expiration_date, cvv } = req.body;

    const { error } = validate(req.body);
    if (error) return res.status(400).send({ success: false, message: error.message });

    try {
        const sql = `UPDATE payment_cards SET card_number="${card_number}", expiration_date="${expiration_date}", cvv="${cvv}" WHERE id=${id} AND user_id = ${userId}`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(400).send({ success: false, message: err.sqlMessage });
            if (result.affectedRows > 0) {
                return res.status(200).send({ success: true, message: "Successfully Updated!" });
            } else {
                return res.status(200).send({ success: false, data: "Update failed. Something went wrong!" });
            }
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};

export const deletePaymentCard = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    try {
        const sql = `DELETE FROM payment_cards WHERE id=${id} AND user_id = ${userId}`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(200).send(err);
            
            if (result.affectedRows > 0)
                return res.status(200).send({ success: true, message: "Successfully deleted!" });
            
            return res.status(200).send({ success: false, message: "Delete failed. Something went wrong!" });
        });
    } catch (error) {
        return res.status(500).send(error);
    }
};

function validate(data) {
  const schema = Joi.object({
    card_number: Joi.string().required(),
    expiration_date: Joi.string().required().min(5).max(5),
    cvv: Joi.string().required()
  });
  return schema.validate(data);
}
