import connection from "../config/db.js";
//Association Resturent with cards
export const resturantWithCards = async (req, res) => {
  const { card_id, resturant_ids } = req.body;
  try {
    const query1 = `SELECT * FROM resturant_card WHERE resturant_id IN (${resturant_ids.map(id => id)}) AND card_id IN (${card_id.map(id => id)})`;
    var query2 = `INSERT INTO resturant_card(resturant_id, card_id) VALUES `;
    var toOneArray = function (card_id, resturant_ids) {
      return resturant_ids.map(function (name, i) {
        return card_id.map(id => `(${[name, id]})`)
      });
    }
    query2 += toOneArray(card_id, resturant_ids)
    connection.query(query1, (err, result) => {
      if (err) return res.status(200).send(err);
      if (result.length > 0) return res.send({ success: true, message: "Card already associated with this resturant." })
      connection.query(query2, (err, result) => {
        if (result.affectedRows > 0)
          return res
            .status(200)
            .send({ success: true, message: "Successfully Associated" });
        res.status(200).send({ success: false, data: "Id not Exist" });
      })


    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

//Association domain with cards
export const domainWithCards = async (req, res) => {
  const updated_at = new Date().toISOString().slice(0, 19).replace("T", " ");
  const { domain_id, card_ids } = req.body;
  try {
    var sql = `UPDATE cards SET domain_id = ${domain_id}, updated_at= '${updated_at}' WHERE id IN (${card_ids.map(
      (id) => {
        return `'${id}'`;
      }
    )})`;

    connection.query(sql, (err, result) => {
      if (err) return res.status(400).send({ success: false, message: err.sqlMessage });
      if (result.affectedRows > 0)
        return res
          .status(200)
          .send({ success: true, message: "Successfully updated" });
      res.status(200).send({ success: false, data: "Id not Exist" });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

//Retrive resturants combination with domains, cards
export const resturantAgainstOffer = (req, res) => {
  try {
    const id = req.params.id;
    var sql = `SELECT resturants.id, resturants.name FROM resturants JOIN resturant_card on resturants.id = resturant_card.resturant_id JOIN cards on resturant_card.card_id = cards.id LEFT JOIN domains ON cards.domain_id = domains.id WHERE domains.id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(400).send({ success: false, message: err.sqlMessage });
      res.json({ success: true, data: result });
    })
  } catch (error) {
    res.status(500).send({ success: false, message: error })
  }
}

//Retrive cards against the resturant id
export const cardsAgainstResturant = (req, res) => {
  try {
    const id = req.params.id;
    var sql = `SELECT c.id, c.card_name, c.card_no, c.expiry_date, rc.resturant_id FROM cards AS c LEFT JOIN resturant_card AS rc on c.id=rc.card_id WHERE rc.resturant_id=${id}`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(400).send({ success: false, message: err.sqlMessage });
      res.json({ success: true, data: result });
    })
  } catch (error) {
    res.status(500).send({ success: false, message: error })
  }
}
