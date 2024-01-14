import connection from "../config/db.js";
//Total counts of users, cards, offers, venues
export const totalRecords = (req, res) => {
    try {
        var sql = `SELECT 'cards' cards, COUNT(*) total FROM cards UNION SELECT 'offers' domains, COUNT(*) total FROM domains UNION SELECT 'users' users, COUNT(*) total FROM users UNION SELECT 'venues' resturants, COUNT(*) total FROM resturants UNION SELECT 'locations' locations, COUNT(*) total FROM locations`;
        var ratingSql = `SELECT cards.id, cards.card_name AS name, AVG(reviews.rating) AS value FROM reviews LEFT JOIN cards ON reviews.id_card=cards.id GROUP BY cards.id ORDER BY value DESC LIMIT 5`;
        connection.query(sql, (err, result1) => {
            if (err) return res.status(400).send({ success: false, message: err });
            connection.query(ratingSql, (err, result2) => {
                if (err) return res.status(400).send({ success: false, message: err });
                res.status(200).send({ success: true, data: { counts: result1, ratings: result2 } })
            })
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error })
    }
}
// //Total rating of cards
export const ratingPointsOnCards = (req, res) => {
    try {
        connection.query(ratingSql, (err, result) => {
            if (err) return res.status(400).send({ success: false, message: err });
            res.status(200).send({ success: true, data: result })
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error })
    }
}

export const getUsersAndResturantsWithLatLng = (req, res) => {
    try {
        connection.query(`SELECT first_name, last_name, country, latitude, longitude  FROM users WHERE latitude !="" AND longitude !=""`, (err, result1) => {
            if (err) return res.status(400).send({ success: false, message: err });
            connection.query(`SELECT name, latitude, longitude FROM resturants WHERE latitude !="" AND longitude !=""`, (err, result2) => {
                if (err) return res.status(400).send({ success: false, message: err });
                res.status(200).send({ success: true, data: { users: result1, resturants: result2 } })
            })
        })
    } catch (error) {
        res.status(500).send({ success: false, message: error })
    }
}
