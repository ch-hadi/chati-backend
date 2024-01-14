import admin from "../config/firebase-config.js";
import connection from "../config/db.js";
import Joi from "joi";
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

//Send notification from nodejs server to firebase server.
export const firebaseNotification = (req, res) => {
    const registrationToken = req.body.registrationToken
    const message = req.body.message
    const options = notification_options
    const message_notification = {
        notification: {
            title: "Account Deposit",
            body: "A deposit to your savings account has just cleared."
        },
        data: {
            account: "Savings",
            balance: "$3020.25"
        }
    };
    admin.messaging().sendToDevice(registrationToken, message_notification, options)
        .then(response => {
            console.log(response)
            res.status(200).send(`Notification sent successfully ==${JSON.stringify(response)}`);
        })
        .catch(error => {
            res.status(401).send(error)
        });
}
//Pagination list
export const getPaginationList = (req, res) => {
    const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
    try {
      let sql = "SELECT * FROM notifications";
      connection.query(sql, function (err, result, fields) {
        if (err) throw err;
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        sql = `SELECT * FROM notifications LIMIT ${startingLimit}, ${resultsPerPage}`;
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
//get all notification list
export const getNotificationList = (req, res) => {
    try {
        connection.query("SELECT * FROM notifications", function (err, result, fields) {
            if (err) throw err;
            res.json({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};

//Create new Notification
export const createNewNotification = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ data: null, message: error.message });
    const { title, body, card_type, push_at, url_type, in_new_window, venue_to_open, url } = req.body;
    const time = new Date().toISOString().slice(0, 19).replace("T", " ");

    try {
        await connection.query(
            `INSERT INTO notifications (title, body, card_type, push_at, url_type, in_new_window, venue_to_open, url, created_at) values("${title}", "${body}", "${card_type}", "${push_at}", "${url_type}", "${in_new_window}", "${venue_to_open}", "${url}", "${time}")`,
            function (err, result, fields) {
                // if any error while executing above query, throw error
                if (err) return res.status(400).send({ success: false, err });
                // if there is no error, you have the result
                if (result.affectedRows > 0)
                    return res.status(201).send({
                        success: true,
                        message: "Successfully new Notification created",
                    });
                res.status(201).json({
                    success: false,
                    message: result.details,
                });
            }
        );
    } catch (error) {
        console.log(error)
        res.status(500).send({success: false, error});
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const id = req.params.id;
        var sql = `DELETE FROM notifications WHERE id = ${id}`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(400).send({ success: false, message: err.sqlMessage });
            if (result.affectedRows > 0) {
                res.status(200).send({
                    success: true,
                    message: "Successfully deleted",
                });
            } else {
                res.status(404).send({ success: false, message: "Record not found!" });
            }
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};

export const updateNotification = async (req, res) => {
    try {
        const update_time = new Date().toISOString().slice(0, 19).replace("T", " ");
        const id = req.params.id;
        const { title, body, card_type, push_at, url_type, in_new_window, venue_to_open, url } = req.body;
        var sql = `UPDATE notifications SET title = '${title}', body= '${body}', card_type= '${card_type}', push_at= '${push_at}', url_type= '${url_type}', in_new_window= '${in_new_window}', venue_to_open= '${venue_to_open}', url= '${url}', updated_at= '${update_time}'  WHERE id = ${id}`;
        connection.query(sql, (err, result) => {
            if (err) return res.status(400).send({ success: false, message: err.sqlMessage });

            if (result.affectedRows > 0) {
                res.send({
                    success: true,
                    message: "Successfully updated Notification",
                });
            } else {
                res.send({
                    success: false,
                    message: "Record not Exist",
                });
            }
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};

function validate(data) {
    const schema = Joi.object({
        title: Joi.string().required(),
        body: Joi.string().required(),
        card_type: Joi.string().required(),
        push_at: Joi.date().required(),
        url_type: Joi.string().required(),
        in_new_window: Joi.string().optional().allow(''),
        venue_to_open: Joi.string().optional().allow(''),
        url: Joi.string().required(),
    });
    return schema.validate(data);
}
