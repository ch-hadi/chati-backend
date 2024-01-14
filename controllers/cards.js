import connection from '../config/db.js';
import Joi from 'joi';
import moment from 'moment';
import { uploadFile, rollbackUploads } from '../utils/fileUpload.js';
import { sendEmailToUserOnCustomCardRegistration } from '../utils/sentEmail.js';
//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM cards ORDER BY created_at DESC';
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM cards ORDER BY created_at DESC LIMIT ${startingLimit}, ${resultsPerPage}`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        let iterator = page - 3 < 1 ? 1 : page - 3;
        let endingLink =
          iterator + 4 <= numberOfPages
            ? iterator + 4
            : page + (numberOfPages - page);
        results.forEach((item) => {
          if (item.image && item.image != null) {
            item.image = `${process.env.BASE_URL}/uploads/card_images/${item.image}`;
          }
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
//get all cards list
export const getCardsList = (req, res) => {
  try {
    connection.query(
      'SELECT * FROM cards WHERE is_active=1 ORDER BY created_at DESC',
      function (err, result, fields) {
        if (err) return res.status(200).send({ success: false, message: err });
        result.forEach((item) => {
          if (item.image && item.image != null) {
            item.web_image = `${process.env.BASE_URL}/uploads/card_images/${item.image}`;
            
          }
        });
        res.json({ success: true, data: result });
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//get cards list agains domain id
export const getCardsListByDomainId = (req, res) => {
  const { domain_Ids } = req.body;
  let query = `SELECT * FROM cards WHERE domain_id IN (${domain_Ids.map(
    (item) => item
  )}) AND is_active = 1`;

  try {
    connection.query(query, function (err, result, fields) {
      if (err) return res.status(200).send({ success: false, message: err });

      res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//Create new Card
export const createNewCard = async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({ data: null, message: error.message });
  let {
    card_name,
    price,
    description,
    domain_id,
    validity,
    is_active,
    is_private,
  } = req.body;
  const card_no = getUniqueCardNumber();
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
  let expiry_date = moment().add(validity, 'days').format('YYYY-MM-DD');

  try {
    let image = null;
    if (req.files && req.files.image) {
      image = await uploadFile(req.files.image, 'card_images');
    }

    await connection.query(
      `INSERT INTO cards (card_name, card_no, price, description, expiry_date, domain_id, validity, image, is_active, is_private, created_at) VALUES ("${card_name}", "${card_no}", "${price}", "${description}", "${expiry_date}", "${domain_id}", ${validity}, "${image}", ${is_active}, ${is_private}, "${time}")`,
      function (err, result, fields) {
        // if any error while executing above query, throw error
        if (err) return res.status(400).send(err);
        // if there is no error, you have the result
        if (result.affectedRows > 0)
          return res.status(201).send({
            success: true,
            message: 'Card created successfully!',
          });
        res.status(201).json({
          success: false,
          message: result.details,
        });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};
export const deleteCard = async (req, res) => {
  try {
    const id = req.params.id;
    // var sql = `DELETE FROM cards WHERE id = ${id}`;
    var sql = `UPDATE cards SET is_active = 0 WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });
      if (result.affectedRows > 0) {
        res.status(200).send({
          success: true,
          message: 'Successfully deleted',
        });
      } else {
        res.status(404).send({ success: false, message: 'Record not found!' });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

export const updateCard = async (req, res, next) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({ data: null, message: error.message });
  try {
    const update_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const id = req.params.id;
    const {
      card_name,
      price,
      description,
      domain_id,
      validity,
      is_active,
      is_private,
    } = req.body;

    let image;
    const queryPromise = new Promise((resolve, reject) => {
      let sqlSelect = `SELECT * FROM cards WHERE id=${id} LIMIT 1`;
      connection.query(sqlSelect, async (err, results) => {
        if (err) reject(err);
        if (results.length > 0) {
          image = results[0].image;
          if (req.files && req.files.image) {
            //Delete previous image file from directory
            if (image) {
              await rollbackUploads(image, 'card_images');
            }
            image = await uploadFile(req.files.image, 'card_images');
          }
          resolve(image);
        } else {
          res.json({ success: false, message: 'No records found' });
        }
      });
    });

    image = await queryPromise;

    var sql = `UPDATE cards SET card_name = '${card_name}', price= '${price}', description= '${description}', domain_id= '${domain_id}', validity= '${validity}', image= '${image}', is_active= '${is_active}', is_private= '${is_private}', updated_at= '${update_time}'  WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });

      if (result.affectedRows > 0) {
        res.send({
          success: true,
          message: 'Card updated successfully!',
        });
      } else {
        res.send({
          success: false,
          message: 'Record not Exist',
        });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//Get card with attached domain against the ecard_no
export const getCardByECardNumber = (req, res) => {
  const cardNo = req.params.cardNo;
  try {
    connection.query(
      `SELECT CA.id, CA.card_name, CA.domain_id, CA.validity, CA.image, CA.is_private, DOM.name AS domain_name, EC.registered_count, EC.start_date FROM cards AS CA JOIN domains AS DOM ON DOM.id=CA.domain_id JOIN e_cards AS EC ON EC.card_id = CA.id WHERE EC.ecard_no='${cardNo}' AND CA.is_active=1 LIMIT 1`,
      function (err, result, fields) {
        if (err) return res.status(200).send({ success: false, message: err });
        if (result.length > 0) {
          if (result[0].registered_count >= 2) {
            res.json({
              success: false,
              message: 'Registration limit exceeded!',
            });
          } else {
            if (
              result[0].image &&
              result[0].image != null &&
              result[0].image != 'NULL' &&
              result[0].image != 'null'
            ) {
              result[0].image = `${process.env.BASE_URL}/uploads/card_images/${result[0].image}`;
            } else {
              result[0].image = null;
            }
            res.json({ success: true, data: result[0] });
          }
        } else {
          res.json({ success: false, message: 'Card does not exist' });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//Attachment cards with users
export const assignCard = async (req, res) => {
  const { error } = attachUser(req.body);
  if (error)
    return res.status(400).send({ data: null, message: error.message });
  const { card_id, ecard_no, start_date, validity } = req.body;

  try {
    let selectResult;
    const query = `SELECT COUNT(*) AS count FROM user_cards WHERE user_id = ${req.user.id} AND card_id = ${card_id} AND ecard_no = "${ecard_no}";`;
    const queryPromise = new Promise((resolve, reject) => {
      connection.query(query, (err, result, fields) => {
        if (result) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    });
    selectResult = await queryPromise;
    const count = selectResult ? selectResult[0].count : 0;
    if (count > 0) {
      return res
        .status(200)
        .send({ success: false, message: 'Card already registered to user.' });
    }
  } catch (error) {
    return res.status(500).send(error);
  }

  const date = new Date(start_date);
  date.setDate(date.getDate() + validity);
  const isoDate = date.toISOString();
  let end_date = isoDate.replace('T', ' ').replace('Z', '');
  try {
    connection.query(
      `INSERT INTO user_cards (user_id, card_id, ecard_no, start_date, end_date) values("${req.user.id}", "${card_id}", "${ecard_no}", "${start_date}", "${end_date}")`,
      function (err, result, fields) {
        if (err) return res.status(400).send(err);
        if (result.affectedRows > 0) {
          connection.query(
            `UPDATE e_cards SET registered_count = registered_count + 1 WHERE ecard_no = "${ecard_no}"`
          );
          return res
            .status(201)
            .send({ success: true, message: 'Card Registered Successfully!' });
        } else {
          res.status(201).json({ success: false, message: result.details });
        }
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
};

export const assignCardsToUsers = async (req, res, d) => {
  const { def, selectedOption, id } = d;
  let userCardsData = [];
  let eCardsData = [];
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const date = new Date();
  date.setDate(date.getDate() + 30);
  const isoDate = date.toISOString();
  let end_date = isoDate.replace('T', ' ').replace('Z', '');
  try {
    //  let sqlSelect = `SELECT od.*, c.validity  FROM orderDetails AS od JOIN cards AS c ON od.card_id = c.id WHERE orderId=${}`;
    const uniqueEcardNo = getUniqueECardNumber();
    for (let obj of def) {
      let innerArray = [];
      innerArray.push(id);
      innerArray.push(obj.value);
      innerArray.push(uniqueEcardNo);
      innerArray.push(now);
      innerArray.push(obj.end_date);
      innerArray.push(now);
      userCardsData.push(innerArray);
    }
    // userCardsData.push([5, 2, 1111, date, end_date, now]);

    //  uniqueEcardNo,
    //    element.card_id,
    //    element.start_date,
    //    1,
    //    element.id,

    // eCardsData.push([1111, 123, '2023-07-30', 1, 2]);
    for (let obj of def) {
      let innerArray = [];
      innerArray.push(uniqueEcardNo);
      innerArray.push(obj.value);
      innerArray.push(now);
      innerArray.push(1);
      innerArray.push(0);
      eCardsData.push(innerArray);
    }
    let cardsResult;
    // console.log('ucrd', userCardsData, '-ecrd-', eCardsData);
    // return;
    const cardsPromise = new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO e_cards (ecard_no, card_id, start_date, registered_count, order_detail_id) VALUES ?`,
        [eCardsData],
        (err4, result4) => {
          if (err4) {
            // res.status(400).send({ success: false, data: err4, er: 4 });
            // console.log(err4);
            reject(err4);
            return;
          } else {
            // console.log('rs4->', result4);
            // return res
            //   .status(200)
            //   .send({ success: true, data: result4, rs: 4 });
            resolve(result4);
          }
        }
      );
    });
    cardsResult = await cardsPromise;
    // console.log('crd->rslt', cardsResult);
    if (cardsResult.insertId) {
      connection.query(
        `INSERT INTO user_cards (user_id, card_id, ecard_no, start_date, end_date, created_at) VALUES ?`,
        [userCardsData],
        (err3, result3) => {
          if (result3) {
            // console.log('rs3->', result3);
            return res
              .status(200)
              .send({ success: true,  });
          }
          if (err3) {
            // return res.status(400).send({ success: false, data: err3, er: 3 });
            // console.log('err3->', err3);
          }
        }
      );
    }
  } catch (error) {
    return res.status(400).send({ success: false, data: error, er: 'm' });
    console.log(error);
  }
};

