import connection from "../config/db.js";
import Joi from "joi";
import moment from "moment"
//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = "SELECT * FROM coupons";
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM coupons LIMIT ${startingLimit}, ${resultsPerPage}`;
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


//get all coupons list
export const getCouponsList = (req, res) => {
  try {
    connection.query("SELECT * FROM coupons", function (err, result, fields) {
      if (err) return res.status(200).send({ success: false, message: err });
      res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//get coupons products ids against coupons id
export const getCoupons_Products_Id = (req, res) => {
  try {
    connection.query("SELECT B.coupon_id ,B.cardsIds FROM coupons A RIGHT JOIN coupon_product B ON A.id=B.coupon_id", function (err, result, fields) {
      if (err) return res.status(200).send({ success: false, message: err });
      res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

//Create new Card
export const createNewCoupons = async (req, res) => {
  const { coupon_name, description, discount_type, coupon_amount, allow_free_shipping,
    coupon_expiry_date, coupon_expiry_time, max_discount, for_new_user, auto_gen, permission,
    auto_applay, minimum_spend, maximum_spend, individual_use_only, exclude_sale_item, allowed_emails,
    disable_email_restriction, payment_methods, shipping_methods, usage_limit_per_coupon, limit_usage_items,
    cardsIds, domainIds,
    limit_per_user } = req.body;
  const time = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    await connection.query(`INSERT INTO coupons (coupon_name, description, discount_type, coupon_amount, allow_free_shipping, coupon_expiry_date, coupon_expiry_time, max_discount, for_new_user, auto_gen, permission, auto_applay, minimum_spend, maximum_spend, individual_use_only, exclude_sale_item, allowed_emails,disable_email_restriction, payment_methods, shipping_methods, usage_limit_per_coupon, limit_usage_items, limit_per_user, created_at) values("${coupon_name}", "${description}", "${discount_type}","${coupon_amount}", "${allow_free_shipping}", "${coupon_expiry_date ? coupon_expiry_date : '0000-00-00'}","${coupon_expiry_time ? coupon_expiry_time : '00:00:00'}", "${max_discount}", "${for_new_user}","${auto_gen}", "${permission}", "${auto_applay}", 
            "${minimum_spend}", "${maximum_spend}", "${individual_use_only}","${exclude_sale_item}", "${allowed_emails}", "${disable_email_restriction}","${payment_methods}", "${shipping_methods}", "${usage_limit_per_coupon}", "${limit_usage_items}", "${limit_per_user}", "${time}")`,
      function (err, result) {
        // if any error while executing above query, throw error
        if (err) return res.status(400).send(err);
        // if there is no error, you have the result
        const coupon_id = result.insertId;
        if (coupon_id) {
          console.log(coupon_id)
          if (cardsIds.length > 0 || domainIds.length > 0) {
            const data = domainIds.map((value, index) => [cardsIds[index] ? cardsIds[index] : null, value, coupon_id])
              .concat(cardsIds.slice(domainIds.length).map((value, index) => [value, null, coupon_id]));
            const query = `INSERT INTO coupon_product (cardsIds, domainIds,coupon_id) VALUES ?`;
            connection.query(query, [data], (err, results) => {
              if (err) return res.status(400).send(err);
              if (results) {
                res.status(201).send({ success: true, message: "Successfully Coupon created" });
              }
            })
          } else {
            res.status(201).send({ success: true, message: "Successfully new Coupon created" });
          }

        } else {
          res.status(201).json({ success: false, message: result.details });
        }
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getCouponDetails = (req, res) => {
  try {
    const id = req.params.id;
    connection.query(`SELECT c.*, GROUP_CONCAT(cp.cardsIds) AS cardsIds, GROUP_CONCAT(cp.domainIds) AS domainIds FROM coupons AS c LEFT JOIN coupon_product AS cp ON c.id = cp.coupon_id WHERE c.id=${id} GROUP BY cp.coupon_id LIMIT 1`, function (err, result, fields) {
      if (err) res.status(200).send({ success: false, });
      let responseData = result.length > 0 ? result[0] : null;
      if (responseData) {
        responseData.cardsIds = responseData.cardsIds ? responseData.cardsIds.split(',').map(str => parseInt(str)) : null;
        responseData.domainIds = responseData.domainIds ? responseData.domainIds.split(',').map(str => parseInt(str)) : null;
        res.json({ success: true, data: responseData });
      } else {
        res.json({ success: false, message: "No data found.", data: [] });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

export const updateCoupon = async (req, res) => {
  const { coupon_name, description, discount_type, coupon_amount, allow_free_shipping,
    coupon_expiry_date, coupon_expiry_time, max_discount, for_new_user, auto_gen, permission,
    auto_applay, minimum_spend, maximum_spend, individual_use_only, exclude_sale_item, allowed_emails,
    disable_email_restriction, payment_methods, shipping_methods, usage_limit_per_coupon, limit_usage_items,
    cardsIds, domainIds,
    limit_per_user } = req.body;
  const id = req.params.id;
  if (!id) return res.status(400).send("Incorrect parameters!");
  const time = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    let sql = `UPDATE coupons SET coupon_name=?, description=?, discount_type=?, coupon_amount=?, allow_free_shipping=?, coupon_expiry_date=?, coupon_expiry_time=?, max_discount=?, for_new_user=?, auto_gen=?, permission=?, auto_applay=?, minimum_spend=?, maximum_spend=?, individual_use_only=?, exclude_sale_item=?, allowed_emails=?,disable_email_restriction=?, payment_methods=?, shipping_methods=?, usage_limit_per_coupon=?, limit_usage_items=?, limit_per_user=?, updated_at=? WHERE id=${id}`;
    let valuesToUpdate = [coupon_name, description, discount_type,coupon_amount, allow_free_shipping, coupon_expiry_date ? coupon_expiry_date : '0000-00-00',coupon_expiry_time ? coupon_expiry_time : '00:00:00', max_discount, for_new_user, auto_gen, permission, auto_applay, 
    minimum_spend, maximum_spend, individual_use_only,exclude_sale_item, allowed_emails, disable_email_restriction,payment_methods, shipping_methods, usage_limit_per_coupon, limit_usage_items, limit_per_user, time];

    await connection.query(sql, valuesToUpdate,
      async function (err, result) {
        if (err) return res.status(400).send(err);
        if (result.affectedRows > 0) {
          const coupon_id = id;
          
          // Deleting previous data against this coupon id
          await connection.query(`DELETE FROM coupon_product WHERE coupon_id = ${id}`, (err, result) => {});

          if (cardsIds.length > 0 || domainIds.length > 0) {
            const data = domainIds.map((value, index) => [cardsIds[index] ? cardsIds[index] : null, value, coupon_id]).concat(cardsIds.slice(domainIds.length).map((value, index) => [value, null, coupon_id]));
            const query = `INSERT INTO coupon_product (cardsIds, domainIds,coupon_id) VALUES ?`;
            connection.query(query, [data], (err, results) => {
              if (err) return res.status(400).send(err);
              if (results) {
                res.status(201).send({ success: true, message: "Successfully Coupon updated" });
              }
            })
          } else {
            res.status(201).send({ success: true, message: "Successfully Coupon updated" });
          }
        } else {
          res.status(201).json({ success: false, message: "Update Failed" });
        }
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    var sql = `DELETE FROM coupons WHERE id = ${id}`;
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