import connection from '../../config/db.js';
import { sendEmailToUser } from '../../utils/sentEmail.js';

export const saveOrder = async (req, res) => {
  let {
    productDetails,
    userId,
    totalAmount,
    sub_total,
    discount_amount,
    shipping_cost,
    shipping_type,
    first_name,
    last_name,
    email,
    address,
    apartment,
    city,
    postcode,
    phone,
    country,
    shipping_first_name,
    shipping_last_name,
    shipping_email,
    shipping_address,
    shipping_apartment,
    shipping_city,
    shipping_postcode,
    shipping_phone,
    shipping_country,
    payment_status,
    notes,
    ship_to_different,
  } = req.body;

  const coupons = req.body.coupons ? req.body.coupons : [];
  const shipToDifferent = ship_to_different ? true : false;

  if (!shipToDifferent) {
    shipping_first_name = first_name;
    shipping_last_name = last_name;
    shipping_email = email;
    shipping_address = address;
    shipping_apartment = apartment;
    shipping_city = city;
    shipping_postcode = postcode;
    shipping_phone = phone;
    shipping_country = country;
  }
  try {
    let insertResult;
    let uniqueID;
    const queryPromise = new Promise((resolve, reject) => {
      const sql = `INSERT INTO orders (userId, totalAmount, sub_total, discount_amount, shipping_cost, shipping_type, billing_first_name,  billing_last_name, billing_email, billing_address, billing_apartment, billing_city, billing_postcode, billing_phone, billing_country, shipping_first_name,  shipping_last_name, shipping_email, shipping_address, shipping_apartment, shipping_city, shipping_postcode, shipping_phone, shipping_country, payment_status, notes) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const valuesToInsert = [
        userId,
        totalAmount,
        sub_total,
        discount_amount,
        shipping_cost,
        shipping_type,
        first_name,
        last_name,
        email,
        address,
        apartment,
        city,
        postcode,
        phone,
        country,
        shipping_first_name,
        shipping_last_name,
        shipping_email,
        shipping_address,
        shipping_apartment,
        shipping_city,
        shipping_postcode,
        shipping_phone,
        shipping_country,
        payment_status,
        notes,
      ];
      connection.query(sql, valuesToInsert, (err, result) => {
        if (err) res.status(404).send({ success: false, message: err });
        uniqueID = result.insertId;
        const orderId = result.insertId;
        connection.query(
          `INSERT INTO orderDetails(card_id, price, subtotal, start_date, quantity, orderId) VALUES ?`,
          [
            productDetails.map((item) => [
              item.cardId,
              item.price,
              item.subtotal,
              item.registerDate,
              item.quantity,
              orderId,
            ]),
          ],
          (errTwo, resultTwo) => {
            if (errTwo) {
              res
                .status(404)
                .send({ success: false, message: errTwo, data: null });
            } else {
             
              resolve(result);
            }
          }
        );
      });
    });

    insertResult = await queryPromise;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let userCardsData = [];
    let eCardsData = [];
    if (insertResult.insertId) {
      let selectResult;
      const selectPromise = new Promise((resolve, reject) => {
        let sqlSelect = `SELECT od.*, c.validity, c.image  FROM orderDetails AS od JOIN cards AS c ON od.card_id = c.id WHERE orderId=${insertResult.insertId}`;
        connection.query(sqlSelect, async (errSelect, resultsSelect) => {
          if (errSelect) reject(errSelect);
          // console.log(resultsSelect)
          if (resultsSelect.length > 0) {
            // const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
            resultsSelect.forEach((element) => {
              // console.log(element.image)
              const date = new Date(element.start_date);
              date.setDate(date.getDate() + element.validity);
              const isoDate = date.toISOString();
              let end_date = isoDate.replace('T', ' ').replace('Z', '');
              for (let index = 0; index < element.quantity; index++) {
                const uniqueEcardNo = getUniqueECardNumber();
                userCardsData.push([
                  userId,
                  element.card_id,
                  uniqueEcardNo,
                  element.start_date,
                  end_date,
                  now,
                  element.image
                ]);
                eCardsData.push([
                  uniqueEcardNo,
                  element.card_id,
                  element.start_date,
                  1,
                  element.id,
                ]);
              }
            });
            resolve({ eCardsData: eCardsData, userCardsData: userCardsData });
          } else {
            reject('Order Failed!');
          }
        });
      });

      selectResult = await selectPromise;

      if (
        selectResult.eCardsData.length > 0 &&
        selectResult.userCardsData.length > 0
      ) {
        let cardsResult;
        const cardsPromise = new Promise((resolve, reject) => {
          connection.query(
            `INSERT INTO e_cards (ecard_no, card_id, start_date, registered_count, order_detail_id) VALUES ?`,
            [eCardsData],
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
            `INSERT INTO user_cards (user_id, card_id, ecard_no, start_date, end_date, created_at, custom_card_image) VALUES ?`,
            [userCardsData],
            (err3, result3) => {
              // update order id in coupon_usage table
              connection.query(
                `UPDATE coupon_usages SET order_id = ${
                  insertResult.insertId
                } WHERE id IN (${coupons.map((item) => item.usage_id)})`
              );

              if (err3) {
                connection.query(
                  `UPDATE e_cards SET registered_count = 0 WHERE ecard_no IN (${eCardsData.map(
                    (item) => item[0]
                  )})`
                );
                insertIntoPurchases({
                  userId,
                  email,
                  uniqueID,
                  first_name,
                  last_name,
                  shipping_address,
                  shipping_apartment,
                  shipping_city,
                  shipping_country,
                  shipping_postcode,
                  shipping_type,
                  // res,
                });
                if (shipping_cost > 0) {
                  insertIntoDeliveries({
                    userId,
                    uniqueID,
                    first_name,
                    email,
                    last_name,
                    shipping_address,
                    shipping_apartment,
                    shipping_city,
                    shipping_country,
                    shipping_postcode,
                    shipping_type,
                    res,
                  });
                }
                sendEmailToUser({
                  filter:'card_order', 
                  user_name:first_name,
                  email: email,
                  date:now,
                  subject: `Your eCard(s)`,
                  productDetails:productDetails,
                  discount_amount:discount_amount,
                  sub_total:sub_total,
                  shipping_type:shipping_type,
                  totalAmount: totalAmount,
                  address: address+' '+apartment+' '+city+' '+postcode+' '+country,
                  orderId:uniqueID,
                  shipping_cost:shipping_cost,
                  shipping_address:shipping_address+' '+shipping_apartment+' '+shipping_city+' '+shipping_postcode
              })
                res.status(201).send({
                  success: true,
                  message:
                    'Cards ordered successfully. Please register your cards.',
                  data: null,
                });
              } else {
                insertIntoPurchases({
                  userId,
                  email,
                  uniqueID,
                  first_name,
                  last_name,
                  shipping_address,
                  shipping_apartment,
                  shipping_city,
                  shipping_country,
                  shipping_postcode,
                  shipping_type,
                });
                // console.log('cost', shipping_cost);
                if (shipping_cost > 0) {
                  insertIntoDeliveries({
                    uniqueID,
                    email,
                    first_name,
                    last_name,
                    shipping_address,
                    shipping_apartment,
                    shipping_city,
                    shipping_country,
                    shipping_postcode,
                    shipping_type,
                  });
                }
                sendEmailToUser({ 
                  filter:'card_order',
                  user_name:first_name,
                  email: email,
                  subject: `Your eCard(s)`,
                  productDetails:productDetails,
                  discount_amount:discount_amount,
                  sub_total:sub_total,
                  shipping_type:shipping_type,
                  totalAmount: totalAmount,
                  address: address+' '+apartment+' '+city+' '+postcode+' '+country,
                  orderId:uniqueID,
                  shipping_cost:shipping_cost,
                  date:now
              })
                res.status(200).send({
                  success: true,
                  message: 'Cards ordered and registered successfully!',
                });
              }
            }
          );
        } else {
          res.status(201).send({ success: false, message: 'Order Failed!' });
        }
      } else {
        res.status(201).send({ success: false, message: 'Order Failed!' });
      }
    }
  } catch (error) {
    res.status(502).send({ success: false, message: error });
  }
};

const insertIntoDeliveries = (data) => {
  // console.log('dl', data);
  //  if (shipping_cost > 0) {
  // Insert delivery data into the 'deliveries' table
  const deliveryData = {
    purchase_no: data.uniqueID, // Assuming 'insertResult.insertId' is the purchase number
    user: data.email, // Assuming 'email' is the user's email
    address: `${data.shipping_address},${data.shipping_apartment}, ${data.shipping_city}, ${data.shipping_country}, ${data.shipping_postcode}`,
    shipping_method: data.shipping_type,
    created: new Date().toISOString().slice(0, 19).replace('T', ' '),
    // user_id: data.userId,
  };
  // console.log('->', deliveryData);
  // connection.query(
  //   'INSERT INTO deliveries SET ?',
  //   deliveryData,
  //   (errDelivery, resultDelivery) => {
  //     if (errDelivery) {
  //       return errDelivery;
  //       // Handle the error
  //       // data.res.status(500).send({
  //       //   success: false,
  //       //   message: 'Failed to insert delivery data.',
  //       //   error: errDelivery,
  //       // });
  //     } else {
  //       return true;
  //     }
  //   }
  // );

  const sql = `
    INSERT INTO deliveries
      (purchase_no, user, address, shipping_method, created)
    VALUES
      (?, ?, ?, ?, ?)
  `;
  const values = [
    deliveryData.purchase_no,
    deliveryData.user,
    deliveryData.address,
    deliveryData.shipping_method,
    deliveryData.created,
  ];
  // console.log(values);
  connection.query(sql, values, (errDelivery) => {
    if (errDelivery) {
      // console.log(errDelivery);
      // Handle the error here
    } else {
      // Handle success here
    }
  });
};

const insertIntoPurchases = (data) => {
  const purchaseData = {
    user: data.first_name + ' ' + data.last_name,
    purchase_no: data.uniqueID,
    bought_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    delivery_type: data.shipping_type,
    address: `${data.shipping_address},${data.shipping_apartment}, ${data.shipping_city}, ${data.shipping_country}, ${data.shipping_postcode}`,
    note: '',
    card_type: 'test', // Assuming card_type is an array
    e_card: JSON.stringify(['1', '2']), // Assuming e_card is an array
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    email: data.email,
    status: 'paid',
    user_id: data.userId,
  };
  const sql = `
    INSERT INTO new_purchases 
      (user, purchase_no, bought_at, delivery_type, address, card_type, e_card, created_at, email, status, user_id) 
    VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    purchaseData.user,
    purchaseData.purchase_no,
    purchaseData.bought_at,
    purchaseData.delivery_type,
    purchaseData.address,
    // purchaseData.note,
    purchaseData.card_type,
    purchaseData.e_card,
    purchaseData.created_at,
    purchaseData.email,
    purchaseData.status,
    purchaseData.user_id,
  ];

  connection.query(sql, values, (errDelivery) => {
    if (errDelivery) {
      // console.log(errDelivery);
      // Handle the error here
    } else {
      // Handle success here
    }
  });
};

export const applyCoupon = async (req, res) => {
  let { usage_id, coupon_code, sub_total, user_id } = req.body;
  usage_id = usage_id ? parseInt(usage_id) : null;

  try {
    let couponData, couponUsage;
    const selectCoupon = new Promise((resolve, reject) => {
      let sqlSelect = `SELECT * FROM coupons AS c WHERE c.coupon_name="${coupon_code}" LIMIT 1;`;
      connection.query(sqlSelect, async (errSelect, resultsSelect) => {
        if (errSelect) reject(errSelect);

        if (resultsSelect.length > 0) {
          resolve(resultsSelect[0]);
        } else {
          reject('Invalid Coupon!');
        }
      });
    });
    couponData = await selectCoupon;

    const selectCouponUsage = new Promise((resolve, reject) => {
      let sqlSelect = `SELECT * FROM coupon_usages AS cu WHERE cu.coupon_id="${couponData.id}";`;
      connection.query(sqlSelect, async (errSelect, resultsSelect) => {
        if (errSelect) reject(errSelect);

        resolve(resultsSelect);
      });
    });
    couponUsage = await selectCouponUsage;

    // Check conditions here if coupon is applicable or not

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const discount = calculateCouponDiscount(couponData, sub_total);
    let upsertSql = `INSERT INTO coupon_usages (coupon_id, user_id, discount, usage_date) VALUES (?, ?, ?, ?);`;
    if (usage_id) {
      upsertSql = `UPDATE coupon_usages SET coupon_id = ?, user_id = ?, discount = ?, usage_date = ? WHERE id = ${usage_id};`;
    }
    const upsertData = [couponData.id, user_id, discount, now];
    connection.query(upsertSql, upsertData, (err, result) => {
      if (err) return res.status(502).send({ success: false, message: err });

      if (!usage_id && result.insertId) {
        usage_id = result.insertId;
      }
      return res.status(201).send({
        success: true,
        message: 'Coupon applied!',
        data: { usage_id, discount, coupon_code },
      });
    });
  } catch (error) {
    console.log('catch error - ', error);
    return res.status(502).send({ success: false, message: error });
  }
};

export const removeCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    var sql = `DELETE FROM coupon_usages WHERE id = ${id}`;
    connection.query(sql, (err, result) => {
      if (err)
        return res
          .status(400)
          .send({ success: false, message: err.sqlMessage });
      if (result.affectedRows > 0) {
        return res
          .status(200)
          .send({ success: true, message: 'Coupon removed!' });
      } else {
        return res.status(404).send({ success: false, message: 'Not found!' });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

export const getUserOrderHistory = (req, res) => {
  const userId = req.params.id ? req.params.id : req.user.id;
  try {
    const sql = `SELECT o.*,od.id AS orderDetailId, od.card_id, c.card_name, c.image, od.price, od.quantity, od.start_date, od.subtotal AS itemSubtotal,odc.ecard_no, odc.registered_count, odc.order_detail_id
        FROM orders AS o
        JOIN orderDetails AS od ON od.orderId = o.orderId
        JOIN cards AS c ON c.id = od.card_id
        JOIN e_cards odc ON odc.order_detail_id = od.id
        WHERE o.userId = ${userId};`;
    connection.query(sql, function (err, results) {
      if (err) return res.status(200).send({ success: false, message: err });
      const formatedData = formatHistoryData(results);
      return res.json({ success: true, data: formatedData });
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};

function formatHistoryData(dataset) {
  if (dataset.length == 0) {
    return [];
  }
  const transformedData = [];
  const ordersMap = new Map();

  dataset.forEach((item) => {
    if (!ordersMap.has(item.orderId)) {
      ordersMap.set(item.orderId, {
        orderId: item.orderId,
        userId: item.userId,
        totalAmount: item.totalAmount,
        sub_total: item.sub_total,
        discount_amount: item.discount_amount,
        shipping_cost: item.shipping_cost,
        shipping_type: item.shipping_type,
        billing_first_name: item.billing_first_name,
        billing_last_name: item.billing_last_name,
        billing_email: item.billing_email,
        billing_address: item.billing_address,
        billing_apartment: item.billing_apartment,
        billing_city: item.billing_city,
        billing_postcode: item.billing_postcode,
        billing_phone: item.billing_phone,
        billing_country: item.billing_country,
        shipping_first_name: item.shipping_first_name,
        shipping_last_name: item.shipping_last_name,
        shipping_email: item.shipping_email,
        shipping_address: item.shipping_address,
        shipping_apartment: item.shipping_apartment,
        shipping_city: item.shipping_city,
        shipping_postcode: item.shipping_postcode,
        shipping_phone: item.shipping_phone,
        shipping_country: item.shipping_country,
        payment_status: item.payment_status,
        notes: item.notes,
        orderDetails: [],
      });
    }

    const order = ordersMap.get(item.orderId);
    const orderDetail = {
      order_detail_id: item.order_detail_id,
      card_id: item.card_id,
      card_name: item.card_name,
      image:
        item.image &&
        item.image != null &&
        item.image != 'NULL' &&
        item.image != 'null'
          ? `${process.env.BASE_URL}/uploads/card_images/${item.image}`
          : null,
      price: item.price,
      quantity: item.quantity,
      start_date: item.start_date,
      item_subtotal: item.itemSubtotal,
      orderDetailCards: [
        {
          ecard_no: item.ecard_no,
          registered_count: item.registered_count,
        },
      ],
    };

    const existingOrderDetail = order.orderDetails.find(
      (detail) => detail.order_detail_id === item.orderDetailId
    );
    if (existingOrderDetail) {
      existingOrderDetail.orderDetailCards.push({
        ecard_no: item.ecard_no,
        registered_count: item.registered_count,
      });
    } else {
      order.orderDetails.push(orderDetail);
    }
  });

  ordersMap.forEach((order) => {
    transformedData.push(order);
  });

  return transformedData;
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

function calculateCouponDiscount(couponData, sub_total) {
  let discount = 0;
  if (couponData.discount_type == 'fixed_cart') {
    discount = couponData.coupon_amount;
  } else if (couponData.discount_type == 'percent') {
    discount = (couponData.coupon_amount / 100) * sub_total;
  }

  if (discount > parseFloat(couponData.max_discount)) {
    discount = parseFloat(couponData.max_discount);
  }

  if (discount > sub_total) {
    discount = sub_total;
  }
  return parseFloat(discount.toFixed(2));
}