export const createCustomUserCard = async (req, res) => {
  // console.log(req.body)
  // return
  let image = null;
  if (req.files && req.files.image) {
    image = await uploadFile(req.files.image, 'card_images');
  }
  const { error } = validateCustomCard(req.body);
  if (error)
    return res.status(400).send({ data: null, message: error.message });
  // let { card_id, ecard_no, start_date, validity, user_id } = req.body;
  const {user_id,card_id,ecard_no,start_date,validity} = req.body;
  // let validTill= moment(start_date).add(validity, 'days').format('YYYY-MM-DD')
  let validTill = moment(start_date, 'MM-DD-YYYY').add(validity, 'days').format('YYYY-MM-DD');
  // console.log('->',validTill)
  // return
  const date = new Date(start_date);
  const edate= new Date(validTill);
 //  date.setDate(date.getDate() + validity);
  const isoStartDate = date.toISOString();
  const isoEndDate = edate.toISOString();
  let _start_date = isoStartDate.replace('T', ' ').replace('Z', '');
  let _end_date = isoEndDate.replace('T', ' ').replace('Z', '');
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const userCardData = [user_id, card_id, ecard_no, _start_date, _end_date, time, image];
  const eCardsData = [ecard_no, card_id, _start_date, 0, 1];
  // console.log(eCardsData)
  try {
    // connection.query(
    //   `INSERT INTO e_cards (ecard_no, card_id, start_date, registered_count, order_detail_id) VALUES ?`,
    //   [eCardsData],
    //   (err4, result4) => {
    //     if (err4) {
    //       reject(err4);
    //     } else {
    //       resolve(result4);
    //     }
    //   }
    // );
    let cardsResult;
    let sqlSelectUser = `SELECT * FROM users WHERE id = ? LIMIT 1`;
    connection.query(sqlSelectUser,[user_id],async(err,userR)=>{
      if(err){
        // console.log(error)
        return res.status(400).send({
          success:false, message:err.message
        })
      }
     if(userR.length==0 || userR==[] || userR==null){
      return res.status(400).send({success:false,message:'User Not found!'})
     }
     let userEmail = userR[0].email;
     let userName = userR[0].first_name;
     let sqlSelect = 'SELECT * FROM e_cards WHERE ecard_no = ? LIMIT 1';
     connection.query(sqlSelect,[ecard_no],async(err,resu)=>{
      if(resu.length>0){
        return res.status(400).send({success:false , message:'Card already exist with this number!'});
      }
      if(resu == undefined || resu.length==0 || resu==[] ){
        const cardsPromise = new Promise((resolve, reject) => {
          connection.query(
            `INSERT INTO e_cards (ecard_no, card_id, start_date, registered_count, order_detail_id) VALUES (?, ?, ?, 0, 0)`,
            [eCardsData[0], eCardsData[1], eCardsData[2]],
            (err4, result4) => {
              if (err4) {
                reject(err4);
              } else {
                resolve(result4);
              }
            }
          );
        });
        
        cardsResult = await cardsPromise;
        if (cardsResult.insertId) {
          connection.query(
            `INSERT INTO user_cards (user_id, card_id, ecard_no, start_date, end_date, created_at, custom_card_image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            userCardData,
            (err3, result3) => {
             if(err3){
              rollbackUploads(image, 'card_images');
              return res
                  .status(400)
                  .send({ success: false, message: err3.message, });
             }
             if(result3){
              sendEmailToUserOnCustomCardRegistration({subject:'User Custom Card Registration',userName:userName,email:userEmail,card_id:card_id,ecard_no:ecard_no,start_date:_start_date,end_date:_end_date,filter:'register_card' })
              return res
                  .status(200)
                  .send({ success: true, message:'Card created!', });
             }
            }
          );
        }
      }
     })
    })
   
  } catch (error) {
    res.status(500).send(error);
  }
};

function validate(data) {
  const schema = Joi.object({
    card_name: Joi.string().required(),
    price: Joi.string().required(),
    description: Joi.string().allow(null, '').optional(),
    domain_id: Joi.number().required(),
    validity: Joi.number().required(),
    is_active: Joi.number().valid(0, 1).optional(),
    image: Joi.string().allow(null, '').optional(),
    is_private: Joi.number().valid(0, 1).default(0),
  });
  return schema.validate(data);
}
function validateCustomCard(data){
  const schema = Joi.object({
    ecard_no:Joi.string().required(),
    start_date:Joi.string().required(),
    image: Joi.string().optional(),
    user_id:Joi.number().required(),
    card_id:Joi.number().required(),
    validity:Joi.number().required(),
  });
  return schema.validate(data);
}
function attachUser(data) {
  const schema = Joi.object({
    card_id: Joi.number().required(),
    start_date: Joi.date().required(),
    validity: Joi.number().required(),
    ecard_no: Joi.string().required(),
  });
  return schema.validate(data);
}

// function getUniqueCardNumber() {
//   let randomNumber = Math.floor(Math.random() * (9999999999999999 - 1000000000000000 + 1)) + 1000000000000000;
//   return randomNumber.toString();
// }

function getUniqueCardNumber() {
  let randomNumber =
    Math.floor(Math.random() * (9999999 - 100000 + 1)) + 1000000;
  let timestamp = Date.now().toString();
  let randomID = timestamp + randomNumber.toString();
  if (randomID.length > 20) {
    randomID = randomID.substring(0, 20);
  }
  return randomID;
}
function getUniqueECardNumber() {
  let randomNumber =
    Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
  let timestamp = Date.now().toString();
  let randomID = timestamp + randomNumber.toString();
  if (randomID.length > 16) {
    randomID = randomID.substring(randomID.length - 16);
  } else if (randomID.length < 16) {
    randomID = randomID.padStart(16, '0');
  }
  return randomID;
}
