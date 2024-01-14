import connection from '../config/db.js';
import Joi from 'joi';
import { sendEmailToUserForDownloadMobileApp } from '../utils/sentEmail.js';

// export const shareWallet = async (req, res) => {
//   const { from_user_id, to_user_id, shared_status, email } = req.body;

//   const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
//   const { error } = validate(req.body);
//   if (error) {
//     return res.status(400).send({ success: false, message: error.message });
//   }
//   try {
//     connection.query(
//       `SELECT email FROM users WHERE email = "${email}"`,
//       (err, result) => {
//         console.log(err, result);
//         if (err) return res.status(404).send({ success: false, message: err });
//         if (result.length <= 0) {
//           res.status(200).send({
//             success: false,
//             message: 'User not found with this email!',
//           });
//         }
//         if (result[0]) {
//           return res.status(200).send({
//             success: false,
//             message: 'You already shared your wallet!',
//           });
//         }
//       }
//     );
//   const sql =
//     'INSERT INTO shared_wallet (from_user_id, to_user_id, shared_at, shared_status) VALUES (?, ?, ?, ?)';
//   await connection.query(
//     sql,
//     [from_user_id, to_user_id, created_at, shared_status],
//     (err, result) => {
//       if (err) {
//         res.status(400).send({ success: false, message: err.sqlMessage });
//       } else {
//         res
//           .status(201)
//           .send({ success: true, message: 'Wallet Successfully Shared.' });
//       }
//     }
//   );
// } catch (error) {
//   res.status(500).send(error);
// }
// };

export const shareWallet = async (req, res) => {
  const { sender_email, receiver_email } = req.body;
  const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // Validate the request body here (validate function should be defined)
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({ success: false, message: error.message });
  try {
    // Check if the user exists in the users table
    connection.query(
      `SELECT id FROM users WHERE email = "${receiver_email}"`,
      async (err, resultFound) => {
        if (err) {
          res.status(400).send({ success: false, message: err.sqlMessage });
        }
        if (resultFound.length === 0) {
          sendEmailToUserForDownloadMobileApp({ email: receiver_email });
          return res.status(200).send({
            success: true,
            message: 'Invitation email sent. User not found with this email!',
            invitation: true,
          });
        }
        // Check if the user has already shared the wallet
        // Share the wallet if the user exists and has not shared it before

        connection.query(
          `SELECT id FROM users WHERE email = "${sender_email}"`,
          async (err, resultFoundUser) => {
            // console.log(resultFoundUser);
            if (err) {
              res.status(400).send({ success: false, message: err.sqlMessage });
              return;
            }
            const sharedWalletQuery = `SELECT * FROM shared_wallet WHERE sender_email = '${sender_email}'`;
            await connection.query(sharedWalletQuery, async (err, re) => {
              if (err) {
                return res.status(200).send({
                  success: false,
                  message: err.message,
                });
                return;
              }
              if (re.length > 0) {
                return res.status(200).send({
                  success: false,
                  message:
                    'You have already shared your wallet with this user!',
                  invitation: false,
                });
              }
              if (re.length === 0) {
                const sql =
                  'INSERT INTO shared_wallet (sender_email, shared_at, receiver_email) VALUES (?, ?, ?)';
                await connection.query(
                  sql,
                  [sender_email, created_at, receiver_email],
                  (err, result) => {
                    if (err) {
                      res
                        .status(400)
                        .send({ success: false, message: err.sqlMessage });
                    } else {
                      const sharedWalletQuery = `SELECT * FROM shared_wallet_receiver WHERE receiver_email = '${receiver_email}' LIMIT 1`;
                      connection.query(sharedWalletQuery, async (err, re) => {
                        if (err) {
                          res.status(400).send({
                            success: false,
                            message: err.sqlMessage,
                          });
                          return;
                        }
                        if (re.length > 0) {
                          // console.log(resultFoundUser);
                          // console.log(re);
                          const shared_users_id = JSON.parse(
                            re[0].shared_users_id
                          );
                          // console.log('->>', shared_users_id);
                          shared_users_id.push(resultFoundUser[0].id);
                          // console.log('sh', shared_users_id);
                          const to_users = JSON.stringify(shared_users_id);
                          // console.log('tousers->', to_users);
                          const updateQuery = `UPDATE shared_wallet_receiver SET shared_users_id = ? WHERE receiver_email = ?`;
                          connection.query(
                            updateQuery,
                            [to_users, receiver_email],
                            (err, result) => {
                              if (err) {
                                res.status(400).send({
                                  success: false,
                                  message: err.sqlMessage,
                                });
                              } else {
                                res.status(200).send({
                                  success: true,
                                  message: 'Successfully shared',
                                  invitation: false,
                                });
                              }
                            }
                          );
                        } else if (re.length == 0) {
                          let to_user_ids = [];
                          to_user_ids.push(resultFoundUser[0].id);
                          let to_users = JSON.stringify(to_user_ids);
                          const sql = `INSERT INTO shared_wallet_receiver (receiver_email, shared_users_id) VALUES (?, ?)`;
                          connection.query(
                            sql,
                            [receiver_email, to_users],
                            (err) => {
                              if (err) {
                                res.status(400).send({
                                  success: false,
                                  message: err.sqlMessage,
                                });
                              } else {
                                res.status(200).send({
                                  success: true,
                                  message: 'Wallet Successfully Shared.',
                                });
                              }
                            }
                          );
                        }
                      });
                    }
                  }
                );
              }
            });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
};

export const getSharedWalletReceiver = async (req, res) => {
  try {
    const sql = 'SELECT * FROM shared_wallet_receiver';
    await connection.query(sql, (err, result) => {
      if (err) {
        res.status(400).send({ success: false, message: err.sqlMessage });
      } else {
        res.status(200).send({ success: true, data: result });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getSharedWallet = async (req, res) => {
  try {
    const sql = 'SELECT * FROM shared_wallet ORDER BY shared_at DESC';
    await connection.query(sql, (err, result) => {
      if (err) {
        res.status(400).send({ success: false, message: err.sqlMessage });
      } else {
        res.status(200).send({ success: true, data: result });
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateUserSharedWalletStatus = (req, res) => {
  const { shared_status } = req.body;
  const id = req.params.id;
  try {
    const update_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = `UPDATE users SET redeem_shared_status=?, shared_status_updated_at=? WHERE id=${id}`;
    const valuesToUpdate = [shared_status, update_time];

    connection.query(sql, valuesToUpdate, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          success: false,
          message: err.message,
        });
      }
      if (result.affectedRows > 0) {
        return res
          .status(200)
          .send({ success: true, message: 'Successfully updated' });
      } else {
        return res
          .status(200)
          .send({ success: false, message: 'Id not Exist' });
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: 'Internal server error' });
  }
};

function validate(data) {
  const schema = Joi.object({
    receiver_email: Joi.string().required(),
    sender_email: Joi.string().required(),
  });
  return schema.validate(data);
}
