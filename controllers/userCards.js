import connection from "../config/db.js";
// import Joi from "joi";
import moment from "moment"
// import {uploadFile, rollbackUploads} from "../utils/fileUpload.js";
//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = "SELECT * FROM user_cards";
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      const startingLimit = (page - 1) * resultsPerPage;

      sql = `SELECT c.card_name, c.price, c.description, c.domain_id, c.validity, c.image, c.is_active, uc.id, uc.custom_card_image, uc.user_id, uc.card_id, uc.ecard_no, uc.start_date, uc.end_date, uc.admin_comment, uc.created_at FROM user_cards AS uc JOIN cards AS c ON c.id=uc.card_id ORDER BY uc.created_at DESC LIMIT ${startingLimit}, ${resultsPerPage}`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        let iterator = (page - 3) < 1 ? 1 : page - 3;
        let endingLink = (iterator + 4) <= numberOfPages ? (iterator + 4) : page + (numberOfPages - page);
        const currentDate = moment().format("YYYY-MM-DD");
        console.log(currentDate,)
        results.forEach(item => {
          console.log(item.start_date>item.end_date)
          // let validTill= moment(item.start_date).add(item.validity, 'days').format('YYYY-MM-DD')
          if (item.image && item.image != null) {
              item.image = `${process.env.BASE_URL}/uploads/card_images/${item.image}`;
          }
          if (item.custom_card_image) {
            item.custom_card_image = `${process.env.BASE_URL}/uploads/card_images/${item.custom_card_image}`;
        } else{
            item.image = null;
            item.custom_card_image=null
          }
          item.status =   item.start_date>item.end_date? 'Expired':'Active';
        });
        res.json({ success: true, data: results, page, iterator, endingLink, numberOfPages });
      })

    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
export const getUserCards = (req, res) => {
  const userId = req.params.id ? req.params.id : req.user.id;
  try {
    connection.query(`SELECT c.card_name, c.price, c.description, c.expiry_date, c.domain_id, c.validity, c.image, c.is_active, uc.id, uc.custom_card_image, uc.user_id, uc.card_id, uc.ecard_no, uc.start_date, uc.end_date, uc.deactive FROM cards AS c JOIN user_cards AS uc ON c.id=uc.card_id WHERE uc.user_id=${userId} AND c.is_active=1 ORDER BY uc.created_at DESC`, function (err, results, fields) {
      if (err) return res.status(200).send({ success: false, message: err });
      const currentDate = moment().format("YYYY-MM-DD");
      results.forEach(item => {
        // let validTill= moment(item.start_date).add(item.validity, 'days').format('YYYY-MM-DD')
        if (item.image && item.image != null && item.image != "NULL" && item.image != "null") {
            item.image = `${process.env.BASE_URL}/uploads/card_images/${item.image}`;
        } 
        if (item.custom_card_image) {
          item.custom_card_image = `${process.env.BASE_URL}/uploads/card_images/${item.custom_card_image}`;
      } else{
          item.image = null;
          item.custom_card_image=null
        }
        // item.status = moment(currentDate).isAfter(validTill)? 'Expired':'Active';
        item.status =   item.start_date>item.end_date? 'Expired':'Active';
      });
      res.json({ success: true, data: results });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
export const updateUserCard= async(req,res)=>{
   const {user_id,card_id,ecard_no,comment,start_date,end_date,previous_card_id,image,id} = req.body;
   const date = new Date(start_date);
   const edate= new Date(end_date);
  //  date.setDate(date.getDate() + validity);
   const isoStartDate = date.toISOString();
   const isoEndDate = edate.toISOString();
   let _start_date = isoStartDate.replace('T', ' ').replace('Z', '');
   let _end_date = isoEndDate.replace('T', ' ').replace('Z', '');
   try {
      //  `INSERT INTO e_cards (ecard_no, card_id, start_date, registered_count, order_detail_id) VALUES ?`,
      // var sql = `UPDATE user_cards
      // SET card_id = '${card_id}', ecard_no = '${ecard_no}', start_date = '${_start_date}', end_date = '${_end_date}', admin_comment = '${comment}'
      // WHERE user_id = ${user_id} AND id = ${id}`;
      var sql = `
      UPDATE user_cards
      SET card_id = ?, ecard_no = ?, start_date = ?, end_date = ?, admin_comment = ?, deactive = ?
      WHERE user_id = ? AND id = ?
  `;
  connection.query(sql, [card_id, ecard_no, _start_date, _end_date, comment, _end_date>_start_date? 0:1, user_id, id], function (err, result, fields) {
        if (err){
          // console.log('75=>',err)
          return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });
        }
  
        if (result.affectedRows > 0) {
          // console.log('here',previous_card_id,ecard_no)
          // `INSERT INTO e_cards (ecard_no, card_id, start_date, registered_count, order_detail_id) VALUES ?`,
          var sql = `UPDATE e_cards
          SET ecard_no = '${ecard_no}', card_id = '${card_id}', start_date = '${_start_date}'
          WHERE card_id = ${previous_card_id}`;
          connection.query(sql, (err, result) => {
            if (err){
              return res
              .status(400)
              .send({ success: false, message: err.sqlMessage });
            }
                if(result){
                  return res
                  .status(200)
                  .send({ success: true, message: 'Status Updated!' });
                }
      })
        
        }})
      
   } catch (error) {
    // console.log(error)
     res.status(500).send(error);
   }
}
export const deActiveUserCard = async (req, res) => {
  const cardId = req.params.id;
  const currentDate = new Date('12-23-2020');
  const threeDaysAgo = new Date(currentDate);
  const isoEndDate = threeDaysAgo.toISOString();
  let _end_date = isoEndDate.replace('T', ' ').replace('Z', '');
  try {
    var sql = `
      UPDATE user_cards SET end_date = ?, deactive = ? WHERE id = ?
    `;
    connection.query(sql, [_end_date, 1,cardId], function (err, result, fields) {
      if (err) {
        return res.status(400).send({ success: false, message: err.sqlMessage });
      }

      if (result.affectedRows > 0) {
        // console.log('Card deactivated successfully');
        res.status(200).send({ success: true, message: 'Card deactivated successfully' });
      } else {
        // console.log('Card not found');
        res.status(404).send({ success: false, message: 'Card not found' });
      }
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
};


