import connection from '../config/db.js';
import Joi from 'joi';

export const getAllTemplates = (req,res)=>{
  const {id} = req.params;
let sql = "SELECT * FROM email_template"
connection.query(sql,(er,result)=>{
      if (er) return res.status(201).send({success:false, message:er.message});
      if(result){
          res.status(200).send({success:true, data:result})
      }
})
}

export const getTemplates = (req,res)=>{
    const {id} = req.params;
  let sql = "SELECT * FROM email_template WHERE action = ?"
  connection.query(sql,[id],(er,result)=>{
        if (er) return res.status(201).send({success:false, message:er.message});
        if(result){
            res.status(200).send({success:true, data:result})
        }
  })
}