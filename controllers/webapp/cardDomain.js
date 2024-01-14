import connection from "../../config/db.js";

//get all cards with domain list
export const getCardsWithDomainList = (req, res) => {
    try {
        let q = req.query.qu;
        let isPrivate = (req.query.is_private === "1" || req.query.is_private === "0") ? parseInt(req.query.is_private) : null;
        
        var getquery = `SELECT ca.id,ca.card_name, ca.card_no, ca.price, ca.created_at, ca.domain_id, ca.is_active, ca.description, ca.image, ca.validity, do.name FROM cards AS ca LEFT JOIN domains AS do ON ca.id WHERE domain_id=do.id AND ca.is_active = 1 `;
        if (isPrivate !== null) {
            getquery += `AND ca.is_private = ${isPrivate} `
        }
        if (q == "price") {
            getquery += `ORDER BY ca.price ASC`
        }
        else if (q == "price-low") {
            getquery += `ORDER BY ca.price DESC`
        }
        else if (q == "date") {
            getquery += `ORDER BY ca.created_at DESC`
        } else {
            getquery += `ORDER BY ca.price ASC`
        }
        connection.query(getquery, function (err, result, fields) {
            if (err) return res.status(200).send({ success: false, message: err });
            result.forEach(item => {
                if (item.image && item.image != null && item.image != "NULL" && item.image != "null") {
                    item.image = `${process.env.BASE_URL}/uploads/card_images/${item.image}`;
                } else {
                  item.image = null;
                }
            });
            res.json({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};
//get all cards with domain list
export const getCardWithDomainDetail = (req, res) => {
    try {
        const id = req.params.id;
        var getquery = `SELECT ca.id,ca.card_name, ca.card_no, ca.price, ca.created_at, ca.domain_id, ca.description, ca.validity, ca.image, do.name FROM cards AS ca LEFT JOIN domains AS do ON ca.id WHERE domain_id=do.id AND ca.is_active = 1 AND ca.id=${id}`;
        connection.query(getquery, function (err, result, fields) {
            if (err) return res.status(200).send({ success: false, message: err });
            if (result[0].image && result[0].image != null && result[0].image != "NULL" && result[0].image != "null") {
                result[0].image = `${process.env.BASE_URL}/uploads/card_images/${result[0].image}`;
            } else {
                result[0].image = null;
            }
            res.json({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};

//get all domains which are associated whith different cards
export const getDomainAssociatedWithCards = (req, res) => {
    try {
        const id = req.params.id;
        var getquery = `SELECT ca.id,ca.card_name, ca.card_no, ca.price, ca.expiry_date, ca.created_at, ca.domain_id, do.name, do.created_at FROM domains AS do LEFT JOIN cards AS ca ON do.id=ca.domain_id WHERE do.id=${id} ORDER BY ca.price ASC`;
        connection.query(getquery, function (err, result, fields) {
            if (err) return res.status(200).send({ success: false, message: err });
            res.json({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};







