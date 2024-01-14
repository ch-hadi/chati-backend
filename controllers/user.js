import connection from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { assignCardsToUsers } from './cards.js';
import { resetPasswordEmail } from '../utils/sentEmail.js';
//Pagination list
export const getPaginationList = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM users';
    connection.query(sql, function (err, result, fields) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT id, full_name, email,updated_at, created_at, FROM users LIMIT ${startingLimit}, ${resultsPerPage}`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        let iterator = page - 3 < 1 ? 1 : page - 3;
        let endingLink =
          iterator + 4 <= numberOfPages
            ? iterator + 4
            : page + (numberOfPages - page);
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
//Get Users List
export const getUsersList = (req, res) => {
  console.log('here')
  try {
    connection.query(
      'SELECT id, full_name, email, created_at, updated_at FROM users',
      function (err, result, fields) {
        if (err) throw err;
        res.json({ success: true, data: result });
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//Get User By Id
export const getUser = (req, res) => {
  try {
    const id = req.params.id;
    connection.query(
      `SELECT id, first_name, last_name, email, phone, active, role, updated_at, created_at, operation_in FROM users WHERE id=${id}`,
      function (err, result, fields) {
        if (err) res.status(200).send({ success: false });
        res.json({ success: true, data: result });
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//Delete User
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Deleting user data from orders
    await connection.query(
      `DELETE FROM orders WHERE userId = ${id}`,
      (err, result) => {}
    );

    // Deleting user data from purchases
    await connection.query(
      `DELETE FROM purchases WHERE user = ${id}`,
      (err, result) => {}
    );

    // Deleting user data from user_cards
    await connection.query(
      `DELETE FROM user_cards WHERE user_id = ${id}`,
      (err, result) => {}
    );

    var sql = `DELETE FROM users WHERE id = ${id}`;
    // var sql = `UPDATE users SET active = 0 WHERE id = ${id}`;
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
//Register user
export const register = (req, res) => {
  const {
    full_name,
    email,
    password,
   
  } = req.body;
  try {
    // console.log(req.body);
    if (!full_name || !email || !password)
      return res.status(400).send({
        success: false,
        message: 'Incomplete user details',
      });

    connection.query(
      'SELECT email FROM users WHERE email = ?',
      [email],
      (err, result) => {
        if (err) return res.status(404).send({ success: false, message: err });
        if (result[0])
          return res
            .status(200)
            .send({ success: false, message: 'Email already exist!' });
        else {
          const salt = bcrypt.genSaltSync(10);
          const hashPassword = bcrypt.hashSync(password, salt);
          const created_at = new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
          const token = jwt.sign(
            { email: email, password: password },
            process.env.JWT_KEY
          );
          var sql = `INSERT INTO users (full_name, email, password, created_at) VALUES( ?, ?, ?, ?)`;
          connection.query(
            sql,
            [
              full_name,
              email,
              hashPassword,
              created_at,
            ],
            (err) => {
              if (err) return res.status(401).send({ message: err.sqlMessage });
              res.status(201).send({
                success: true,
                message: 'Successfully registered',
              });
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//Update User Record
export const updateUser = (req, res) => {
  // console.log(req.body);
  // return;
  const {
    first_name,
    last_name,
    email,
    phone,
    active,
    role,
    operation_in,
    address,
    country,
    city,
    postcode,
    def,
    selectedOption,
  } = req.body;
  const password = req.body.password ? req.body.password : null;
  const id = req.params.id;
  try {
    const update_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sql = `UPDATE users SET first_name=?, last_name=?, email=?, phone=?, active=?, role=?, operation_in=?, address=?, country=?, city=?, postcode=?, updated_at=? WHERE id=${id}`;
    let valuesToUpdate = [
      first_name,
      last_name,
      email,
      phone,
      active,
      role,
      operation_in,
      address,
      country,
      city,
      postcode,
      update_time,
    ];
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      sql = `UPDATE users SET first_name=?, last_name=?, email=?, password=?, phone=?, active=?, role=?, operation_in=?, address=?, country=?, city=?, postcode=?, updated_at=? WHERE id=${id}`;
      valuesToUpdate = [
        first_name,
        last_name,
        email,
        hashPassword,
        phone,
        active,
        role,
        operation_in,
        address,
        country,
        city,
        postcode,
        update_time,
      ];
    }

    connection.query(sql, valuesToUpdate, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });
      if (result.affectedRows > 0) {
        // console.log(def, selectedOption);
        if (def !== undefined && selectedOption.length > 0) {
          // console.log('here');
          assignCardsToUsers(req, res, { def, selectedOption, id });
          return res.status(200).send({
            success: true,
            message: `${
              def.length > 1
                ? 'Cards Successfully Assigned'
                : 'Card Successfully Assigned'
            }`,
          });
        }
        return res
          .status(200)
          .send({ success: true, message: 'Successfully updated' });
      }
      res.status(200).send({ success: false, data: 'Id not Exist' });
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({ success: false, message: error });
  }
};
//Check user from checkout details, then either register or update
export const checkUserFromCheckout = (req, res) => {
  const {
    first_name,
    last_name,
    email,
    address,
    apartment,
    city,
    postcode,
    phone,
    country,
  } = req.body;
  try {
    if (!first_name || !last_name || !email || !phone)
      return res
        .status(400)
        .send({ success: false, message: 'Incomplete user details' });

    connection.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email],
      (err, result) => {
        if (err) return res.status(404).send({ success: false, message: err });

        if (result.length > 0) {
          const id = result[0].id;
          return res.status(200).send({
            success: true,
            message: 'User found.',
            data: { userId: id },
          });
        } else {
          const salt = bcrypt.genSaltSync(10);
          const password = getRandomString(10);
          const hashPassword = bcrypt.hashSync(password, salt);
          const created_at = new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');

          var sqlInsert = `INSERT INTO users (first_name, last_name, email, password, address, city, postcode, phone, country, active, role, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          const valuesToInsert = [
            first_name,
            last_name,
            email,
            hashPassword,
            address + ' ' + apartment,
            city,
            postcode,
            phone,
            country,
            1,
            0,
            created_at,
          ];
          connection.query(
            sqlInsert,
            valuesToInsert,
            (errinsert, resultInsert) => {
              if (errinsert)
                return res.status(401).send({ message: errinsert.sqlMessage });

              const userId = resultInsert.insertId;
              return res.status(201).send({
                success: true,
                message: 'User account registered',
                data: { userId: userId },
              });
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//Update User Information during the order checkout from web app
export const updateUserFromCheckout = (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    address,
    apartment,
    country,
    city,
    postcode,
  } = req.body;
  const id = req.params.id;
  try {
    const update_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sql = `UPDATE users SET first_name=?, last_name=?, email=?, phone=?, address=?, country=?, city=?, postcode=?, updated_at=? WHERE id=${id}`;
    connection.query(
      sql,
      [
        first_name,
        last_name,
        email,
        phone,
        `${address} ${apartment}`,
        country,
        city,
        postcode,
        update_time,
      ],
      (err, result) => {
        if (err)
          return res
            .status(400)
            .send({ success: false, message: err.sqlMessage });
        if (result.affectedRows > 0)
          return res
            .status(200)
            .send({ success: true, message: 'Successfully updated' });
        res.status(200).send({ success: false, data: 'Id not Exist' });
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//Login call
export const adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    connection.query(
      `SELECT * FROM users WHERE email = '${email}' AND active = 1 AND role = 1`,
      (err, result) => {
        if (err) return res.status(404).send({ success: false, message: err });
        if (!result[0] || !bcrypt.compareSync(password, result[0].password)) {
          res
            .status(403)
            .send({ success: false, message: 'You are not authenticated!' });
        } else {
          const token = jwt.sign(
            { id: result[0].id, email: result[0].email },
            process.env.JWT_KEY
          );
          res
            .status(200)
            .send({ success: true, token, email, id: result[0].id });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
export const userLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;
    const ipParts = ipAddress.split(':');
    const cleanedIpAddress = ipParts[ipParts.length - 1];
    connection.query(
      `SELECT id, first_name, last_name, email, password, created_at, updated_at, phone, active, role, operation_in, address, country, city, postcode FROM users WHERE email = '${email}' AND active = 1`,
      (err, result) => {
        if (err) return res.status(404).send({ success: false, message: err });
        if (!result[0] || !bcrypt.compareSync(password, result[0].password)) {
          connection.query(
            `INSERT INTO login_history (email, login_time, ip, login_status) VALUES ('${email}', NOW(), '${cleanedIpAddress}', false);`,
            (err, result) => {
              if (err) console.log(err);
            }
          );
          return res
            .status(403)
            .send({ success: false, message: 'You are not authenticated!' });
        } else {
          const token = jwt.sign(
            { id: result[0].id, email: result[0].email },
            process.env.JWT_KEY
          );

          delete result[0]['password'];
          connection.query(
            `INSERT INTO login_history (email, login_time, ip, login_status) VALUES ('${email}', NOW(), '${cleanedIpAddress}', true);`,
            (err, result) => {
              if (err)
                return res.status(500).send({ success: false, message: err });
            }
          );

          return res.status(200).send({
            success: true,
            token,
            email,
            id: result[0].id,
            userData: result[0],
          });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
export const changePassword = (req, res) => {
  try {
    if (!req.user.id) {
      return res
        .status(400)
        .send({ success: false, message: 'Unauthorized Access!' });
    }

    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({ success: false, message: 'Passwords do not match!' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    connection.query(
      `UPDATE users SET password='${hashPassword}', updated_at='${updated_at}' WHERE id='${req.user.id}'`,
      (err, result) => {
        if (err) return res.status(200).send({ success: false, message: err });
        if (result.affectedRows > 0) {
          return res
            .status(200)
            .send({ success: true, message: 'Password updated successfully!' });
        } else {
          return res
            .status(400)
            .send({ success: false, message: 'Password update failed!' });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
//forget password user
export const forgetPassword = (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    connection.query(
      `UPDATE users SET password='${hashPassword}', updated_at='${updated_at}' WHERE email='${email}'`,
      (err, result) => {
        if (err) return res.status(200).send({ success: false, message: err });
        if (result.affectedRows > 0) {
          res
            .status(200)
            .send({ success: true, message: 'Successfully update' });
        } else {
          res.status(400).send({ success: false, message: 'User not valid!' });
        }
      }
    );
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

// forget password and send email to the user
export const forgetPasswordAndEmailToUser = (req,res)=>{
  try {
    const { email } = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, re) => {
      if (err) {
        return res.status(400).send({success:false, message:'Internal Server Error!'})
      }
     if(re.length == 0){
      return res.status(200).send({success:false, message:'User nor found with this email!'})
     }
     if(re.length>0){
      const resetToken = crypto.randomUUID(20).toString('hex');
      const query = `INSERT INTO reset_tokens (email, token, expires_at)  VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`;
      const expirationTime = new Date(Date.now() + 60 * 60 * 1000);
      connection.query(query, [email, resetToken, expirationTime, resetToken, expirationTime],
        (err, result) => { 
          if (err) return res.status(500).json({ success:false,message: 'Error generating reset token' });;
          if (result.affectedRows > 0) {
            const resetLink = `http://18.223.96.68:3000/reset-password/${resetToken}`;
            // http://localhost:3000/reset-password/77d66ae6-f14a-4e75-a88d-30ef6622c4ea
            resetPasswordEmail({resetLink:resetLink , email:email, expire:expirationTime,filter:'forgot_password'})
            res
              .status(200)
              .send({ success: true, message: 'Email sent to the user with reset link.' });
          } else {
            res.status(400).send({ success: false, message: 'User not valid!' });
          }
        }
      );
     }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
}

export const resetPassword = (req, res) => {
  try {
    const { email, token, password } = req.body;

    // Check if the token is valid and not expired
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, re) => {
      if (err) {
        return res.status(400).send({success:false, message:'Internal Server Error!'})
      }
     if(re.length == 0){
      return res.status(200).send({success:false, message:'User nor found with this email!'})
     }
     if(re.length>0){
      const checkTokenQuery = 'SELECT * FROM reset_tokens WHERE email = ? AND token = ?';
      connection.query(checkTokenQuery, [email, token], (err, results) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error checking token validity' });
        }
  
        if (results.length === 0) {
          return res.status(400).json({ success: false, message: 'Invalid token or expired' });
        }
        const expirationTime = new Date(results[0].expires_at).getTime();
        if (expirationTime < Date.now()) {
          return res.status(400).json({ success: false, message: 'Token has expired' });
        }
        // Token is valid, proceed with password reset
        // ... (code for updating the password)
  
        // Optional: Delete the reset token after it's used
        const deleteTokenQuery = 'DELETE FROM reset_tokens WHERE email = ? AND token = ?';
        connection.query(deleteTokenQuery, [email, token], (deleteErr) => {
          if (deleteErr) {
            console.error('Error deleting reset token:', deleteErr.message);
            // Handle the error if needed
          }
        });
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        const updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        connection.query(
          `UPDATE users SET password='${hashPassword}', updated_at='${updated_at}' WHERE email='${email}'`,
          (err, result) => {
            if (err) return res.status(200).send({ success: false, message: err });
            if (result.affectedRows > 0) {
              return res
                .status(200)
                .send({ success: true, message: 'Password updated successfully!' });
            } else {
              return res
                .status(400)
                .send({ success: false, message: 'Password update failed!' });
            }
          }
        );
      });
     }})
   
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Search user rescords
export const searchUserRecord = (req, res) => {
  try {
    const { first_name, active, role, operation_in } = req.body;
    var sql = `SELECT * FROM users WHERE`;
    if (first_name != '') sql += ` first_name LIKE '${first_name}%'`;
    if (active) sql += ` active=${active}`;
    if (role) sql += ` role=${role}`;
    if (operation_in) sql += ` operation_in=${operation_in}`;
    connection.query(sql, (err, result) => {
      if (err) return res.status(200).send({ success: false, message: err });
      if (result.length > 0) {
        res.status(200).send({ success: true, result });
      } else {
        res.status(200).send({ success: false, message: 'User not exist' });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
export const getLoginHistory = (req, res) => {
  const resultsPerPage = req.query.size ? parseInt(req.query.size) : 4;
  try {
    let sql = 'SELECT * FROM login_history';
    connection.query(sql, function (err, result) {
      if (err) throw err;
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT email, login_time, ip, login_status FROM login_history ORDER BY login_time DESC LIMIT ${startingLimit}, ${resultsPerPage}`;
      connection.query(sql, (err, results) => {
        if (err) throw err;
        let iterator = page - 3 < 1 ? 1 : page - 3;
        let endingLink =
          iterator + 4 <= numberOfPages
            ? iterator + 4
            : page + (numberOfPages - page);
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
function getRandomString(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$&@';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}


